# Deliverable ⓺ Scalable deployment: JWT Pizza Service

![course overview](../sharedImages/courseOverview.png)

Now that you have experience with creating, registering, and deploying the JWT Pizza Service manually, it is time to modify your CI workflow to do this automatically when you push a change to the repository. This deliverable represents the **Scalable compute** portion of our product overview diagram. It provides the hosting of the jwt-pizza-service in a way that can support an ever growing customer base, all driving by an automated CI process.

Your work on this deliverable consists of four parts:

1. **ECR configuration**: Setup ECR to keep track of the different versions of your jwt-pizza-service Docker container images.
1. **Image registration CI**: Modify the CI pipeline to automatically build and deploy a new container image to ECR.
1. **ECS configuration**: Setup ECS to deploy a container to Fargate and expose it publicly using the application load balancer.
1. **Image deployment CI**: Modify the Ci pipeline to automatically deploy a new container image to ECS.

![Deliverable 6 overview](deliverable6Overview.png)

## Step 1: ECR configuration

You should have already followed the [AWS ECR instruction](../awsEcr/awsEcr.md) in order to get your AWS account setup to store the JWT Pizza Service container images in a Docker compliant Registry. If you have not done that yet, do so now.

## Step 2: Image registration CI

The ECR fully configured you are ready to automate the building and uploading a Docker container image for the JWT Pizza service whenever a change is made to the jwt-pizza-service code base. This work requires that you increase the rights that the CI workflow has, and modify workflow script to build and push the Docker image.

### Modify the IAM trust policy

In order for the `jwt-pizza-service` CI workflow make requests over the OIDC authorized connection you must alter the previously configured `github-ci` IAM role so that the `jwt-pizza-service` GitHub repository is also part of the trust relationship.

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
   🚧 This is not right. We restricted ECR access to the least required privilege.

   ```json
   {
      "Sid": "PushToECR",
      "Effect": "Allow",
      "Action": [
            "ecr:*"
      ],
      "Resource": [
            "*"
      ]
   },
   {
      "Sid": "RegisterTaskDefinition",
      "Effect": "Allow",
      "Action": [
            "ecs:DescribeTaskDefinition",
            "ecs:RegisterTaskDefinition"
      ],
      "Resource": "*"
   },
   {
      "Sid": "PassRolesInTaskDefinition",
      "Effect": "Allow",
      "Action": [
            "iam:PassRole"
      ],
      "Resource": [
            "arn:aws:iam::464152414144:role/lee-base-base",
            "arn:aws:iam::464152414144:role/jwt-pizza-ecs"
      ]
   },
   {
      "Sid": "DeployService",
      "Effect": "Allow",
      "Action": [
            "ecs:UpdateService",
            "ecs:DescribeServices"
      ],
      "Resource": [
            "arn:aws:ecs:us-east-2:464152414144:service/jwt-pizza-service/jwt-pizza-service-albtest"
      ]
   }
   ```

1. Press `Next`.
1. Press `Save`.

### Modify the CI workflow script for image upload

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
       aws-region: us-east-1
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

### Test the image push

You should now be able to commit and push the workflow script to GitHub. This will trigger a container image to build and push to ECR. Once it is done you should see your image show up on the ECR images dashboard.

![ECR images](ecrImages.png)

## Step 3: ECS configuration

You should have already followed the [AWS ECS instruction](../awsEcs/awsEcs.md) in order to get your AWS account setup to host the JWT Pizza Service container using Fargate and an application load balancer. Additionally, you should have already set up your [RDS MySQL database](../awsRdsMysql/awsRdsMysql.md). If you have not done this yet, then do so now.

## Step 4: Image deployment CI

With ECR configured, the CI workflow for building and pushing a container image to ECR, and ECS configured to deploy a container, you are now ready to enhance the CI workflow to automatically push the container to ECS and update the application load balancer.

You will do this by adding three new steps to the workflow.

1. Make a copy of the existing `jwt-pizza-service` task definition and save it to a file named `task-definition.json`. Here is an example [task-definition.json](task-definition.json) if you are interested in what they look like.
   ```yml
   - name: Download task definition
   run: |
      aws ecs describe-task-definition --region us-east-2 --task-definition jwt-pizza-service --query taskDefinition > task-definition.json
      echo $(cat task-definition.json | jq 'del(.taskDefinitionArn, .requiresAttributes, .compatibilities, .revision, .status, .registeredAt, .registeredBy)') > task-definition.json
   ```
1. Modify the task definition so that it contains the name of the new container image that you just created.
   ```yml
   - name: Create new task definition
   id: task-def
   uses: aws-actions/amazon-ecs-render-task-definition@v1
   with:
      task-definition: task-definition.json
      container-name: jwt-pizza-service
      image: ${{ steps.build-image.outputs.image }}
   ```
1. Deploy the new task definition and update of the ECS service. This will trigger ECS to create a rolling deployment of the new container and update the application load balancer to expose the new container.
   ```yml
   - name: Deploy new task definition
   uses: aws-actions/amazon-ecs-deploy-task-definition@v1
   with:
      task-definition: ${{ steps.task-def.outputs.task-definition }}
      service: jwt-pizza-service
      cluster: jwt-pizza-service
      wait-for-service-stability: false
   ```

### Test the container deployment

With the above changes in place you should be able to test the backend by making curl requests.

Replace the `byucsstudent.click` domain name with your own.

```sh
curl 'https://pizza-service.byucsstudent.click'
{"message":"welcome to JWT Pizza","version":"20240525.025706"}

curl 'https://pizza-service.byucsstudent.click/api/order/menu'
[]

curl -X PUT -c cookies.txt 'https://pizza-service.byucsstudent.click/api/auth' -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json'
{"id":1,"name":"常用名字","email":"a@jwt.com","roles":[{"role":"admin"}]}
```

Currently your database only has the default admin user that was inserted when the database was initialized the first time a connection was made. If you want to add some basic menu, user, franchise, and shop data you can run the following Curl commands.

```sh
# Set the hostname - replace with your hostname
host=pizza-service.byucsstudent.click

# Add users
curl -X POST https://$host/api/auth -d '{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json'

curl -X POST https://$host/api/auth -d '{"name":"pizza franchisee", "email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json'

curl -X PUT -c cookies.txt https://$host/api/auth -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json'

# Add menu
curl -b cookies.txt -X PUT https://$host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Veggie", "description": "A garden of delight", "image":"pizza1.png", "price": 0.0038 }'

curl -b cookies.txt -X PUT https://$host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Pepperoni", "description": "Spicy treat", "image":"pizza2.png", "price": 0.0042 }'

curl -b cookies.txt -X PUT https://$host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Margarita", "description": "Essential classic", "image":"pizza3.png", "price": 0.0042 }'

curl -b cookies.txt -X PUT https://$host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Crusty", "description": "A dry mouthed favorite", "image":"pizza4.png", "price": 0.0028 }'

curl -b cookies.txt -X PUT https://$host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Chared Leopard", "description": "For those with a darker side", "image":"pizza5.png", "price": 0.0099 }'

# Add franchise
curl -b cookies.txt -X POST https://$host/api/franchise -H 'Content-Type: application/json' -d '{"name": "pizzaPocket", "admins": [{"email": "f@jwt.com"}]}'

# Add store
curl -b cookies.txt -X POST https://$host/api/franchise/1/store -H 'Content-Type: application/json' -d '{"franchiseId": 1, "name":"SLC"}'
```

## Deploy the full cloud stack

Now that have both your frontend and your backend running on AWS you need to change the configuration of your jwt-pizza code so that it calls your deployment instead of the JWT Pizza Headquarters implementation.

From your fork of the `jwt-pizza` repository open the `.env.production` and modify it so that the `VITE_PIZZA_SERVICE_URL` is pointing to your URL for your newly deployed backend.

```json
VITE_PIZZA_SERVICE_URL=https://pizza-service.YOURHOSTSNAMEHERE
VITE_PIZZA_FACTORY_URL=https://pizza-factory.cs329.click
```

Repeat the same change with the `.env.development` file so that you use your backend when you are experimenting your frontend in your development environment.

Then push your changes to GitHub. Your CI pipeline should deploy the frontend changes and complete your work on creating a full cloud stack. With this change you can open up the dev tools while visiting your front end and see the requests going to your backend.

![Backend fetch](backendFetch.png)

## ☑ Assignment

In order to demonstrate your mastery of the concepts for this deliverable, complete the following.

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

Congratulations! You have completed the process of using RDS, IAM, ECR, ECS, and Route 53 to deploy your backend service. Time to go celebrate. I'm thinking ice cream 🍦.
