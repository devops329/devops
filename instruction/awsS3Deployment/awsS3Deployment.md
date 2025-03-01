# AWS S3 deployment

🔑 **Key points**

- You must authorize GitHub to have access to your AWS account.
- You can use a GitHub Action workflow to execute AWS CLI commands.
- You will create a workflow that uploads a file to your S3 bucket.

---

In order to use CI to deploy our static frontend content to S3 you need to create a trust relationship between GitHub and AWS. This is done by using the Open ID Connection (OIDC) protocol to dynamically obtain an authentication token whenever you want to call the S3 endpoints for copying files. Using OIDC to authenticate with AWS makes it so that you don't ever have to store credentials in your CI pipeline.

![S3 Deployment](s3Deployment.png)

> [!IMPORTANT]
>
> Make sure you are using the `us-east-1` AWS region for all your work in this course.

### Setting up Open ID Connect (OIDC)

You establish a trust relationship between GitHub and AWS by configuring AWS to use GitHub as an OIDC identity provider, associating a OIDC identity with an AWS IAM role that allows access to S3, and configuring a GitHub Actions workflow to use the identity.

### Create and OIDC identity provider for GitHub

First you need to set up AWS to use GitHub as an OIDC provider.

1. Open the AWS IAM service console
1. Choose `Identity providers`
1. Press `Add provider`
1. Choose the provider type of `OpenID Connect`

   ![Create OIDC Provider](createOIDCProvider.png)

1. Give the GitHub URL for the provider URL, and allow AWS Security Token Service as the audience.
   1. **provider URL**: `https://token.actions.githubusercontent.com`
   1. **Audience**: `sts.amazonaws.com`
1. Press `Add provider`
1. Click on the newly created identity provider to display its properties.

   ![OIDC properties](identityProperties.png)

1. You will reference the identity provider ARN when you create the IAM role.

### Create the IAM policy

We want to be careful which AWS services and resources we expose through the credentials we are creating, so we need to create an AWS IAM policy that only provides what is necessary to update your S3 deployment bucket and invalidate the files that the CloudFront distribution is hosting.

1. Open the AWS IAM service console.
1. Choose `Policies`.
1. Press `Create policy`.
1. Press `JSON` in order to define the policy with JSON.
1. Paste the following policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListObjectsInBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::BUCKET_NAME_HERE"]
    },
    {
      "Sid": "UpdateS3Bucket",
      "Effect": "Allow",
      "Action": ["s3:*Object"],
      "Resource": ["arn:aws:s3:::BUCKET_NAME_HERE/*"]
    },
    {
      "Sid": "InvalidateCloudFront",
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": ["arn:aws:cloudfront::AWS_ACCOUNT_HERE:distribution/DISTRIBUTION_HERE"]
    }
  ]
}
```

1. Replace `BUCKET_NAME_HERE` with the name of the S3 bucket you created (e.g. pizza.youhostname).
1. Replace `AWS_ACCOUNT` with your AWS account number (e.g. 882352824274).
1. Replace `DISTRIBUTION_HERE` with the CloudFront distribution ID (e.g. F3A3ZL6IF7XCE1).
1. Press `Next`.
1. Name the policy `jwt-pizza-ci-deployment`.
1. Press `Create policy`.

### Create the IAM role

Now we can create the AWS IAM role that allows access to S3.

1. Open the AWS IAM service console.
1. Choose `Roles`.
1. Press `Create role`.
1. Choose `Web identity`.
1. Select the identity provider that you just created for GitHub.

   ![Create role](createRole.png)

1. Add the `Audience` to be sts.amazonaws.com from the dropdown.
1. Add the `GitHub organization` to be your GitHub account name.
1. Add the `GitHub repository` for your fork of the `jwt-pizza` repository.
1. Add the `GitHub branch` to be main.

   ![Web identity](webIdentity.png)

1. Press `Next`.
1. Add permissions by entering the name of the policy you created (e.g. `jwt-pizza-ci-deployment`).

   ![Policy permissions](policyPermissions.png)

1. Press `Next`.
1. Name the role `github-ci`.
1. Press `Create role`.

### Configure GitHub Actions

The final step is to create a GitHub Actions workflow that deploys to the S3 bucket using the OIDC credentials that you just created.

#### Storing secrets

Your repository is public and so you want to make sure that you keep secret anything that would give an advantage to a nefarious party. This includes your AWS Account ID, IAM role, S3 Bucket name, and the CloudFront distribution ID.

You can hide these secrets by creating [repository secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) and then referencing the secrets in your workflow.

![Actions secrets](actionsSecrets.png)

Go ahead and create the following secrets.

| Secret          | Description                                                 | Example              |
| --------------- | ----------------------------------------------------------- | -------------------- |
| AWS_ACCOUNT     | Your AWS account number                                     | 343243424            |
| CI_IAM_ROLE     | The IAM user with rights to deploy your application         | github-ci            |
| APP_BUCKET      | The S3 bucket hosting your static deployment files          | pizza.ilovebyu.click |
| DISTRIBUTION_ID | The CloudFront Distribution ID for your frontend deployment | F3GRFXFEBQ8EEU       |

#### Steps

1. In the repository that you specified when you created your identity provider, create a GitHub Actions workflow file named `testS3Deploy.yml` in your project's `.github/workflows` directory. This will contain the workflow to copy files to your S3 bucket.
1. Paste the following template into the `testS3Deploy.yml` file.

   ```yml
   name: Test S3 Deploy

   on:
     push:
       branches:
         - main
     workflow_dispatch:
   permissions:
     id-token: write

   jobs:
     deploy-s3:
       runs-on: ubuntu-latest
       steps:
         - name: Create OIDC token to AWS
           uses: aws-actions/configure-aws-credentials@v4
           with:
             audience: sts.amazonaws.com
             aws-region: us-east-1
             role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT }}:role/${{ secrets.CI_IAM_ROLE }}
         - name: Push to AWS S3
           run: |
             mkdir dist
             printf "<h1>CloudFront deployment with GitHub Actions</h1>" > dist/index.html
             aws s3 cp dist s3://${{ secrets.APP_BUCKET }} --recursive
             aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*"
   ```

1. Save the file, commit, and push.

The interesting pieces of the workflow include the request for OIDC authorization using the supplied role.

```yml
- name: Create OIDC token to AWS
  uses: aws-actions/configure-aws-credentials@v4
  with:
    audience: sts.amazonaws.com
    aws-region: us-east-1
    role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT }}:role/${{ secrets.CI_IAM_ROLE }}
```

If this is successful then you can execute any AWS CLI commands that the role allows. In our case it allows the commands to copy the `dist` directory to our S3 bucket and invalidate the CloudFront distribution cache. If we didn't invalidate the cache then your new files would not show up until the cache expired 24 hours later.

```yml
aws s3 cp dist s3://${{ secrets.APP_BUCKET }} --recursive
aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*"
```

## Result

After following the above steps you should see the resulting `index.html` page when you view your website.

![Final result](finalResult.png)

Once you are done, you can disable this workflow on the GitHub Actions page, or simply delete it since you repeat what you have done here with the JWT Pizza frontend code in a future assignment, and you don't want this to run every time you commit your code.
