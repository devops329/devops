# Cloud deployment

- We now take our static page hosting on GitHub Pages to hosting on S3.
- This will change our GitHub Action script

https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started-cloudfront-overview.html

- Step 1: Register a domain
- Step 2: Request a public certificate
- Step 3: Create an S3 bucket to host your subdomain
- Step 4 : Create another S3 bucket, for your root domain
- Step 5: Upload website files to your subdomain bucket
- Step 6: Set up your root domain bucket for website redirect
- Step 7: Create an Amazon CloudFront distribution for your subdomain
- Step 8: Create an Amazon CloudFront distribution for your root domain
- Step 9: Route DNS traffic for your domain to your CloudFront distribution
- Step 10 : Test your website

1. Created Certificate in AWS certificate manager. The created a DNS record (CNAME \_c54655b34f31243aa575eb5008eb16ca.cs240.click) in cs240.click.
1. Created an S3 bucket test.cs240.com
1. Skipped step 4. I don't want the root domain to be handled by S3.
1. Copied the Pizza client dist files to the bucket.
1. Skipped step 6 since I don't want to do a redirect from the root domain.
1. Followed the other instructions to create the distribution.
1. Created an A record to a cloudfront distribution alias (dwiboy6bfbta4.cloudfront.net).

There is an option for creating a staging distribution for [Continuous deployment](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/continuous-deployment.html?icmpid=docs_cf_help_panel#continuous-deployment-general). That looks interesting.

Worked beautifully.

https://test.cs240.click
