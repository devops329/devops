# Deliverable ⓹ Content Delivery Network Deployment: JWT Pizza

![course overview](../courseOverview.png)

Previously we deploy the JWT Pizza frontend using GitHub Pages, and while GitHub pages does host your content on servers around the world (technically making it a CDN), it has some significant limitations that disqualify it for large scale production usage. First off it is limited in the amount bandwidth that GitHub will provide. They also throttle the amount of data and the number of times you can update the data. GitHub pages also lack many of the features that a world class CDN provides such as DDos protection and edge computing.

For these reasons we are going to move to AWS and use their S3, IAM, and CloudFront services to create a globally hosted CDN for JWT Pizza.

## S3 static content bucket

The first step we need to take is to create an S3 bucket to host the static files associated with the JWT Pizza frontend.

# Old stuff

## s3

1. Created a bucket for static client hosting. test.leesjensen.com. Nothing special. Used all the defaults. Kept private.

## CloudFront

1. Created couldfront distribution for the bucket.
1. Add the CNAME test.leesjensen.com
1. Origin domain: test.leesjensen.com.s3.us-east-2.amazonaws.com
1. Changed name to test.leesjensen.com
1. Set default root object to index.html
1. Public access
1. Redirect HTTP to HTTPS
1. Do not enable WAF
1. Use only North America and Europe
1. Set origin access to Legacy and used the leesjensen.com existing Origin access identity. Told it to update the bucket policy. This caused the following update to the bucket policy.
   ```json
   {
     "Sid": "1",
     "Effect": "Allow",
     "Principal": {
       "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E2RZXH5AWP6HVG"
     },
     "Action": "s3:GetObject",
     "Resource": "arn:aws:s3:::test.leesjensen.com/*"
   }
   ```
1. Support HTTP/3
1. Use a custom web certificate that I already had for \*.leesjensen.com

## Route 53

1. Added a Route 53 record for cloudfront (test.leesjensen.com)

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

## GitHub Action

With this in place I can now enhance the GitHub Action Workflow.

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
