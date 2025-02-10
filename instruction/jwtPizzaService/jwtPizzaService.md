# JWT Pizza Service

🔑 **Key points**

- Fork the [JWT Pizza](https://github.com/devops329/jwt-pizza-service) service.
- Study the code.

---

![jwt pizza service](jwtPizzaServicePhone.png)

The _JWT Pizza application_ team has finally finished their work on the backend JWT service and has given you access to the backend service code so that you can start testing and learning how it works.

This instruction walks you through the process of setting up the backend JWT Pizza service to run in your development environment. The service will use a MySQL server running in your development environment and call the JWT Pizza Factory running in the JWT Headquarters environment to actually create JWT pizzas.

```mermaid
graph LR;
    subgraph  Development environment
    jwtPizzaService
    jwtPizzaService-->database
    end
    subgraph JWT Headquarters
    jwtPizzaService-->jwtPizzaFactory
    end
```

## Setting up your development environment

As noted above, a database is required for the successful deployment of the application. The application team has chosen MySQL as the persistent data store. You will therefore need a MySQL compatible instance of MySQL running both in your development and production environments.

If you do not already have MySQL installed in your development environment, or want to reinforce your basic understanding of how MySQL works, you should review the [Getting Started guide](https://dev.mysql.com/doc/mysql-getting-started/en/) found on dev.mysql.com.

## Forking the application team's repository

To get started, you need to fork the backend code to your GitHub account, clone it in your development environment, run it, and study how it works. This will get you comfortable with the code so that you are ready to start putting on your QA and DevOps hats.

Here are the steps to take:

1. Navigate your browser over to the Headquarters [jwt-pizza-service](https://github.com/devops329/jwt-pizza-service) repository on GitHub.
1. Fork the repository to your GitHub account.
1. Invite the 329 TA to be a collaborator on your repository by navigating to `Settings -> Collaborators -> Add People` and searching for `byucs329ta`.

   ![collab](../gitHub/addCollaborator.png)

   > [!IMPORTANT]
   >
   > If you do not invite the TA to be a collaborator you will not be able to pass off your deliverables.

1. Copy the URL for your fork of the repository.
1. Use the URL to clone the repository from your account to your development environment.
   ```sh
   git clone https://github.com/youraccountnamehere/jwt-pizza-service.git
   ```
1. Change directory into the newly cloned repository and install the NPM package dependencies.
   ```sh
   cd jwt-pizza-service
   npm install
   ```
1. Obtain a JWT Pizza Factory API Key. You can get this key from the [AutoGrader](https://cs329.cs.byu.edu) application.
1. Create a `config.js` file in the `src` directory and insert your database credentials, jwtSecret, and API Key. The factory should point to the URL provided by JWT Headquarters. The following is an example `config.js` file.

   > [!NOTE]
   >
   > Note that you must replace `jwtSecret`, `connection.password`, and `factory.apiKey` with values that you generate. `jwtSecret` is used to sign authorization tokens and can be any random string. `connection.password` is the password for your MySQL database. `factory.apiKey` allows you to fulfill orders from the JWT Headquarters factory.

   ```sh
   module.exports =  {
      jwtSecret: 'yourjwtsecrethere',
      db: {
        connection: {
          host: '127.0.0.1',
          user: 'root',
          password: 'yourpasswordhere',
          database: 'pizza',
          connectTimeout: 60000,
        },
        listPerPage: 10,
      },
      factory: {
        url: 'https://pizza-factory.cs329.click',
        apiKey: 'yourapikeyhere',
      },
   };
   ```

1. Start the service using `node index.js` or debugging it from within your IDE.
   ```sh
   ➜ cd src
   ➜  node index.js
   Server started on port 3000
   Database exists
   ```
1. Test that the service is running properly by calling the docs endpoint using curl.
   ```sh
   curl http://localhost:3000/api/docs
   ```

## Keeping in sync

To sync your fork, navigate to your account's fork of the `jwt-pizza-service` repository. It will display if your fork is out of date. Press the `Sync fork` button and confirm the action.

> [!NOTE]
>
> Do not press the `Discard commits` button if it is available, or you will lose any code that you have added to your fork such as tests you have written.

![Sync fork](syncFork.png)

You will then need to pull the changes down to your development environment.

```sh
cd jwt-pizza-service
git pull
```

## JWT Pizza architecture

The following is a diagram representing the architecture of the JWT Pizza Service as provided by the application team. Note that while JWT Pizza Service is a fairly simple service, it has a significant number of endpoints that will require testing.

```mermaid
graph TB;
    app-->setAuthUser
    app-->apiRouter
    apiRouter-->authRouter
    apiRouter-->orderRouter
    apiRouter-->franchiseRouter
    apiRouter-->docs
    authRouter-->database
    orderRouter-->database
    franchiseRouter-->database

```

Make sure you spend reasonable time both playing with the interface and also exploring the code. This will be a key factor in your success for both testing and deploying the application.

### JWT Endpoints

The JWT application contains two services, each with their own set of endpoints. You should become very familiar with what the endpoints are and how they work.

| Service       | Purpose                                           | Documentation                                                  |
| ------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Pizza service | User authentication and application functionality | [service docs](https://pizza.cs329.click/docs)                 |
| Pizza factory | Pizza creation and authentication                 | [factory service docs](https://pizza.cs329.click/docs/factory) |

## ☑ Exercise

Following the above instruction you should have already forked and cloned the jwt-pizza-service repository to your development environment. Your copy of the JWT Pizza repo URL should look something like this:

```
https://github.com/youraccountnamehere/jwt-pizza-service
```

Now you can build and start up the backend pizza service in your development environment and learn the code.

1. Build and explore the application code.
   ```sh
   cd jwt-pizza-service
   npm install
   ```
1. Open the jwt-pizza-service project in VS Code.
1. Create your `src/config.json` file with proper configuration settings.
1. Use the VS Code debugger to start up that service.

### Pizza data

When the service starts, it will configure your database with the correct tables and a default admin user. This is enough to get started, but to fully use the application you will need to set up your menu, add a franchise, and a few users. You can do this by following the instructions for configuring your [pizza data](../jwtPizzaData/jwtPizzaData.md).

### Get familiar with the Pizza service

Once you have the backend service is running correctly in your development environment, take some time to debug and step through the code until you completely understand how it all works. The better you understand the code the easier it will be to test, deploy, and monitor the service.

Enable some breakpoints and step through the code that sets up the database, authenticates users, and executes endpoints. You can trigger these events using curl by executing the following commands. If these all return valid responses then you have setup your service correctly in your development environment.

#### Request the default endpoint

```sh
curl http://localhost:3000

{"message":"welcome to JWT Pizza","version":"20240518.154317"}
```

#### View the menu

This should return an empty menu since you haven't created any initial data yet.

```sh
curl http://localhost:3000/api/order/menu

[]
```

#### Login as the default admin

The application automatically creates a default admin user if the database didn't exist when the service was started.

```sh
curl -X PUT http://localhost:3000/api/auth -H "Content-Type:application/json" -d '{"email":"a@jwt.com","password":"admin"}'

{"user":{"id":1,"name":"常用名字","email":"a@jwt.com","roles":[{"role":"admin"}]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM0MDQ1MDE2fQ.XmWeetWEryvDA21NPQFPueiTnHVuTYMwdJregFCW4p8"}
```
