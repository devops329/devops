# AWS Account

Before we get started with anything else, you need to create an account with Amazon Web Services (AWS). You want to do this as soon as possible as you will need it for much of the work in this course and it might take some time to authorize your account.

There are lots of other great vendors out there, but AWS is by far the leader in the space and so it is good for you to get experience with them. Follow these instructions on how to create an [account with AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/). When you create your account make sure you remember your account ID so that you can use it when you log in to the AWS browser console.

## Lease a DNS domain

If you do not own a DNS hostname you will need to go lease one. We will use this for all of your DevOps deployment tasks. You can lease a domain from AWS using Route53 or use a different provider such as [namecheap.com](namecheap.com). You will want to start this process immediately since it might take a while to complete the process.

## What is this going to cost you?

There is no cost to create an account with AWS, you only pay for what you use, and in many cases they will give you a significant starting credit, and [some services are free](https://aws.amazon.com/free) for a short period of time or monthly usage. The services we are going to use include the following:

| Service                 | Purpose                              | Estimated Cost (subject to change)                                                                                      |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **EC2**                 | Server                               | t3.nano $0.0052 an hour ($3.50/month), t3.micro $0.0104 an hour ($7.00/month), t3.small $0.0208 an hour ($14.00/month). |
| **EC2 Elastic IP**      | Keep your IP address between reboots | First one is free if you keep it associated with a running server. $0.0052/hour otherwise.                              |
| **Route 53**            | Domain name                          | $3/year for `click` TLD. More for others.                                                                               |
| **Route 53**            | DNS records                          | $0.50/month for each hosted zone.                                                                                       |
| **RDS**                 | Database                             | $55/month for db.t4g.medium for Aurora. $12/month for db.t4g.micro for MySQL. $3/month for storage.                     |
| **CloudFront**          | Content delivery network             | Free: 1 TB data transfer/month, 10,000,000 HTTPS Requests/month. After that $0.085/TB transfer, $0.0100/10k requests.   |
| **S3**                  | Static frontend files                | Free: 5GB standard storage, 20,000 GET Requests; 2,000 PUT, COPY, POST, or LIST Requests, 100 GB data transfer/month.   |
| **ECR**                 | Docker image repository              | Free: 500 MB/month. After that $0.10/GB.                                                                                |
| **ECS EC2**             | Docker container service             | ECS free. You only pay for the EC2 instance.                                                                            |
| **ECS Fargate**         | Docker container service             | ECS free. Fargate: AMD vCPU/hour $0.03238, GB/hour. 0.03594/hour \* 0.25 vCPU ($9/month)                                |
| **ALB**                 | Load balancing                       | $18/month.                                                                                                              |
| **Certificate Manager** | Web certificate                      | Free.                                                                                                                   |
|                         |                                      | **Estimated monthly cost: `$15` for MySQL, `$10` for Fargate, `$18` for ALB**                                           |
|                         |                                      | **Estimated course cost: `$50 - $120`**                                                                                 |

## ☑ Assignment

1. Create your AWS [account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
1. Create a browser bookmark for your AWS browser console page that contains your account ID. That way you will be able to access your account quickly.
1. Lease a DNS hostname if you don't already own one.

Once you are done, go over to Canvas and submit that you have completed this.
