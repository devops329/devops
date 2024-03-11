# AWS S3 deployment

## Deploying to AWS

[Instructions for the AWS GitHub Credential Action](https://github.com/aws-actions/configure-aws-credentials)

[This one covers it all](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/)

[Configure OpenID connect in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

[Adding an OIDC identity provider to IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

This creates a role that the OIDC identity is assigned with a JWT is allocated.

[Enabling GitHub Actions with Amazon S3 storage](https://docs.github.com/en/enterprise-server@3.8/admin/github-actions/enabling-github-actions-for-github-enterprise-server/enabling-github-actions-with-amazon-s3-storage)

This looks perfect. I need to write a workflow that pushes the client to S3.

## Authorization

You can use OIDC or AWS secrets.

### Setting up OpenID Connect (OIDC)

[GitHub overview](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

[Open ID Connect to AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

GitHub is the identity provider.

1. You register the GitHub IP with AWS IAM and specify the AWS rights you are granting for an authenticated user.
   1. provider URL: https://token.actions.githubusercontent.com
   1. Audience: sts.amazonaws.com
1. Configure the IAM role
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Principal": {
           "Federated": "arn:aws:iam::222021474030:oidc-provider/token.actions.githubusercontent.com/softwaredeliverymanagement329"
         },
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com/softwaredeliverymanagement329:aud": ["sts.amazonaws.com"]
           },
           "StringLike": {
             "token.actions.githubusercontent.com/softwaredeliverymanagement329:sub": [
               "repo:softwaredeliverymanagement329/*"
             ]
           }
         }
       }
     ]
   }
   ```
