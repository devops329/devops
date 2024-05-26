# AWS Cloud Formation

We have been doing a lot of manual manipulation of AWS in order to setup our automated CI pipeline. As we have stressed previously, manual work, or toil, is the enemy of DevOps. You would think that this only has to be done once and so automation is not really necessary. However, there are some very important reasons to automate this work.

1. Disaster recovery
1. Building out new environment for staging, penetration testing, or marketing.
1. Documenting the architecture

Here is the stack to create the ECS cluster.

```json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "The template used to create an ECS Cluster from the ECS Console.",
  "Parameters": {
    "ECSClusterName": {
      "Type": "String",
      "Description": "Specifies the ECS Cluster Name with which the resources would be associated",
      "Default": "webserver"
    },
    "SecurityGroupIds": {
      "Type": "CommaDelimitedList",
      "Description": "Optional - Specifies the Comma separated list of the Security Group Id of an existing Security Group.",
      "Default": ""
    },
    "VpcId": {
      "Type": "String",
      "Description": "Optional - Specifies the ID of an existing VPC in which to launch your container instances. If you specify a VPC ID, you must specify a list of existing subnets in that VPC. If you do not specify a VPC ID, a new VPC is created with at least 1 subnet.",
      "Default": "",
      "AllowedPattern": "^(?:vpc-[0-9a-f]{8,17}|)$",
      "ConstraintDescription": "VPC Id must begin with 'vpc-' and have a valid uuid"
    },
    "SubnetIds": {
      "Type": "CommaDelimitedList",
      "Description": "Optional - Specifies the Comma separated list of existing VPC Subnet Ids where ECS instances will run",
      "Default": ""
    }
  },
  "Resources": {
    "ECSCluster": {
      "Type": "AWS::ECS::Cluster",
      "Properties": {
        "ClusterName": {
          "Ref": "ECSClusterName"
        },
        "CapacityProviders": ["FARGATE", "FARGATE_SPOT"],
        "ClusterSettings": [
          {
            "Name": "containerInsights",
            "Value": "disabled"
          }
        ],
        "Configuration": {
          "ExecuteCommandConfiguration": {
            "Logging": "DEFAULT"
          }
        },
        "ServiceConnectDefaults": {
          "Namespace": "webserver"
        },
        "Tags": []
      }
    }
  },
  "Outputs": {
    "ECSCluster": {
      "Description": "The created cluster.",
      "Value": {
        "Ref": "ECSCluster"
      }
    }
  }
}
```

Here is the stack to create the ECS service including a load balancer.

```json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "The template used to create an ECS Service from the ECS Console.",
  "Parameters": {
    "ECSClusterName": {
      "Type": "String",
      "Default": "jwt-pizza-service"
    },
    "ECSServiceName": {
      "Type": "String",
      "Default": "jwt-pizza-service"
    },
    "SecurityGroupIDs": {
      "Type": "CommaDelimitedList",
      "Default": "sg-09faf61cee5f6a364"
    },
    "SubnetIDs": {
      "Type": "CommaDelimitedList",
      "Default": "subnet-fe972497,subnet-88fa3ef3,subnet-2c968f66"
    },
    "VpcID": {
      "Type": "String",
      "Default": "vpc-192e8e70"
    },
    "LoadBalancerName": {
      "Type": "String",
      "Default": "jwt-pizza-service"
    }
  },
  "Resources": {
    "ECSService": {
      "Type": "AWS::ECS::Service",
      "Properties": {
        "Cluster": "jwt-pizza-service",
        "TaskDefinition": "arn:aws:ecs:us-east-2:464152414144:task-definition/jwt-pizza-service:8",
        "LaunchType": "FARGATE",
        "ServiceName": "jwt-pizza-service",
        "SchedulingStrategy": "REPLICA",
        "DesiredCount": 1,
        "LoadBalancers": [
          {
            "ContainerName": "jwt-pizza-service",
            "ContainerPort": 80,
            "LoadBalancerName": {
              "Ref": "AWS::NoValue"
            },
            "TargetGroupArn": {
              "Ref": "TargetGroup"
            }
          }
        ],
        "HealthCheckGracePeriodSeconds": "5",
        "NetworkConfiguration": {
          "AwsvpcConfiguration": {
            "AssignPublicIp": "ENABLED",
            "SecurityGroups": {
              "Ref": "SecurityGroupIDs"
            },
            "Subnets": {
              "Ref": "SubnetIDs"
            }
          }
        },
        "PlatformVersion": "LATEST",
        "DeploymentConfiguration": {
          "MaximumPercent": 200,
          "MinimumHealthyPercent": 100,
          "DeploymentCircuitBreaker": {
            "Enable": true,
            "Rollback": true
          }
        },
        "DeploymentController": {
          "Type": "ECS"
        },
        "ServiceConnectConfiguration": {
          "Enabled": false
        },
        "Tags": [],
        "EnableECSManagedTags": true
      },
      "DependsOn": ["Listener"]
    },
    "LoadBalancer": {
      "Type": "AWS::ElasticLoadBalancingV2::LoadBalancer",
      "Properties": {
        "Type": "application",
        "Name": "jwt-pizza-service",
        "SecurityGroups": {
          "Ref": "SecurityGroupIDs"
        },
        "Subnets": {
          "Ref": "SubnetIDs"
        }
      }
    },
    "TargetGroup": {
      "Type": "AWS::ElasticLoadBalancingV2::TargetGroup",
      "Properties": {
        "HealthCheckPath": "/",
        "Name": "jwt-pizza-service",
        "Port": 80,
        "Protocol": "HTTP",
        "TargetType": "ip",
        "HealthCheckProtocol": "HTTP",
        "VpcId": {
          "Ref": "VpcID"
        },
        "TargetGroupAttributes": [
          {
            "Key": "deregistration_delay.timeout_seconds",
            "Value": "300"
          }
        ]
      }
    },
    "Listener": {
      "Type": "AWS::ElasticLoadBalancingV2::Listener",
      "Properties": {
        "DefaultActions": [
          {
            "Type": "forward",
            "TargetGroupArn": {
              "Ref": "TargetGroup"
            }
          }
        ],
        "LoadBalancerArn": {
          "Ref": "LoadBalancer"
        },
        "Port": "443",
        "Protocol": "HTTPS",
        "Certificates": [
          {
            "CertificateArn": "arn:aws:acm:us-east-2:464152414144:certificate/b1b28828-49cc-4b3b-a5a8-9a069e329066"
          }
        ]
      }
    }
  },
  "Outputs": {
    "ClusterName": {
      "Description": "The cluster used to create the service.",
      "Value": {
        "Ref": "ECSClusterName"
      }
    },
    "ECSService": {
      "Description": "The created service.",
      "Value": {
        "Ref": "ECSService"
      }
    },
    "LoadBalancer": {
      "Description": "The created load balancer.",
      "Value": {
        "Ref": "LoadBalancer"
      }
    },
    "Listener": {
      "Description": "The created listener.",
      "Value": {
        "Ref": "Listener"
      }
    },
    "TargetGroup": {
      "Description": "The created target group.",
      "Value": {
        "Ref": "TargetGroup"
      }
    }
  }
}
```
