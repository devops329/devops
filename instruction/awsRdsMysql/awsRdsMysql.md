# AWS RDS MySQL

With a cloud deployment you can take advantage of scalable database services that can dynamically increase in storage and computing power as your customer audience increases. For the JWT Pizza service we are going to use the Relational Database Service (RDS) MySQL implementation.

## Creating the VPC security group

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

After a few minutes your database will display that it has been created. Note the database endpoint, you will use that as the DB hostname in a minute.

![database properties](databaseProperties.png)

## DB credentials

You will need to provide the credentials to your database that the jwt-pizza-service will use to connect. You will store these in your GitHub Actions workflow so that they will be deployed with the correct values. At a later point we will remove the credentials and just use AWS IAM assumed roles to provide authentication to the database.

Use the endpoint, username (admin), and password that you used to create the MySQL instance.

| Secret      | Description                                         | Example                                               |
| ----------- | --------------------------------------------------- | ----------------------------------------------------- |
| DB_HOSTNAME | The production hostname for the database            | jwt-pizza-service-db.xxxx.us-east-1.rds.amazonaws.com |
| DB_USERNAME | The production username for the database            | admin                                                 |
| DB_PASSWORD | The production password used to access the database | 90fnkl32sd9clza                                       |

## Configuring connectivity

You can now access your database
