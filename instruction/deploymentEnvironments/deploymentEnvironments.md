# Deployment environments

You must modify the S3 bucket script to allow the CloudFormation distribution.

Create a staging distribution. Set the policy to be a percentage of the requests.

You have to issue an invalidation to make any of this work.

## Keep versions around in S3

Since we will have multiple environments we need more control over what version is deployed in each environment.

1. Change the CI pipeline to copy to a version directory. You can delete the root files if desired.

Using the generated version you can now deploy to the version directory.

```yml
deploy:
  needs: build
  permissions:
    id-token: write
  runs-on: ubuntu-latest
  env:
    version: ${{needs.build.outputs.version}}
  # environment: # This is a test. We may not want this. it requires special IAM permissions and GitHub secrets
  #   name: production
  #   url: https://pizza.byucsstudent.click
  steps:
    - name: Create OIDC token to AWS
      uses: aws-actions/configure-aws-credentials@v4
      with:
        audience: sts.amazonaws.com
        aws-region: us-east-1
        role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT }}:role/${{ secrets.CI_IAM_ROLE }}

    - name: Download pages artifact
      uses: actions/download-artifact@v4
      with:
        name: package
        path: dist/

    - name: Push to AWS S3
      # Note the inclusion of the version in the path
      run: |
        aws s3 cp dist s3://pizza.byucsstudent.click/$version --recursive
```

Now you can update the cloudfront distribution to use the new version. This requires you to first get the current configuration, modify it with the new path, and they update it.

You also need to wait until it is done distributing before you invalidate the cache of the old version.

## Change production

1. Rename the distribution
1. Set the distribution origin path to point to the desired s3 version path.

## Create staging

1. Create a new CloudFormation distribution. Similar to prod, but set the origin path to point to a version directory.
   1. Name it stage-pizza.domainname.
   1. Create Route 53 record to point to it.
   1. Add the distribution to the S3 policy
   1. Verify that you can see the staging environment.
   1. Invalidate the staging distribution so the new files show up

## To deploy a new version to an environment

Just go want change the origin path, wait for it to deploy, and invalidate the cache.

It is pretty instantaneous to move back and forth.

## Automating the deployment for staging

```yml
- name: Update staging version
  run: |
    # Get the current distribution and update it to use the new version
    aws cloudfront get-distribution-config --id ${{ secrets.DISTRIBUTION_ID }} > original.json
    etag=$(jq -r '.ETag' original.json)
    jq '.DistributionConfig' original.json > request.json
    jq --arg version "/$version" '.Origins.Items[0].OriginPath = $version' request.json > finalRequest.json
    aws cloudfront update-distribution --id ${{ secrets.DISTRIBUTION_ID }} --if-match $etag --distribution-config file://finalRequest.json

    # Wait for the distribution to deploy and then invalidate the cache
    while [ "$(aws cloudfront get-distribution --id ${{ secrets.DISTRIBUTION_ID }} --query 'Distribution.Status' --output text)" != "Deployed" ]; do echo "Distribution is still updating..."; sleep 5; done
    aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*"
```

I had to update the IAM CI Role to allow for getting the distribution config.

```json
		{
			"Sid": "InvalidateCloudFront",
			"Effect": "Allow",
			"Action": [
				"cloudfront:CreateInvalidation",
				"cloudfront:UpdateDistribution",
				"cloudfront:GetDistribution",
        "cloudfront:GetDistributionConfig"
			],
			"Resource": [
				"arn:aws:cloudfront::XXXXXXXX:distribution/YYYYYYYY"
			]
		},
```
