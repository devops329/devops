# JWT Pizza Service infrastructure automation

As the last step of our DevOps automation, let's go ahead and create a CloudFormation template that will allow us to quickly setup and teardown the ECS and ALB service configuration necessary to host your JWT Pizza Service backend. Before you do that you should probably delete all of the existing AWS infrastructure that you created previously. You can then start up your CloudFormation stack to represent the same infrastructure.

This is a critical piece of your DevOps infrastructure because it will enable you create some critical cost savings. Instead of paying for keeping your backend service running throughout the month, or manually recreating it when needed, you can tear it down and start it up in a matter of minutes.

## Creating a JWT Pizza Service backend template

START HERE! Use the validator to create an image of the resources.
Need to add the database creation to list of things to delete and create in the script

## ☑ Assignment

Complete the following.

1. Delete your previous ECS and ALB infrastructure.
1. Create a S3 bucket to host your CloudFormation templates.
1. Create the `jwt-pizza-service.json` template file.
1. Deploy a CloudFormation stack using the `jwt-pizza-service.json` template.
1. Trigger your `jwt-pizza-service` CI deployment pipeline and verify that the new service is deployed.

Once this is all working that you have completed the work to the Canvas assignment.

🚧 As an alternative to this assignment we could have them create a template for deploying the frontend infrastructure.
