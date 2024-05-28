# AWS Cloud Formation

📖 **Deeper dive reading**: [CloudFormation getting started](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/gettingstarted.templatebasics.html)

## Why is automation so important?

We have been doing a lot of manual manipulation of AWS in order to setup our automated CI pipeline. As we have stressed previously, manual work, or toil, is the enemy of DevOps. It is easy to justify the work you did to set up your JWT Pizza cloud hosting environment as a one time effort. Furthermore, setting up automation takes effort. You are basically writing, or scripting, a program to allow for the automatic execution of your CI pipeline. However, there are some very good reasons to reduce toil and automate as much as you can.

1. **Disaster recovery**: There is always the possibility of a significant system failure. Extreme weather can knock out data centers, human error can bring down networks for hours, and hardware simply degrades and eventually stops working. Having code that you can execute to immediately restore your critical infrastructure is one of the characteristics that differentiates world class organizations from hacker shops.
1. **Creating new environments**: If you have automation that can rebuild your production environment, then it is an easy extension to use that automation to build new environments for things like staging, external auditing, penetration testing, or market testing. This makes your company more agile and responsive to market demands.
1. **Documentation**: Chances are that you are not going working on the exact same system forever. You need to leave behind the kind of documentation for how the system works that you would like to have. Automation helps to fill this need. It serves as clear documentation of how the system is configured, and just like automated testing, it allows you to enhance your CI pipeline without introducing regression errors.

## CloudFormation

CloudFormation is AWS's primary automation tool. With CloudFormation you can create a parameterized JSON file that describe each piece of your system architecture. You can then supply the JSON file to CloudFormation and it will build the entire system. It also allows you to teardown everything that was created. That way you can easily experiment with alternative architectures, reproduce existing architectures, and execute disaster recovery drills.

A basic CloudFormation template that creates an S3 bucket looks like this:

```json
{
  "Resources": {
    "HelloWorldS3Bucket": {
      "Type": "AWS::S3::Bucket"
    }
  }
}
```

Save the above example to a file named `hello-world-ci.json` in your development environment.

1. Open the AWS browser console and navigate to the CloudFormation service.
1. Press `Stacks` from the left side navigation panel.
1. Press `Create stack` and select the option **With new resources**.
1. Select `Upload a template file` and select the `hello-world-ci.json` file. This will create a bucket for your CloudFormation templates, if you don't already have one, and copy the file to S3. Note that as an alternative to uploading a file, you can keep your templates in an S3 bucket that you manage, or sync them from a Git repository.

   ![alt text](image.png)

1. Press `Next`.
1. Give the stack the name `helloWorld`.

# OLD STUFF -------------------------------------

This is the stack used to create the pizza-service-alb

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
      "Default": "jwt-pizza-service-alb"
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
        "CapacityProviderStrategy": [
          {
            "CapacityProvider": "FARGATE",
            "Base": 0,
            "Weight": 1
          }
        ],
        "TaskDefinition": "arn:aws:ecs:us-east-2:464152414144:task-definition/jwt-pizza-service:8",
        "ServiceName": "jwt-pizza-service-alb",
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
        "NetworkConfiguration": {
          "AwsvpcConfiguration": {
            "AssignPublicIp": "DISABLED",
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
        "HealthCheckPath": "/api/docs",
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

````json
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
ECS cluster, service, and ALB example from CloudFormation documentation.

```json
{
    "AWSTemplateFormatVersion": "2010-09-09",
    "Description": "The template used to create an ECS Service associated with an Application Load Balancer.",
    "Parameters": {
      "SecurityGroupIDs": {
        "Type": "CommaDelimitedList",
        "Default": "sg-1234567890abcdef0,sg-021345abcdef67890"
      },
      "SubnetIDs": {
        "Type": "CommaDelimitedList",
        "Default": "subnet-abcdef01234567890,subnet-fedcba01234567098,subnet-2135647890abcdef0"
      },
      "VpcID": {
        "Type": "String",
        "Default": "vpc-3214789650abcdef0"
      }
    },
    "Resources": {
        "ECSCluster": {
            "Type": "AWS::ECS::Cluster",
            "Properties": {
                "ClusterName": "ALBCluster"
            }
        },
      "ECSService": {
        "Type": "AWS::ECS::Service",
        "Properties": {
          "Cluster": {"Ref":"ECSCluster"},
          "TaskDefinition": "arn:aws:ecs:us-east-1:111122223333:task-definition/first-run-task:7",
          "LaunchType": "FARGATE",
          "ServiceName": "alb",
          "SchedulingStrategy": "REPLICA",
          "DesiredCount": 3,
          "LoadBalancers": [
            {
              "ContainerName": "first-run-task",
              "ContainerPort": 80,
              "LoadBalancerName": {
                "Ref": "AWS::NoValue"
              },
              "TargetGroupArn": {
                "Ref": "TargetGroup"
              }
            }
          ],
          "HealthCheckGracePeriodSeconds": "20",
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
        "DependsOn": [
          "Listener"
        ]
      },
      "LoadBalancer": {
        "Type": "AWS::ElasticLoadBalancingV2::LoadBalancer",
        "Properties": {
          "Type": "application",
          "Name": "alb-test",
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
          "Name": "ecs-task-m-alb",
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
          "Port": 80,
          "Protocol": "HTTP"
        }
      }
    },
    "Outputs": {
      "ClusterName": {
        "Description": "The cluster used to create the service.",
        "Value": {
          "Ref": "ECSCluster"
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
````
