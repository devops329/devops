# Fargate

1. Navigate to ECS
1. Create a task definition
   1. Use fargate, linxu, 1vCPU, 3 GB
   1. You can specify a role if you want to use other AWS services
   1. You need a task execution role so that Fargate can do its work
   1. I supplied the URI for my container on dockerhub. Not sure this is right. docker.io/leesjensen/cs329:linux-v2
   1. It looks like is either used or created the task execution role (ecsTaskExecutionRole)
1. Create a cluster
   1. Chose the AWS Fargate Infrastructure option (other options include EC2 instances)
   1. This apparently runs as a cloudformation stack. It failed for me the first time. So I went to cloudformation and told it to retry. This time it worked.
   1. Back in the Fargate console my cluster appears.
   1. Create a service in the cluster
      1. Selected the capacity provider strategy
      1. Used FARGATE as the capacity provider
      1. Select the task definition I created above
      1. Deployment configuration is Service (not task) since I want it to keep running.
      1. There are options for the desired number of tasks to launch (I chose 1)
      1. There are deployment options for `rolling update` or `blue/green`
      1. There are options to use a `task definition`. This defines how the task will run
      1. Options for a load balancer. This would be nice but maybe expensive
      1. You can also auto scale based on cloudwatch alarms
