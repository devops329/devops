# Introduction

Software development management covers everything necessary to successfully take the application code from the developer's IDE into the hands of a customer.

In the 1960s and 70s software applications reached a level of complexity that required significant organizational infrastructure to deploy it into the hands of a customer. This usually meant that a vendor employed teams of consultants that would visit a customer's physical location and install the software. The consultants would then return to provide maintenance patches and upgrades. Beginning in the late 1990s this shifted to solutions that were deployed to the application vendor's data center and then accessed by the customer over the internet. The consultants then became operational staff that managed the data center and controlled how, and when, an application was delivered to a customer.

Application engineers were charged with adding customer value to the application. Operations was charged with making sure the application was stable and accessible to the customer. This resulting in a natural conflict of interest between application engineering and operations that harmful both the interests of the company and the customer. Application engineers wants to quickly build new value. Operations wants to keep things stable. Changes broke existing functionality or destroyed existing data. Stability slowed the deployment of enhancements, security updates, and bug fixes from reaching the customer.

Both aims are good, but when they become entrenched in organization bureaucracy, the competing goals create a stalemate that harms everyone.

## Agile and the birth of devops

The Agile Revolution created a mental shift that changed all of that. String in the mid 90s Agile techniques were changing how software was developed. Agile methodologies encouraged moving quickly, with small incremental steps, that were verified by automated testing, and easily reversible due to quality coding practices and version control.

These practices helped the industry build larger, more complex software, faster. Once we became adept in applying Agile principles to software development, we naturally saw the opportunity to apply Agile principles to software delivery. This resulted in the role of a developer/operations hybrid called **devops** that broken down the wall between building features and deploying those features.

## Developer operations - Automate deployment

Initially a devops engineer was an extension of the software engineer's role. Not only did an engineer built the application, but they deploy it to the customer.

The key to the success of developer operations was focuses on accelerating four major goals.

1. **Versioning** - Providing easy, trackable, reversible, modifications.
1. **Testing** - Verify quality.
1. **Deployment** - Deploying and reversing deployment.
1. **Management** - Surfacing and controlling all operational aspects of the system.

In order to accomplished these goals, a successful devops team focuses on _drastically removing human involvement_ (**Toil**), and replacing it with _automated processes_ (**Infrastructure as Code**). By solving the software delivery problem with automation, we remove the slow, error prone, human involvement and replace it with processes that run continuously, quickly, and predictably. We also enable the ability to immediately reverse deployments that fail and therefore reduce the impact on the customer. Even the detection of failure is turned over to automated processes. This removes the need for constant human monitoring of the application.

Devops broke down the barrier between application engineering and Operations, and replaced it with automation. Features were built and delivered to customers at unprecedented speed. While at the same time quality and satisfaction increased.

## Cloud services - Automate hardware deployment

The next revolution came in the early 2000s when cloud services such as Amazon Web Services (AWS) started provided elastic computing, large storage capacity, managed databases, and global networking solutions. These services were all available via application programming interfaces (APIs). That meant they were a perfect fit for the devops mindset. Previously a devops engineer focused on automating application building, testing, deployment, and management. With cloud services, the devops engineer could also automate the infrastructure scale, capacity, and performance characteristics.

In many companies this almost completely removed the role of an Operations department from the software delivery management process. No longer did a company need to build and manage a costly data center and manually deploy software and hardware. A small team of software engineers could piece together an automated process that would remove the human element from the process and greatly increase the velocity of application development, deployment, customer satisfaction, and profits.

## Site reliability engineering

As the idea of devops grew, it tended to become its own role within large organizations. This resulted in devops teams that worked with the application engineers to deliver software.

For example, Google codified devops practices into a Site Reliability Engineer (SRE) role. This is an independent organization within Google that seeks to create stability for the customer while increasing velocity of new feature value. They have even written multiple [books](https://sre.google/books/) on the subject.

## Platform engineering

As devops built more and more infrastructure to automate the delivery of software, they established a set of best practices and tools. This resulted in centralize refinement of those practices and tools, and created the **Platform Engineer** role. A platform engineering team serves as a service team that provides the tools that an application team needs to get their software into production.

## Software delivery goals

Regardless if your role is an application engineer, site reliability engineer, or platform engineer, you all share same primary goals in order to delivery software to the customer.

1. Optimize customer satisfaction, velocity, scalability, and cost.
1. Treat testing, deployment, and management as a programming problem.
1. Minimize human involvement.

The purpose of this course is to teach you the techniques and the tools that are necessary to master their implementation.
