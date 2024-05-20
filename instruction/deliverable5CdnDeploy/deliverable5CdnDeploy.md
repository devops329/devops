# Deliverable ⓹ Content Delivery Network Deployment: JWT Pizza

![course overview](../courseOverview.png)

Now that we know how to deploy static content using a CDN we want to move from GitHub Pages to AWS CloudFront.

## Clean up GitHub Pages

When you pointed your pizza URL to CloudFront you broke the link to your GitHub Pages static file hosting. Since we are no longer going to use GitHub Pages you can go and remove it from your fork of the jwt-pizza repository.

## IAM

1. Create a role for the GitHub Action.
   1. Choose Web Identity
   1. Create a new Identity Provider - OpenID Connect
   1. You register the GitHub IP with AWS IAM and specify the AWS rights you are granting for an authenticated user.
      1. provider URL: https://token.actions.githubusercontent.com. Press Get Thumbprint. I don't believe this is used anymore, but it makes me press it.
      1. Audience: sts.amazonaws.com
      1. Configure the IAM role
      1. Permissions policy S3
      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Principal": {
              "Federated": "arn:aws:iam::464152414144:oidc-provider/token.actions.githubusercontent.com"
            },
            "Condition": {
              "StringEquals": {
                "token.actions.githubusercontent.com:aud": ["sts.amazonaws.com"]
              },
              "StringLike": {
                "token.actions.githubusercontent.com:sub": ["repo:devops329/*"]
              }
            }
          }
        ]
      }
      ```

## Update the deployment workflow

Modify the script to deploy to S3

With this in place you can now enhance the GitHub Action Workflow.

First you need to add the permission to use OIDC tokens in the script.

```yaml
permissions:
  id-token: write
  contents: read
```

Next add AWS CLI command with the acquired OIDC token

```yaml
- name: Create OIDC token to AWS
  uses: aws-actions/configure-aws-credentials@v4
  with:
    audience: sts.amazonaws.com
    aws-region: us-east-1
    role-to-assume: arn:aws:iam::464152414144:role/GitHubAction-CD
- name: Push to AWS S3
  run: |
    ls -la
    aws s3 ls s3://test.leesjensen.com
    aws s3 cp dist s3://test.leesjensen.com --recursive
```

## CI with Staging distributions

🚧 Maybe we can use this when we talk about versioning.
