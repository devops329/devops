# AWS RDS MySQL

## Creating a VPC security group

Create a rule for both service and db
Fix so Container doesn't use DB until I can prove the container is being loaded correctly.

1. Open the AWS browser console and navigate to the VPC service.
1. Select `Security groups` from the left panel navigation.
1. Press `Create security group`.
1. Name the group `jwt-pizza-service`.
1. Press the `Add rule` for inbound rules.
   1. Select the `type` of `HTTPS` this should populate the `Port range` with 443. Set the `Source` to `from anywhere`.
   1. Select the `type` of `HTTP` this should populate the `Port range` with 80. Set the `Source` to `from anywhere`.
1. Press `Create security group`.
1. Name the group `jwt-pizza-db`.
1. Press the `Add rule` for inbound rules.
   1. Select the `type` of `MYSQL/Aurora` this should populate the `Port range` with 3306. Set the `Source` to be the `jwt-pizza-service security group.

## Creating a MySQL instance

1. Open the AWS browser console and navigate to the RDS service.
1. Press the `Create database` button.
1. Select `MySQL`.
1. Under `Templates` choose `Free tier`.
1. Under `Settings`
   1. Name your DB instance: `jwt-pizza-service-db`
   1. Specify your Master username
   1. Specify your password
1. Under `Instance configuration`

   1. Select `db.t4g.micro` as the DB instance class

      ![RDS instance configuration](rdsInstanceConfiguration.png)

1. Under `Connectivity`
   1. Select `Choose existing` for the `VPC security group`.
   1. Select `us-east-2` for the `Availablity zone`.
