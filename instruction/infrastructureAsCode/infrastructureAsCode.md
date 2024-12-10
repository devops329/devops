# Infrastructure as code (IaC)

🔑 **Key points**

- There are many benefits for IaC.
- Creating Iac requires that you test it.

---

📖 **Deeper dive reading**: [Iac at AWS](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html)

---

## What is infrastructure as code?

Infrastructure as code (IaC) is the practice of treating your application infrastructure creation and management as just another part of your application code. This means that you use the same tools that you use to manage your application code to manage your infrastructure. This is a powerful concept because it allows you to automate the creation of your infrastructure.

## Why is IaC important?

As we have stressed previously, manual work, or toil, is the enemy of DevOps. We have been doing a lot of manual manipulation of AWS in order to set up our automated CI pipeline. It is easy to justify the work you did to set up your JWT Pizza cloud hosting environment as a one time effort. Furthermore, setting up automation takes effort. You are basically writing, or scripting, a program to allow for the automatic execution of your CI pipeline. However, there are some very good reasons to reduce toil and automate as much as you can.

1. **Disaster recovery**: There is always the possibility of a significant system failure. Extreme weather can knock out data centers, human error can bring down networks for hours, and hardware simply degrades and eventually stops working. Having code that you can execute to immediately restore your critical infrastructure is one of the characteristics that differentiates world-class organizations from failing startups.
1. **Creating new environments**: If you have automation that can rebuild your production environment, then it is an easy extension to use that automation to build new environments for things like staging, external auditing, penetration testing, or market testing. This makes your company more agile and responsive to market demands.
1. **Documentation**: Chances are that you are not going working on the exact same system forever. You need to leave behind the kind of documentation for how the system works that you would like to have. Automation helps to fill this need. It serves as clear documentation of how the system is configured, and just like automated testing, it allows you to enhance your CI pipeline without introducing regression errors.

## How to do IaC

Proper **IaC** begins with an automation mindset. Whenever you set up a system or process, immediately start thinking about how you can automate that work. This is usually only possible if you do it manually to begin with, but take careful notes about the steps that you take. Then turn those steps into an automation script, workflow, or simply a program that you code up in your favorite language.

After you have code that can build your infrastructure, you need to test it. That means that you run it and build a parallel system to the one that your crafted manually. You can then compare the two and make sure they are equivalent. Once that all checks out, you tear down the twin and store your IaC along with the documentation for the system so that it is readily available at a moment's notice.

## A bit of fun

![XKCD The General Problem](xkcdTheGeneralProblem.png)

> _source: [XKCD](https://xkcd.com/974/)_
