# Deliverable ⓺ Scalable deployment: JWT Pizza Service

![course overview](../courseOverview.png)

Now that you have some experience with creating, registering, and deploying simple containers it is time to deploy JWT Pizza Service to the Cloud.

## Setup ECR

## Setup ECS

## Create GitHub action deployment workflow

In order to automate your deployments to ECS, you need to modify the GitHub Actions workflow for `jwt-pizza-service`. Previously the workflow stopped after the test were done and the coverage badge was updated. Now, you need to do the following steps:

1. Create a distribution folder that will become our Docker container.
   ```yml
   - name: Create dist
     run: |
       mkdir dist
       cp Dockerfile dist
       cp -r src/* dist
       cp *.json dist
   ```
1. Authenticate to AWS using OIDC.
   ```yml
   - name: Create OIDC token to AWS
     uses: aws-actions/configure-aws-credentials@v4
     with:
       audience: sts.amazonaws.com
       aws-region: us-east-2
       role-to-assume: arn:aws:iam::464152414144:role/github-ci
   ```
1. Login to AWS ECR.
   ```yml
   x
   ```
1. Set up the Docker build and emulation.
   ```yml
   x
   ```
1. Build and push the docker container.
   ```yml
   x
   ```

https://github.com/aws-actions/amazon-ecr-login

### Enhance AWS Role

Update `github-ci` role to allow ECS deployment

Must add `jwt-pizza-service` to the role policy.

```json
"token.actions.githubusercontent.com:sub": [
  "repo:YOURGITHUBACCOUNTHERE/jwt-pizza:ref:refs/heads/main",
  "repo:YOURGITHUBACCOUNTHERE/jwt-pizza-service:ref:refs/heads/main"
],
```
