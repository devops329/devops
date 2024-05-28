# AWS Elastic Container Registry (ECR)

AWS Elastic Container Register (ECR) is a [Open Container Initiative](https://opencontainers.org/) compliant container registry. You can store up to 500 MB of container images in a private repository without charge. Using ECR is a convenient and secure way to upload your jwt-pizza-servicer container images and then deploy them using AWS Elastic Container Services (ECS). Here is the long term architecture that we are working towards

![Pizza service deployment](pizzaServiceDeployment.png)

## Setting up ECR

In order to use ECR you must first create a ECS repository that will hold the jwt-pizza-service container images. Complete the following steps.

1. Open the AWS browser console and navigate to the ECR service.
1. Press `Create repository`.

   ![Create repository](createRepository.png)

1. Leave the repository as `private`.
1. Give the repository the name `jwt-pizza-service`
1. Press `Create repository`.

## Push jwt-pizza-service container image

Using the process that you executed in the previous instruction about how to build a [jwt-pizza-service container](../jwtPizzaServiceContainer/jwtPizzaServiceContainer.md), you will now build a container that can upload to ECR and deploy to ECS.

⚠️ **Note**: You must have the [AWS CLI installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) before you execute the next steps. If you have not done that yet, then go and do it now.

1. Follow the steps that you previously used to build the jwt-pizza-service container. However, this time specify the target platform of (`linux/arm64`) since that is the operating system you will use when you deploy the container to AWS.
   ```sh
   docker build  --platform=linux/arm64 -t jwt-pizza-service .
   ```
1. Open the AWS browser console and navigate to the Elastic Container Registry (ECR) service.
1. Open the repository you created in the earlier step.
1. Click on `View push commands`. This should display a series of steps to push a Docker image from your local registry to ECR. Use these commands in the next steps. If you use the examples below, make sure you replace the example AWS account ID (1234567890) with your account ID.
   1. **Obtaining an Auth Token**: This uses the AWS CLI to generate a temporary authorization token and then logs you into Docker using the token for the given registry.
      ```sh
      aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 1234567890.dkr.ecr.us-east-1.amazonaws.com
      ```
      This should return `Login Succeeded` if the AWS CLI has rights to interact with ECR and generate temporary tokens.
   2. **Build the Docker image**: This is the command to build your image. You have already done this and so you can skip this step.
   3. **Create ECR repository image**: This creates a new repository of the local version of your image to the name expected for uploading to ECR.
      ```sh
      docker tag jwt-pizza-service:latest 1234567890.dkr.ecr.us-east-1.amazonaws.com/jwt-pizza-service:latest
      ```
   4. **Copy to ECR**: This does the actual copy up to ECR
      ```sh
      docker push 1234567890.dkr.ecr.us-east-1.amazonaws.com/jwt-pizza-service:latest
      ```
      This should display a list of push commands as the image is uploaded to ECR.
1. View your repository from the ECR service with the AWS browser console.

   ![View uploaded image](viewUploadedDockerImage.png)

1. Note the image URI. You will use this when you define the ECS task that deploys the container.

## Setup a lifecycle rule

When you push a container image to ECR it will untag the pervious image and leave it in the repository. In order to clean these up, so that you don't go over the 500 MB free tier you can create a `lifecycle rule` that removes anything without a tag after 1 day. You can also set up a rule that only keeps the last N images.

![Lifecycle rule](lifecycleRule.png)

## ☑ Assignment

Deploy a container image of your JWT Pizza Service to ECR. This includes the following steps:

1. Create the ECR repository.
1. Build the image in your development environment with the `linux/arm64` platform specified.
1. Push the image to your ECR repository.

Once you are done, go over to Canvas and submit a screenshot of the image in your repository. It should look similar to the example image given above.
