# Code as infrastructure

https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html

## Why is automation so important?

We have been doing a lot of manual manipulation of AWS in order to setup our automated CI pipeline. As we have stressed previously, manual work, or toil, is the enemy of DevOps. It is easy to justify the work you did to set up your JWT Pizza cloud hosting environment as a one time effort. Furthermore, setting up automation takes effort. You are basically writing, or scripting, a program to allow for the automatic execution of your CI pipeline. However, there are some very good reasons to reduce toil and automate as much as you can.

1. **Disaster recovery**: There is always the possibility of a significant system failure. Extreme weather can knock out data centers, human error can bring down networks for hours, and hardware simply degrades and eventually stops working. Having code that you can execute to immediately restore your critical infrastructure is one of the characteristics that differentiates world class organizations from hacker shops.
1. **Creating new environments**: If you have automation that can rebuild your production environment, then it is an easy extension to use that automation to build new environments for things like staging, external auditing, penetration testing, or market testing. This makes your company more agile and responsive to market demands.
1. **Documentation**: Chances are that you are not going working on the exact same system forever. You need to leave behind the kind of documentation for how the system works that you would like to have. Automation helps to fill this need. It serves as clear documentation of how the system is configured, and just like automated testing, it allows you to enhance your CI pipeline without introducing regression errors.
