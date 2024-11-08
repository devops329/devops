# AWS S3

🔑 **Key points**

- AWS S3 is a high performance, scalable, object store.
- S3 is structured with a bucket that contains objects.
- There is a powerful permission model that controls access to a bucket.
- You can use the AWS CLI or browser interface to manipulate a bucket.

---

One of the earliest services provided by Amazon Web Services was an object storage service named S3 (Simple Storage Service). S3 is a scalable, high-speed, web-based cloud storage service designed for online backup and archiving of data. S3 provides access through a web service interface, allowing users to store and retrieve any amount of data from anywhere on the web.

S3 provides high durability and availability, security features such as encryption and access controls, scalability to handle large volumes of data, cost-effectiveness, and integration with a wide range of AWS services and third-party tools. All of these reasons make it a good choice for your production deployment of the JWT Pizza static frontend.

![S3 bucket](s3Bucket.png)

At a basic level S3 is just a global list of bucket names that each contain a potentially very large number of named objects. There is no directory structure like you might expect in a file system. However, S3 honors a naming convention that mimics much of the structure you would expect. For example, if you name an object:

```txt
20240623.002941/assets/index-BwtN1-bI.css
```

It doesn't actually have a directory structure or path, but objects with the same prefix will appear to be associated. Additionally, the `/` character is treated as special by many tools. This allows them to display and navigate them as directories, when in reality it is just another character in the name.

## Accessing S3 files

You can experiment with S3 by using the AWS Browser console interface, or with the AWS CLI from your command console. For example, you can list all the AWS S3 buckets that are owned by your account with the `ls` command. Make sure you have the AWS CLI installed in your development environment with an associated access key. Otherwise, you can use the [AWS CloudShell service](https://aws.amazon.com/cloudshell/) from the AWS Browser Console to experiment with these commands.

```sh
aws s3 ls

2024-05-28 14:52:14 myaccount-cf-templates
2021-03-20 23:49:51 myaccount.com
2024-05-20 22:23:43 pizza.byucsstudent.click
```

You can then list the files in a specific bucket with a similar command. Note the `s3://` protocol at the beginning of the object name. This helps to differentiate the location of the file so that it doesn't conflict with files that might be on your local storage device.

```sh
aws s3 ls s3://pizza.byucsstudent.click

                           PRE assets/
2024-06-21 14:35:50        516 index.html
2024-06-21 14:35:50       8261 jwt-pizza-icon.png
2024-06-21 14:35:50      23142 jwt-pizza-logo.png
2024-06-21 14:35:50     119402 mamaRicci.png
2024-06-21 14:35:50         59 robots.txt
2024-06-21 14:35:50         31 version.json
```

In order to copy files you used the `cp` command where the first parameter is the source and the second parameter is the target. Make sure you include the `--recursive` parameter if you want to copy all the files that share the same prefix.

```sh
aws s3 cp s3://pizza.byucsstudent.click assets --recursive

download: s3://pizza.byucsstudent.click/assets/index-CRT3bSBQ.css to assets/index-CRT3bSBQ.css
download: s3://pizza.byucsstudent.click/assets/index-S42wtqrP.js to assets/index-S42wtqrP.js
```

You can delete one or more files using the `rm` command. This command might seem more complex than what you are used to, but that is mainly because there is no directory structure and so you have to provide parameters for what would have been assumed from the structure itself.

```sh
aws s3 rm s3://pizza.byucsstudent.click --recursive --exclude "*" --include "assets*"

delete: s3://pizza.byucsstudent.click/assets/index-BwtN1-bI.css
delete: s3://pizza.byucsstudent.click/assets/index-CIrFRDex.js
delete: s3://pizza.byucsstudent.click/assets/index-CRT3bSBQ.css
```

## S3 access

By default, all S3 buckets are private and the objects they contain can only be accessed by entities that you give permission. This can be done by creating an AWS IAM Role that has a policy giving it permission to the bucket.

```json
{
  "Effect": "Allow",
  "Action": ["s3:ListBuckets", "s3:ListObjects", "s3:GetObject"],
  "Resource": "arn:aws:s3:::pizza.byucsstudent.click/*"
}
```

Alternatively, you can make your bucket publicly available for read access by altering the bucket's permissions in the AWS Browser console. You should only do this if you want to host files directly from your bucket.

![Public bucket access](publicBucketAccess.png)

## S3 and JWT Pizza

You are going to use S3 to statically host the JWT Pizza static frontend code that you are currently hosting with GitHub Pages. You can actually host a static website directly from S3 and even associate your DNS hostname with a bucket that serves the files over HTTPS. However, we want to take advantage of the AWS CloudFront service's ability to act as a content delivery network (CDN) for JWT Pizza, and so you will keep the bucket private and just give CloudFront rights to access the bucket.

![CloudFront access](cloudFrontAccess.png)

## ☑ Assignment

Create an S3 bucket and copy a file into the bucket.

1. Open the AWS browser console and navigate to the S3 service.
1. Click on the `Create bucket` button.
1. Select the `General configuration` option and name it something unique. Remember that the bucket namespace is global, and so you cannot use a name that already is in use.

   ![Create bucket](createBucket.png)

1. Leave all the other settings with their default, including _Block all public access_. Press the `Create bucket` button.
1. Click on the newly created bucket to open it up.
1. Drag a file from your development environment and drop it on the `Upload` target.
1. Press the `Upload` button and then press the `Close` button to return to the bucket view.

Take a screenshot of the bucket with your file in it and submit it to the Canvas assignment. Your screenshot should look something like the following.

![Bucket with file](bucketWithFile.png)

Once you are done you can go ahead and delete all the files in the bucket and then delete the bucket itself.
