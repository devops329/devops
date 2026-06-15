# Cloud deployment

🔑 **Key points**

- AWS provides a rich set of cloud-based services.
- Use these services to deploy the JWT Pizza application.

---

Hosting on GitHub is sufficient for simple static websites that do not require significant scaling. However, if you want to reach a large global audience with an architecture that is resilient and elastic, you need to deploy to a cloud environment that can meet those demands. To take things to the next level, we are going to move to Amazon Web Services (AWS).


## Advantages of a cloud deployment

Cloud deployment refers to the process of deploying an application through one or more hosting models—such as Software as a Service (SaaS), Platform as a Service (PaaS), or Infrastructure as a Service (IaaS)—that leverage a cloud provider's infrastructure. Traditionally, organizations had to purchase, house, and maintain physical servers in their own data centers. Cloud deployment shifts this responsibility to providers like AWS, Azure, or Google Cloud, allowing businesses to focus on code and customer experience rather than hardware maintenance.

The primary purpose of cloud deployment is to provide **agility** and **elasticity**. In a traditional environment, scaling up required weeks of hardware procurement and installation. In the cloud, scaling is a matter of API calls or automated triggers. This allows applications to handle sudden spikes in traffic without manual intervention and, more importantly, to scale back down when the demand subsides, ensuring resources are not wasted.

The value proposition of cloud deployment is often categorized into several key pillars:

*   **Cost Optimization:** Shifting from Capital Expenditure (CAPEX)—buying expensive hardware upfront—to Operational Expenditure (OPEX), where you pay only for what you use.
*   **Global Reach:** Cloud providers have data centers worldwide. Deploying an application to a new geographic region takes minutes, reducing latency for international users.
*   **Reliability:** Built-in redundancy and failover mechanisms ensure that if one physical server fails, the application automatically migrates to another, maintaining high availability.
*   **Speed to Market:** Developers can provision entire environments (testing, staging, production) instantly using Infrastructure as Code (IaC), significantly shortening the software development lifecycle (SDLC).



## The Case for Self-Hosting: Control, Compliance, and Cost

While the "Cloud First" mantra dominates modern software development, there are specific scenarios where hosting your own solution—either on-premises or on private infrastructure—is the superior choice. The decision to move away from managed services (like AWS RDS or Google Kubernetes Engine) toward a self-hosted model usually centers on three pillars: **Data Sovereignty**, **Customization**, and **Long-term Cost Predictability**.

For many organizations, regulatory requirements dictate exactly where data resides and who has access to it. In industries like healthcare, defense, or high-finance, "Black Box" managed services can be a liability. Self-hosting allows an organization to audit the entire stack, from the physical hardware and networking layer to the operating system kernel. This level of transparency is often impossible with public cloud providers who operate on a shared responsibility model.

The following list highlights the primary reasons an engineering team might opt for a self-hosted deployment:

*   **Data Sovereignty & Compliance:** Strict laws (like GDPR or HIPAA) may require data to stay within specific geographic borders or on air-gapped hardware.
*   **Hardware Specialization:** If your application requires specific GPU architectures, high-performance NVMe storage configurations, or FPGA integration that cloud providers don't offer or charge a massive premium for.
*   **Cost at Scale:** While the cloud is cheaper to start, the "cloud tax" becomes significant at massive scales. For steady-state workloads with predictable traffic, owning the hardware often results in a lower Total Cost of Ownership (TCO) over a 3-5 year hardware lifecycle.
*   **Legacy Integration:** Applications that need microsecond-latency access to local legacy mainframes or specialized industrial equipment often cannot tolerate the latency of a round-trip to a cloud data center.

## JWT cloud deployment

Specifically, you will deploy the `jwt-pizza` frontend to AWS S3 and the `jwt-pizza-service` backend to AWS Fargate. The following diagram shows all the AWS services involved in supporting this architecture.

![Cloud deployment](cloudDeployment.png)

### Architecture pieces

We will eventually explore the details of each service in the architecture diagram above, including their specific functions, setup processes, and how to connect them. In the meantime, the following table provides a general overview of each service's role.

| Service             | Description                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Route 53            | A scalable Domain Name System (DNS) service that routes web traffic to your frontend and backend resources.                 |
| CloudFront          | A Content Delivery Network (CDN) that caches and distributes your frontend static files globally for low-latency access.   |
| S3                  | Scalable object storage used to host your frontend's static assets.                                                        |
| Certificate Manager | Manages SSL/TLS certificates to enable secure (HTTPS) network communication.                                               |
| ALB                 | Application Load Balancer that distributes incoming backend requests across multiple containers.                           |
| ECR                 | Elastic Container Registry; a Docker container registry used to store and manage your backend container images.            |
| ECS                 | Elastic Container Service; a container orchestration service that manages deployments and monitors system health.          |
| Fargate             | A serverless compute engine for containers that manages scaling and infrastructure automatically as load increases.        |

### Phased build-out

You will build this architecture by following these steps:

1. **Migrate the frontend hosting to AWS**
   1. Disable GitHub Pages hosting.
   1. Manually set up CloudFront, S3, Certificate Manager, and Route 53.
   1. Perform a manual deployment to S3.
   1. Modify your frontend deployment GitHub Actions workflow to push updates to S3.
1. **Migrate the backend hosting to AWS**
   1. Containerize your backend service using Docker.
   1. Manually set up ECR, ECS, ALB, and Fargate.
   1. Perform a manual deployment to ECR and trigger the deployment with ECS.
   1. Modify your backend deployment GitHub Actions workflow to push to ECR and trigger the ECS deployment.
1. **Automate the infrastructure**
   1. Create CloudFormation scripts to provision and tear down your frontend and backend services from scratch.

Following this process will create a fully automated, cloud-scale architecture capable of supporting any level of growth JWT Pizza achieves.

## ☑ Exercise

```masteryls
{"id":"6d7276ff-ea09-47e4-b91e-acc2a42bd301","title":"The Core Value of Cloud Deployment","type":"multiple-choice"}
What is the primary financial advantage of moving from on-premises deployment to a cloud deployment model?

- [ ] It eliminates the need for any operational spending (OPEX).
- [x] It shifts costs from Capital Expenditure (CAPEX) to Operational Expenditure (OPEX), allowing for a pay-as-you-go model.
- [ ] It guarantees that the total cost of ownership will always be lower, regardless of usage patterns.
- [ ] It allows companies to own the physical hardware located in the provider's data center for tax depreciation.
```

```masteryls
{"id":"7c29ab2b-fbe2-4754-8976-3264af25f583","title":"Identifying Self-Hosting Triggers","type":"multiple-choice"}
An international bank is launching a new application that processes highly sensitive financial records. Due to national security laws, the data must be stored on physical servers located within the country's borders, and the bank must have the ability to perform physical audits of the server hardware. Which deployment model is most appropriate?

- [x] A self-hosted solution on private infrastructure
- [ ] A Multi-Cloud strategy using AWS and Azure
- [ ] Serverless functions (FaaS) for maximum scalability
- [ ] A managed SaaS (Software as a Service) platform
```



## A bit of fun

![XKCD Automation](xkcdDatacenterScale.png)

> _source: [XKCD](https://xkcd.com/1737/)_