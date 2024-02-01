# Introduction

Software development management covers everything necessary to successfully take the application code from the developer's IDE into the hands of a customer.

In the 1960s and 70s general software applications reached a level of complexity that required significant organizational infrastructure to deploy it into the hands of a customer. This usually meant that a vendor employed teams of consultants that would visit a customer's physical location and install the software. The consultants would then return to provide maintenance patches and upgrades. Beginning in the 1990s this shifted to cloud based solutions that were deployed to the application vendor's data center and then accessed by the customer over the internet. The consultants then turned into information technology staff (IT) that managed the data center and controlled how and when an application was delivered to a customer.

Application engineers were charged with adding customer value to the application. IT was charged with making sure the application was stable and accessible to the customer. This resulting in a natural conflict of interest between application engineering and IT that was harmful to both the efforts of the company and the desires of the customer. Application engineers wanted to quickly build new value. This resulted in functionality that broke exiting functionality or destroyed existing data. IT want to keep things stable. This resulting

Building an application and deploying an application have conflicting interests that are harmful to the customer. Application engineering wants to build features as quickly as possible. IT wants to prevent any change that might cause instability to a customer.

## Developer operations - Automate deployment

The keys goals for devops success are:

1. **Version Control** - Allow for easy, trackable, reversible, modifications.
1. **Testing** - Quickly verify quality.
1. **Deployment** - Quickly deploy, verify, and reverse deployment.
1. **Management** - Instantaneously surface all operational aspects of the system.

In order to accomplished these goals, a successful devops team focuses on _eliminating all human involvement_ (**Toil**), and replacing it with _automated processes_ (**Infrastructure as Code**). By solving the software delivery problem with infrastructure as code, we remove the, slow, error prone human involvement and replace it with processes that run continuously, quickly, and predictably. We can also immediately reverse deployments that fails and therefore reduce the impact on the customer. Even the detection of failure is turned over to automated processes. This removes the need for constant human monitoring of the application.

## Cloud services - Automate hardware deployment

In the early 2000s cloud services such as Amazon Web Services (AWS) started provided powerful elastic computing, extremely large storage capacity, managed databases, and global network solutions. These services were all available via application programming interfaces. That meant they were a perfect fit for the devops mindset. Previously we automated our application building, testing, deployment, and management. With cloud services we can automate our infrastructure scale, capacity, and performance characteristics.

In many companies this almost completely removed the role of an IT department for the software delivery management process. No longer did a company need to build a data center and manually deploy software and hardware. A small team of software engineers could piece together an automated process that would remove the human element from the process and greatly increase the velocity of application development, deployment, customer satisfaction, and profits.

1. Testing, deployment, and management is a programming problem.
1. Eliminate all human involvement.
1. Optimize customer satisfaction, velocity, scalability, and cost.

How devops helped solve this problem. How SRE at Google codified patterns to implement devops.

Platform engineering wants to codify all best practices into a platform that is used by all.
