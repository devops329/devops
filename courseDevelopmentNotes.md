# GitHub

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

## gh-pages NPM package

This is created by the create-react-team, but it mostly works for Vite also. You just need to change the `-d build` param to be `-d dist`

https://create-react-app.dev/docs/deployment/#github-pages

```sh
npm -D install gh-pages
```

Modify package.json

```json
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://github.com/byucsstudent/jwt-pizza.git",
```

# Changes made on local account

## JWT Pizza Student

Implementation of course deliverables

- CloudFront distribution
- IAM Roles and policies for OIDC
- Bucket for frontend
- Route 53 domain
- Certificate Manager for domain

## ECR

### Create repository

- Navigate to ECR. Expand the menu
- Select public registry
- Select `create repository`
- Made it public
- Gave it the name `webserver`

### Create an image

- Create a simple react app
  ```sh
  mkdir webserver && cd webserver
  npm init -y
  npm install express
  ```
- Write the express code

  ```js
  const express = require('express');

  const app = express();

  app.get('*', (req, res) => {
    console.log(req.path);
    res.send('Hello, World!');
  });

  app.listen(3000, () => {
    console.log('running on 3000');
  });
  ```

- Create docker file

  ```sh
  docker init

  # Follow all the prompts
  ? What application platform does your project use? Node
  ? What version of Node do you want to use? 20.11.1
  ? Which package manager do you want to use? npm
  ? What command do you want to use to start the app? node index.js
  ? What port does your server listen on? 3000

  CREATED: .dockerignore
  CREATED: Dockerfile
  CREATED: compose.yaml
  CREATED: README.Docker.md
  ```

  This created some really useful stuff such as `.dockerignore`, `Dockerfile`, `compose.yaml`, and even a `README.docker.md` that describes how to build and deploy. This might be overkill, but it does expose all new things that Docker provides.

  The docker file does several important steps:

  - Used a base docker image that has the correct node version
  - Specifies thw working dir of the app
  - `npm ci` to install all the dependencies
  - Copies the files into the container
  - Exposes port 3000 from the container
  - Starts up the app. In this case I am using Vite to host the server

- Build the image. I can either use docker compose or docker build. Compose will build and start up the application and allows for a `service` to be defined that launches multiple containers. Build just creates the image.

  ```sh
  docker build -t webserver .

  docker image ls --all
  REPOSITORY                        TAG       IMAGE ID       CREATED         SIZE
  webserver                         latest    0cd8f858dfe7   9 seconds ago   176MB
  ```

  You can also specify the target platform

  ```sh
  docker build --platform=linux/amd64 -t webserver:linux-latest .
  ```

- Test that it works. This creates the container from the image, names it `webserver`, runs it in the background, and opens up port 3000.

  ```sh
  docker run -d --name webserver -p 3000:3000 webserver
  ```

- To remove a running container

  ```sh
  docker kill webserver
  docker container rm webserver

  # or simply

  docker container rm -f webserver
  ```

### Deploy image to ECR

If you open your repository in ECR there is an option to `View push commands`. This gives you everything you need.

First create a temporary login with ECR so that docker can push.

```sh
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 464152414144.dkr.ecr.us-east-2.amazonaws.com

Login Succeeded
```

Tag my image in the local registry

```sh
docker tag webserver:latest 464152414144.dkr.ecr.us-east-2.amazonaws.com/webserver:latest
```

push the image to ECR

```sh
docker push 464152414144.dkr.ecr.us-east-2.amazonaws.com/webserver:latest
```

## ECS/Fargate

### Create an ECS task

Created a task definition that references my ECR image using fargate.

- Navigate to the ECS service
- Select `Task definitions`
- Press `Create new task definition`
- Define the task basics
  - Give the task a name: `webserver`
  - Infrastructure requirements: `AWS Fargate`
  - Linux/X86/64 (I guess I can also do ARM if my container is set for that $0.040 vs $0.032.
  - .5 vCPU
  - Chose the task role (this allows ECS to execute the task on my behalf)
  - Chose the task execution role (this allows my task to do things like make Aurora calls)
- Define the container the task will run
  - Copy the image URI from ECR
  - Specify the port mapping 80-3000
  - I enabled log collection to cloudwatch so I can see what happens
- Press create task

## Create a cluster

The cluster specifies where the service runs (EC2 or Fargate)

- Named it `webserver`

This kicked off a cloudformation script.

### Deploy a service

From the task definition page choose to deploy or from the cluster/services pane create a service.

A service defines the execution parameters for the task on the cluster.

- You can define a capacity provider. This will seek to create instances from the provide. Like Fargate or Fargate spot.
- Select service type to be service (instead of task) since it will keep running.
- Specify the family (I believe this pulled from the task definition)
- Specify replica
- Desired tasks: 1

This kicked off a cloudformation script.

This failed to launch my service. Tried to launch the task multiple times with the same error:

```txt
exec /usr/local/bin/docker-entrypoint.sh: exec format error
```

Spot pricing is very interesting. That drops the price to $0.012.
