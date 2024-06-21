# GitHub Environments

You can define environments and have secrets for them that an actions workflow can use. They can be restricted to a specific branch.

For example I might have different AWS keys for prod and stage, and I also might have different branches for deploying to those environments.

1. Create the GitHub environment.
1. Create the secrets in the GitHub environment.
1. Modify the IAM Role trust policy
   ```
   "repo:byucsstudent/jwt-pizza:environment:production",
   ```
