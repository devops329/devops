# Deliverable ⓹ Content Delivery Network Deployment: JWT Pizza

🔑 **Key points**

- Deploy your JWT Pizza frontend using S3, CloudFront, and GitHub Actions

---

![course overview](../sharedImages/courseOverview.png)

Now that we know how to deploy static content using CloudFront and S3 using GitHub Actions, it is time to move our CDN hosting from GitHub Pages to AWS CloudFront.

## CDN distribution

Set up your AWS S3 and CloudFront configuration as described in the [AWS CloudFront](../awsCloudFront/awsCloudFront.md) instruction. Your AWS configuration should consist of a private S3 bucket that contains your static frontend code. A CloudFront distribution then exposes the frontend to the world using a secure HTTP connection defined by your DNS hostname.

### Demonstrating completion

Once completed, your DNS entry should point to your CloudFront endpoint. You can verify this with the `dig` or `nslookup` utility.

```sh
dig +short CNAME pizza.byucsstudent.click

d3pl23dqq9jlpy.cloudfront.net.
```

## Secure deployment

Alter your GitHub Actions deployment process using the [AWS S3 Deployment](../awsS3Deployment/awsS3Deployment.md) instruction such that it updates S3 when files are pushed to your fork of `jwt-pizza`. Your GitHub CI pipeline deploys your frontend code through a secure connection that is authenticated using OIDC that follows the principle of least privilege, by exposing only the necessary access.

In the `deploy` job of your workflow, attempting to copy the contents of `dist` to s3 when the `deploy` and `build` jobs are separate will produce an error along the lines of `No such directory: dist`. You need to first download the pages artifact that you uploaded in the `build` job.

```yaml
- name: Download pages artifact
        uses: actions/download-artifact@v4
        with:
          name: package
          path: dist/
```

### 404 page

You need to remove the creation of the `404.hml` that GitHub Pages used to handle when a user refreshes the browser. You can do that by deleting the creation of the file from your workflow.

```yml
cp dist/index.html dist/404.html
```

Instead, you need to configure CloudFront to return the `index.html` file whenever a 404 or 403 error is encountered. You can do this by going to `Error Pages` in the CloudFront distribution and adding a custom error response.

![Handle 404](handle404.png)

This will cause the React DOM Router to get loaded and properly route back to the correct React component for the path.

### Demonstrating completion

Once completed, your repository's GitHub Actions workflow history should demonstrate a successful deployment to S3.

![Workflow output](workflowOutput.png)

## ☑ Assignment

In order to demonstrate your mastery of the concepts for this deliverable, complete the following.

1. Create a secure S3 bucket to host the frontend static files.
1. Create a CloudFront distribution.
1. Alter your DNS record in Route 53 to point to the CloudFront distribution.
1. Create the IAM policies, roles, and identity provider definitions necessary to secure access for deployment.
1. Alter your GitHub Actions workflow to update S3 and CloudFront instead of deploying to GitHub Pages.

Once this is all working, go to the [AutoGrader](https://cs329.cs.byu.edu) and submit your work for the deliverable.

### Rubric

| Percent | Item                                                  |
| ------- | ----------------------------------------------------- |
| 45%     | Secure CloudFront deployment based on S3 bucket       |
| 10%     | Properly handles browser refresh React DOM Routing    |
| 45%     | Updated GitHub Action workflow deploying to S3 bucket |
