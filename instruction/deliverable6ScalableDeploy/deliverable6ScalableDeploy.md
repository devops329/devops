# Deliverable ⓺ Scalable deployment: JWT Pizza Service

![course overview](../courseOverview.png)

Now that you have some experience with creating, registering, and deploying simple containers it is time to deploy JWT Pizza Service to the Cloud.

## Setup ECR

Follow the [AWS ECR instruction](../awsEcr/awsEcr.md) in order to get your AWS account setup to store the JWT Pizza Service container images in a Docker compliant Registry.

## Setup ECS

Follow the [AWS ECS instruction](../awsEcs/awsEcs.md) in order to get your AWS account setup to host the JWT Pizza Service container using Fargate.

## GitHub action: Upload container image

In order to automate building and uploading a Docker container image for the JWT Pizza service, you need increase the rights that the workflow has, and modify workflow script to build and push the image.

### Modify the IAM trust policy

We need to modify the `github-ci` IAM role so that it can create an OIDC connection when requests are made from the `jwt-pizza-service` GitHub repository.

1. Open the AWS IAM service console.
1. Choose `Roles`.
1. Select the `github-ci` role that you created when you setup `jwt-pizza` to deploy to S3.
1. Select the `Trust relationships` tab.
1. Press `Edit trust policy`.
1. Replace the `token.actions.githubusercontent.com:sub` value with the following. This allows both of your source repositories to make an OIDC connection.
   ```json
   "token.actions.githubusercontent.com:sub": [
   "repo:YOURGITHUBACCOUNTHERE/jwt-pizza:ref:refs/heads/main",
   "repo:YOURGITHUBACCOUNTHERE/jwt-pizza-service:ref:refs/heads/main"
   ],
   ```
1. Press the `Update policy` button.

### Enhance the IAM rights

Next you need to enhance the `github-ci` user rights so that they can push to ECR and initiate the deployment to ECS.

1. Open the AWS IAM service console.
1. Choose `Roles`.
1. Select the `github-ci` role that you created when you setup `jwt-pizza` to deploy to S3.
1. Select the `Permissions` tab.
1. Click on the `jwt-pizza-ci-deployment` policy.
1. Select `JSON` and press `Edit`.
1. Add the following statement in order to allow the use of ECR and ECS.

🚧 This is not right. We restricted this down much more and need to do the same thing for ECR access. Least required privilege principle.

```json
{
  "Sid": "PushAndDeployImage",
  "Effect": "Allow",
  "Action": ["ecr:*", "ecs:*"],
  "Resource": ["*"]
}
```

1. Press `Next`.

### Modify the workflow script for upload

Previously the workflow stopped after the tests were done and the coverage badge was updated. Now, you need to do the following steps:

1. Create a distribution folder that will become our Docker container. This copies all of the source code files and the newly created Dockerfile. We also replace the temporary database credentials that were used during testing with the ones needed by the production environment.
   ```yml
   - name: Create dist
     run: |
       mkdir dist
       cp Dockerfile dist
       cp -r src/* dist
       cp *.json dist
       sed -i "s/root/${{ secrets.DB_USERNAME }}/g" dist/config.js
       sed -i "s/tempdbpassword/${{ secrets.DB_PASSWORD }}/g" dist/config.js
       sed -i "s/127.0.0.1/${{ secrets.DB_HOSTNAME }}/g" dist/config.js
   ```
1. Authenticate to AWS using OIDC. This is the same authentication step that we took with the frontend deployment. Using OIDC makes it so we don't have to store any credentials to our AWS account.
   ```yml
   - name: Create OIDC token to AWS
     uses: aws-actions/configure-aws-credentials@v4
     with:
       audience: sts.amazonaws.com
       aws-region: us-east-2
       role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT }}:role/${{ secrets.CI_IAM_ROLE }}
   ```
1. Login to AWS ECR. We need to provide credentials to Docker so that it can push container images into the register. This [action](https://github.com/aws-actions/amazon-ecr-login) gets a temporary password from ECR using the OIDC credential we previously obtained.

   ```yml
   - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2
   ```

1. Set up the Docker build and emulation. We need to build an ARM64 platform package. In order to do that in Linux we need to emulate an ARM based environment.

   ```yml
   - name: Set up machine emulation
      uses: docker/setup-qemu-action@v3

   - name: Set up Docker build
      uses: docker/setup-buildx-action@v3
   ```

1. Build and push the docker container. We used the `--push` parameter to automatically push the container image to ECR once it is done building.
   ```yml
   - name: Build and push container image
     env:
       ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
       ECR_REPOSITORY: 'jwt-pizza-service'
     run: |
       docker --version
       cd dist
       ls -la
       docker build --platform=linux/arm64 -t $ECR_REGISTRY/$ECR_REPOSITORY --push .
   ```

### Test upload

You should now be able to commit and push the workflow script to GitHub. This will trigger your container image to build and push to ECR. Once it is done you should see your image show up on the ECR images dashboard.

![ECR images](ecrImages.png)

## GitHub action: Deploy container

With a new image in the registry you can now automate the deployment of the container to Fargate.

1. Create a new task definition.
1. Update the service to the new task.

https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-amazon-elastic-container-service

## Deploy the full cloud stack

Now that have both your frontend and your backend running on AWS you need to change the configuration of your jwt-pizza code so that it calls your deployment instead of the JWT Pizza Headquarters implementation.

From your fork of the `jwt-pizza` repository open the `.env.production` and modify it so that the `VITE_PIZZA_SERVICE_URL` is pointing to your URL for your newly deployed backend.

```json
VITE_PIZZA_SERVICE_URL=https://jwt-pizza-service.YOURHOSTSNAMEHERE
VITE_PIZZA_FACTORY_URL=https://jwt-pizza-factory.cs329.click
```

Then push your changes to GitHub. Your CI pipeline should deploy the frontend changes and complete your work on creating a full cloud stack.

## ☑ Assignment

Demonstrate your mastery of the concepts for this deliverable, complete the following.

1. Alter the IAM policies, roles, and identity provider definitions necessary to secure access for backend deployment.
1. Setting up ECR to host your backend Docker container.
1. Setting up ECS to deploy your backend Docker container using Fargate.
1. Alter your GitHub Actions workflow to update ECR and ECS in order to deploy the backend service.
1. Alter your DNS record in Route 53 to point to the application load balancer distribution.
1. Modify and deploy your frontend so that it calls your backend service.

Once this is all working, submit JWT Pizza Service URL of your fork of the `jwt-pizza` repository to the Canvas assignment. This should look something like this:

```txt
https://pizza.cs329.click
```

### Rubric

| Percent | Item                                                                                      |
| ------- | ----------------------------------------------------------------------------------------- |
| 10%     | Strong GitHub commit history that documents your work in your fork of `jwt-pizza-service` |
| 20%     | Secure Fargate deployment based on ECR and ECS                                            |
| 20%     | AWS Load balancer used to access Fargate                                                  |
| 20%     | MySQL database deployed for backend data persistence                                      |
| 20%     | Updated GitHub Action workflow deploying to ECR and ECS                                   |
| 10%     | Your backend called for all frontend requests                                             |
