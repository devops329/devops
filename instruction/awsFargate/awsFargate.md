# Fargate

You can use fargate either with ECS or EKS.

Fargate is really expensive. Perhaps I can just use Lambda to deploy my container.

## ECS

https://aws.amazon.com/blogs/compute/building-blocks-of-amazon-ecs/

### Concepts

- **Task definitions**: A description of the containers and parameters used to instantiate a task. Think AMI vs Instance. You need this so you can scale up your tasks.
- **Task**: A task is a grouping of 1 to N containers. For a blog you might have a web server, application server and memory cache container.
- **Scheduler**: Controlled by EC2 to handle the launching, scaling, and deleting of tasks.
- **Service**: Defines the things that need to run and the desired performance characteristics that the scheduler should use to do its job.
- **Cluster**: A collection of EC2 instances or Fargate tasks. Clusters can span AZs. Has the ability to scale and delete.
- **Agent**: When using EC2 there is a Go program that controls the communication of the instance and the cluster.

### Create an ECS task

Created a task definition that references my ECR image using fargate.

- Navigate to the ECS service
- Select `Task definitions`
- Press `Create new task definition`
- Define the task basics
  - Give the task a name: `webserver`
  - Infrastructure requirements: `AWS Fargate`
  - Linux/X86/64 (I guess I can also do ARM if my container is set for that $0.040 vs $0.032.
  - .5 vCPU
  - Choose the task role (this allows ECS to execute the task on my behalf)
  - Choose the task execution role (this allows my task to do things like make Aurora calls)
- Define the container the task will run
  - Copy the image URI from ECR
  - Specify the port mapping 80-3000
  - I enabled log collection to cloudwatch so I can see what happens
- Press create task

## Create a cluster

The cluster specifies where the service runs (EC2 or Fargate)

- Named it `webserver`

This kicked off a cloudformation script.

### Deploy a service

From the task definition page choose to deploy or from the cluster/services pane create a service.

A service defines the execution parameters for the task on the cluster.

- You can define a capacity provider. This will seek to create instances from the provide. Like Fargate or Fargate spot.
- Select service type to be service (instead of task) since it will keep running.
- Specify the family (I believe this pulled from the task definition)
- Specify replica
- Desired tasks: 1

This kicked off a cloudformation script.

This failed to launch my service. Tried to launch the task multiple times with the same error:

```txt
exec /usr/local/bin/docker-entrypoint.sh: exec format error
```

Spot pricing is very interesting. That drops the price to $0.012.
