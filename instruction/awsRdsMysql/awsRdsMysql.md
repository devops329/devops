# AWS RDS MySQL

With a cloud deployment you can take advantage of scalable database services that can dynamically increase in storage and computing power as your customer audience increases. For the JWT Pizza service we are going to use the Relational Database Service (RDS) MySQL implementation.

## Creating the VPC security groups

The first step you need to take is to configure the security groups so that the jwt-pizza-service can talk to the database.

1. Open the AWS browser console and navigate to the VPC service.
1. Select `Security groups` from the left panel navigation.
1. Press `Create security group`.
1. Name the group `jwt-pizza-service`.
1. Press the `Add rule` for inbound rules.
   1. Select the `type` of `HTTPS` this should populate the `Port range` with 443. Set the `Source` to `from anywhere`.
   1. Select the `type` of `HTTP` this should populate the `Port range` with 80. Set the `Source` to `from anywhere`.
1. Press `Create security group`.
1. Name the security group `jwt-pizza-db`.
1. Press the `Add rule` for inbound rules.
   1. Select the `type` of `MYSQL/Aurora` this should populate the `Port range` with 3306. Set the `Source` to be the `jwt-pizza-service security group.

🚧 This needs a picture so that you can see how they relate to each other

## Creating a MySQL instance

With the network security deployed you can now create the MySQL server instance.

1. Open the AWS browser console and navigate to the RDS service.
1. Press the `Create database` button.
1. Select `MySQL`.
1. Under **Templates** choose `Free tier`.
1. Under **Settings**
   1. Name your DB instance: `jwt-pizza-service-db`
   1. Leave the username as: `admin`
   1. Specify your password
1. Under **Instance configuration**
   1. Select `db.t4g.micro` as the DB instance class
      ![RDS instance configuration](rdsInstanceConfiguration.png)
1. Under **Connectivity**
   1. Select **No** for `Public access`.
   1. Select **Choose existing** for the `VPC security group`.
      1. Select the `jwt-pizza-db` security group you created earlier.
      1. Unselect the `default` security group.
   1. Select **us-east-1b** for the `Availablity zone`.
1. Under **Database authentication** select `Password and IAM database authentication`.
1. Press `Create database`.

After a few minutes your database will display that it has been created. Note the **database endpoint**, you will use that as the DB hostname in a minute.

![database properties](databaseProperties.png)

## Securing your database

With the database deployed, it would be great if we could immediately use it. However, we have two problems. We need to safely provide the credentials to the JWT Pizza Service, and we have to access the database over a private network.

Security is often a trade off between ease of use and strong protections. Note that DevOps automation can often help alleviate the burden of the security overhead, by removing the manual steps to that you otherwise have to jump through.

### Private network access

You can solve the network problem by deploying the JWT Pizza service to AWS and opening a hole in the network firewall so that only the service can access the database. You already configured the network hole when you created the security group for the database and specified that only devices in the `jwt-pizza-service` security group could access it.

Keeping the database off of a private network is a good security practice since the database is a high value target that contains user information and credentials.

### DB credentials

To solve the database credential problem, you will store the information necessary to access the database in your `jwt-pizza-service` GitHub Actions secrets. These credentials will then be inserted into the service's configuration when it is deployed.

🚧 At a later point we will remove the credentials and just use AWS IAM assumed roles to provide authentication to the database.

For now you can go ahead and update the GitHub Actions secrets with the values you just configured the database with. This includes the endpoint, username (admin), and password.

| Secret      | Description                                         | Example                                               |
| ----------- | --------------------------------------------------- | ----------------------------------------------------- |
| DB_HOSTNAME | The production hostname for the database            | jwt-pizza-service-db.xxxx.us-east-1.rds.amazonaws.com |
| DB_USERNAME | The production username for the database            | admin                                                 |
| DB_PASSWORD | The production password used to access the database | 90fnkl32sd9clza                                       |

Later on we will manipulate the CI workflow in order to inject the information into the service's configuration.

## ☑ Assignment

Deploy a MySQL server in your AWS account using the instructions given above. This includes the following steps:

1. Create the security groups.
1. Create the MySQL RDS instance.
1. Add the DB connection information to your `jwt-pizza-service` GitHub Action secrets.

Once you are done, go over to Canvas and submit a screenshot of the AWS RDS properties for your MySQL instance. Your image should look similar to the image given above.
