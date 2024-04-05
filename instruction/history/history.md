# Introduction

This course covers everything necessary to successfully take an application from the developer's development environment and deliver it into a customer accessible production environment.

Surprisingly little has changed about how software engineers build an application, but the process of delivering software has changed drastically in the last two decades. In the early days of computing, the expense and complexity of hardware required the customer to bring their data to the vendor office for processing. In the 1960s and 70s, computing solutions became cheaper and so customers started hosting their own hardware at their offices. The software vendor then hired teams of consultants to visit a customer's physical location and install the software on their computers. The consultants would then return later to provide regular maintenance patches and upgrades. When the internet boomed in the late 1990s the hosting of software moved back to the vendor's data center, and access was given to the customer to use the software from their web browser. All of the vendor's software delivery consultants then got new jobs as data center operational staff. The Operations staff managed the data center hardware and controlled how, and when, an application was delivered to the computers running in the data center.

In this model, application engineers were charged with adding customer value to the application. Operations were charged with making sure the application was stable and accessible to the customer. This resulted in a natural conflict of interest between application engineering and operations that was harmful to the interests of both the company and the customer. Application engineers want to quickly build new value. Operations wants to keep things stable. Changes broke existing functionality or destroyed existing data. Stability slowed the deployment of enhancements, security updates, and bug fixes from reaching the customer.

Both aims are good, but when they become entrenched in organizational bureaucracy, the competing goals create a software delivery bottleneck that harms both the customers and the profits of the vendor.

## Agile and the birth of devops

Starting in the mid 90s, Agile techniques were having a major impact on how software was developed. Agile methodologies encouraged moving quickly, with small incremental steps that were verified by automated testing, and easily reversible due to quality coding practices and version control.

These practices helped the industry build larger, more complex software, faster. Once we became adept in applying Agile principles to software development, we naturally saw the opportunity to apply Agile principles to the software delivery bottleneck. This resulted in the role of a developer/operations hybrid called **devops** that broke down the wall between building and deploying applications.

## Developer operations - Automate application deployment

Initially a devops engineer was an extension of the application engineer's role. Not only did an engineer write software for the application, but they wrote software that automatically deployed it to the customer.

The key to the success of devops focused on the automation and acceleration of four major goals.

1. **Versioning** - Providing easy, trackable, reversible, modifications.
1. **Testing** - Verify quality.
1. **Deployment** - Deploying and reversing deployment.
1. **Management** - Monitoring and controlling all operational aspects of the system.

In order to accomplish these goals, a successful devops team focuses on _drastically removing human involvement_ (**Toil**), and replacing it with _automated processes_ (**Infrastructure as Code**). By solving the software delivery problem with automation, we remove the slow, error prone, human involvement and replace it with processes that run continuously, quickly, and predictably. We also enable the ability to immediately reverse deployments that fail and therefore reduce the impact on the customer. Even the detection of failure is turned over to automated processes. This removes the need for the constant human monitoring of the application.

Devops broke down the barrier between application engineering and operations, and replaced it with automation. This resulted in applications being built and delivered to customers at unprecedented speed. While, paradoxically, the application quality and customer satisfaction increased dramatically.

## Cloud services - Automate hardware deployment

The next revolution came in the early 2000s when cloud services such as Amazon Web Services (AWS) started providing elastic computing, large storage capacity, managed databases, and global networking solutions. These services were accessible via application programming interfaces (APIs). That meant they were a perfect fit for the devops automation mindset. Previously a devops engineer focused on automating application building, testing, deployment, and management. With cloud services, the devops engineer could also automate the infrastructure scale, capacity, and performance characteristics.

In many companies this almost completely removed the role of an operations department from the software delivery management process. No longer did a company need to build and manage a costly data center, along with the manually deployment of software and hardware. A small team of software engineers could piece together an automated process that would remove the human element from the process and greatly increase the velocity of application development, deployment, customer satisfaction, and profits.

## Site reliability engineering

As the idea of devops grew, it started to become its own role within large organizations. This resulted in dedicated devops teams that worked in concert with application engineers to deliver software.

For example, Google codified devops practices into a Site Reliability Engineer (SRE) role. This is an independent organization within Google that seeks to create stability for the customer while increasing velocity of new feature delivery. They have even written multiple [books](https://sre.google/books/) on the subject.

## Platform engineering

As devops built more and more infrastructure to automate the delivery of software, a set of best practices and tools emerged. This resulted in centralized refinement of those practices and tools, and created the **Platform Engineer** role. A platform engineering team serves as a service team that provides the tools that an application team needs to get their software into production.

## Software delivery goals

Application, devops, site reliability, or platform engineers all share the same primary goals.

1. Optimize customer satisfaction, velocity, scalability, and cost.
1. Treat testing, deployment, and management as a programming problem.
1. Minimize human involvement.

The purpose of this course is to teach you the techniques and the tools that are necessary to master their implementation.
