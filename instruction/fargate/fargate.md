# Fargate

You can use fargate either with ECS or EKS.

Fargate is really expensive. Perhaps I can just use Lambda to deploy my container.

## ECS

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

https://aws.amazon.com/blogs/compute/building-blocks-of-amazon-ecs/

### Concepts

- **Task definitions**: A description of the containers and parameters used to instantiate a task. Think AMI vs Instance. You need this so you can scale up your tasks.
- **Task**: A task is a grouping of 1 to N containers. For a blog you might have a web server, application server and memory cache container.
- **Scheduler**: Controlled by EC2 to handle the launching, scaling, and deleting of tasks.
- **Service**: Defines the things that need to run and the desired performance characteristics that the scheduler should use to do its job.
- **Cluster**: A collection of EC2 instances or Fargate tasks. Clusters can span AZs. Has the ability to scale and delete.
- **Agent**: When using EC2 there is a Go program that controls the communication of the instance and the cluster.

## Installing

1. Navigate to ECS
1. Create a task definition
   1. Use fargate, linux, 1vCPU, 3 GB
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
