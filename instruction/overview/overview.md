# Overview

This course covers everything necessary to successfully take an application from the developer's development environment and deliver it into a customer accessible production environment.

![DevOps Cycle](devopsCycle.png)

> _Source: [hubspot.com](https://blog.hubspot.com/website/what-is-devops)_

Beyond the work necessary to build the actual application, there are two additional roles that are required to delivery the application to a customer.

1. **Quality Assurance (QA)** - Quality assurance provides an independent review of the development team's deliverables. Their job is to provide assurance that the application follows the design specification and is free from any critical issues that would harm the company or its customers.
1. **Developer Operations (DevOps)** - DevOps provides the automated pipeline that takes the development team's deliverables and puts them into the hands of the customer. The term DevOps stems from the idea that the team is taking a developer mindset for deployment operations. In effect building an application for product delivery.

In a small company the development team will often assume the roles of QA and DevOps. However, the function of these teams is often more successful then they operate independently.

It assumed that you already have the skill necessary to build a reasonable web application. What this course will teach you is how to test, deploy, and manage an application in production.

Your efforts will focus on playing the role of both a QA and DevOps engineer. You will ensure the quality of the software provided by the development team, and deploy the software to a production environment.

## Your work in the course

The class will follow a cycle that likes this:

1. The development team will complete a phase of their application development and commit the results to GitHub.
1. The QA team (_i.e. You_) will create the tests and analyze the code in order to assure its **quality**.
1. The DevOps team (_i.e. You again_) will create the pipeline to **deploy** the application, **monitor** its use, and address incidents as they occur.

## Your deliverables

Multiple phases of development releases and changes to the devOps pipeline will occur as different technologies and strategies are employed. As part of this process, you will create the following deliverables that demonstrate your mastery of the course concepts.

1. **Manual deploy** - Deploy frontend to GitHub Pages manually
1. **Automated deploy** - Deploy frontend to GitHub Pages using GitHub Actions
1. **Unit test** - Unit test backend and analysis using Jest and GitHub Actions
1. **Integration test** - Integration test and analysis frontend using Playwright and GitHub Actions
1. **CDN deploy** - Deploy frontend to AWS CloudFront
1. **Scalable deploy** - Deploy backend to AWS Fargate and Aurora
1. **Metric** - Provide metrics with Grafana Mimir
1. **Log** - Provide logging with Grafana Loki
1. **Trace** - Provide execution tracing with Grafana Tempo
1. **Load test** - Execute end to end load testing with K6
1. **Failure test** - Failure test due to chaos injection
1. **Penetration test** - Penetration testing using Burp Suite
1. **Curiosity report** - Independent research on a QA/DevOps topic
1. **Christlike introspection** - Introspection into your relationship with the divine

The following diagram represents the relationship between your deliverables.

![overview](overview.png)

## Outcomes

By the end of the course you can expect the following outcomes in your personal development.

- **Quality**: Implement comprehensive automated testing strategies, including unit, UI, E2E, performance, and load testing.
- **Deployment**: Deploy various automated CI/CD pipeline strategies to reliably deliver software that is resilient, scalable, and secure.
- **Management**: Monitor, detect anomalies, alter, and automatically correct system behavior.
- **Curious**: Characterize and address gaps in understanding related to DevOps techniques and principles.
- **Creative**: Discuss and generate alternate DevOps designs.
- **Collaborative**: Work as a team to discover DevOps design weaknesses.
- **Christlike**: Strive for divine inspiration for, and ability to apply capabilities to, celestial pursuits.
