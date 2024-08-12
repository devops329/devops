# AWS Account

🔑 **Key points**

- You are required to have an AWS account.
- You are required to lease a DNS hostname.
- Make sure you are acquainted with your AWS bill.

---

Before we get started with anything else, you need to create an account with Amazon Web Services (AWS). Do this as soon as possible as you will need it for much of the work in this course, and it might take some time to authorize your account.

There are lots of other great vendors out there, but AWS is by far the leader in the space, so it is good for you to get experience with them. Follow these instructions on how to [create an account with AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/). When you create your account make sure you remember your account ID so that you can use it when you log in to the AWS browser console.

## Lease a DNS domain

If you do not own a DNS hostname you will need to go lease one. We will use this for all of your DevOps deployment tasks. You can lease a domain from AWS using Route53 or use a different provider such as [namecheap.com](namecheap.com). You will want to start this process immediately since it might take a while to complete the process.

## What is this going to cost you?

There is no cost to create an account with AWS; you only pay for what you use. In many cases they will give you a significant starting credit, and [some services are free](https://aws.amazon.com/free) for a short period of time or monthly usage. The services we are going to use include the following:

| Service                 | Purpose                       | Estimated Cost (subject to change)                                                                                      |
| ----------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **EC2**                 | Server                        | t3.nano $0.0052 an hour ($3.50/month), t3.micro $0.0104 an hour ($7.00/month), t3.small $0.0208 an hour ($14.00/month). |
| **Public IP Address**   | Public internet access        | $0.005 per In-use public IPv4 address per hour. ($4/month)                                                              |
| **Route 53**            | Domain name                   | $3/year for `click` TLD. More for others.                                                                               |
| **Route 53**            | DNS records                   | $0.50/month for each hosted zone.                                                                                       |
| **RDS**                 | Database                      | $12/month for a MySQL db.t4g.micro instance. $3/month for storage.                                                      |
| **CloudFront**          | Content delivery network      | Free: 1 TB data transfer/month, 10,000,000 HTTPS Requests/month. After that $0.085/TB transfer, $0.0100/10k requests.   |
| **S3**                  | Static frontend files         | Free: 5GB standard storage, 20,000 GET Requests; 2,000 PUT, COPY, POST, or LIST Requests, 100 GB data transfer/month.   |
| **ECR**                 | Docker image repository       | Free: 500 MB/month. After that $0.10/GB.                                                                                |
| **ECS EC2**             | Docker container service      | ECS is free. You only pay for the EC2 instance.                                                                         |
| **ECS Fargate**         | Docker container service      | ECS is free. Fargate: ARM vCPU/hour $0.03238, $0.00356 1 GB/hour. With a 0.25 vCPU 0.011551/hr. ($0.30/hour, $9/month)  |
| **EC2 ALB**             | Load balancing                | $18/month.                                                                                                              |
| **Certificate Manager** | Web certificate               | Free.                                                                                                                   |
| **CloudFormation**      | Generate automation templates | Free.                                                                                                                   |
|                         |                               | **Estimated monthly cost: `$15` for MySQL, `$10` for Fargate, `$18` for ALB, `$4` for IP Address**                      |
|                         |                               | **Estimated course cost: `$50 - $120`**                                                                                 |

## Stopping your resources

You can reduce your monthly bill significantly if you stop your resources when you are not using them. The downside of this approach is that you will need to make sure your system is available when you are doing development work and also when passing off assignments. That will take time and might cause significant frustration if not done correctly. Using automation can greatly help reduce the time required to manually configure your architecture between uses.

## Billing Management

An important part of developer operations is to understand how the architecture choices you make impact the cost of doing business. You should carefully consider every service that you deploy and how much that will cost you. You then want to set up processes to both monitor and alert on those expenditures to make sure they match the anticipated amounts.

AWS provides extensive reporting tools for billing and cost exploration. These tools are available form on the AWS browser console under the `Billing and Cost Management` service. You are highly encouraged to spend time understanding everything that is provided there.

Below is an example billing report that shows the charges for load balancing, IPv4 address allocation, and Fargate.

![Billing report](billingReport.png)

### Billing alerts

By default, AWS will create _Free Tier alerts_ for you. These will email you whenever you come within a certain percentage threshold of your allocated free tier resource.

Additionally, you can create your own billing alerts that will notify you for other cases. For example, you can create an alert whenever you spend more than $10 in a 30-day period.

To learn more about billing alerts refer to the [AWS documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html) on this subject.

## ☑ Assignment

1. Create your AWS [account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
1. Create a browser bookmark for your AWS browser console page that contains your account ID. That way you will be able to access your account quickly.
1. Lease a DNS hostname if you don't already own one.

Once you are done, go over to Canvas and submit that you have completed this.
