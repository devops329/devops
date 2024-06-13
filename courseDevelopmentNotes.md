# Notes

## Setting the upstream user and password

I had to set the upstream to contain a password since it was the student account. This is really valuable since I can set it on a repo instead of an account.

```sh
git remote set-url origin https://byucsstudent:xxxx@github.com/byucsstudent/jwt-pizza.git
```

You can specify the upstream for the fork to the original repository with:

```sh
git remote add upstream https://github.com/devops329/jwt-pizza.git
```

You can see what the remotes are with

```sh
git remote show origin
git config --get remote.origin.url
git config --get remote.upstream.url
```

To remove the upstream

```sh
git remote remove upstream
```

## Handling a merge conflict with the remote

```sh
git remote add upstream https://github.com/devops329/jwt-pizza-service.git
git fetch upstream
git checkout main
git merge upstream/main
```

# Changes made for coursework

## GitHub

- Creation of junk account
- fork of jwt-pizza and jwt-pizza-service repos
- Creation of github pages deployment
- Creation of Actions workflows

## AWS

- CloudFront distribution
- IAM Roles and policies for OIDC connection to GitHub
- Bucket for frontend
- Route 53 domain
- Certificate Manager for domain
- Bucket for ECR images
- ECR repository with associated image uploads
- ECS cluster with associated task definitions, services, security groups, and deployments
- EC2 ALB for cluster
- Bucket for cloudformation templates
- CloudFormation deployment stack

## Grafana

- Creation of junk account
