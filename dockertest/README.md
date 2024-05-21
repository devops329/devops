# EC2/Fargate Express website tutorial

https://medium.com/@arliber/aws-fargate-from-start-to-finish-for-a-nodejs-app-9a0e5fbf6361

This assumes you have already created an AWS account, and installed Node.js, Docker, and AWS CLI.

## Create the express app

```sh
mkdir dockertest
npm init -y
npm install express
```

Create the server

```js
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/menu', (req, res) => {
  const storeNames = {
    menu: [{ name: 'Pep' }, { name: 'Cheese' }, { name: 'Veggies' }, { name: 'Meat' }, { name: 'Supreme' }],
  };

  res.json(storeNames);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

Create the HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PizzaShop</title>
  </head>
  <body>
    <p>Welcome to PizzaShop!</p>
    <script>
      function listPizzas() {
        fetch('/api/menu')
          .then((response) => response.json())
          .then((json) => {
            const ul = document.createElement('ul');
            json.menu.forEach((pizza) => {
              const li = document.createElement('li');
              li.textContent = pizza.name;
              ul.appendChild(li);
            });
            document.body.appendChild(ul);
          });
      }
      listPizzas();
    </script>
  </body>
</html>
```

## Dockerfile

Create a simple docker file that uses PM2 to launch the Express HTTP server

```Dockerfile
FROM node:21-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm i --quiet

COPY . .

RUN npm install pm2 -g

CMD ["pm2-runtime", "index.js"]
```

## Create the docker image

```sh
docker build --platform=linux/amd64 -t pizzashop .
```

This will build an image. Note that because my computer is linux/arm64 based, I need to override the default CPU architecture so that it will run in AWS un x64 linux.

## Test the image locally

You can now run the container and view the app running in your browser `http://localhost:3000`.

```sh
docker run --rm -it -p 3000:3000 pizzashop
```

## Create a ECR repository and push image

Log into the AWS browser console and create an ECR repository. Supply a name. The name should match the image name you created previously (e.g. `pizzashop`). Press `Create repository`. If you press the `view push commands` it will display the exact commands you need to run in order to push your image.

```sh
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 1234567890.dkr.ecr.us-east-2.amazonaws.com
docker build -t pizzashop .
docker tag pizzashop:latest 1234567890.dkr.ecr.us-east-2.amazonaws.com/pizzashop:latest
docker push 1234567890.dkr.ecr.us-east-2.amazonaws.com/pizzashop:latest
```

## Create a ECS task definition

Log into the AWS browser console and create an ECS task definition.

- Specify the name of the task (e.g. pizzashop-task).
- Specify the about of CPU an memory you want (e.g. .5 vCPU and 3 GB RAM)
- Select the task execution role (e.g. ecsTaskExecutionRole). You will need create this the first time. This allows ECS to have the rights to run tasks.
- In the container section, give it a name and use the image URI from the image you created in ECR.
- Add the port mapping to 3000

## Create a ECS cluster

Log into the AWS browser console and create an ECS cluster. We will also define the service as part of this process. A service defines multiple tasks that must be run together. For example, if you have a MYSQL and an Express task, you need them to run together.

- Press the `Create cluster` button
- Choose Fargate
- Create the cluster.
- While viewing the newly created cluster, press the option to create a service
- select the simple launch type. The option is for specifying different capacity strategies
- Specify that you want to run as a service as opposed to a task that is short running.
- Select the task that was previously defined.
- Name the service (e.g. pizzashop-service)
- Choose a security group that allows access and give it a public IP address
- Press create

This launches a container with your image in Fargate. You can get the public IP Address from the task information.

Use `Update service` to stop the containers or adjust how you want the service to function.

## Next steps

- Set up a load balancer. This should remove the need for a IP address
- Put DNS on top of it
- Introduce auto scaling.
- Introduce versioned deployment.
