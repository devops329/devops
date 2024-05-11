# JWT Pizza Service

![jwt pizza service](jwtPizzaServicePhone.png)

The _JWT Pizza application_ team has finally finished their work on the backend JWT service and has given you access to the backend service code so that you can start testing and deploying it.

Now that you have the service code you will test and deploy the full application stack. This includes the frontend (_jwt-pizza_), backend (_jwt-pizza-service_), and the database. The only piece that you do not actually manage is the service provided by JWT Headquarters the creates the JWT tokens that represents a completed pizza order. Instead you deployment of the JWT service will simply call the factory service that the JWT Headquarters provides.

```mermaid
graph LR;
    subgraph  Dev environment
    jwtPizza-->jwtPizzaService
    jwtPizzaService-->database
    end
    subgraph JWT Headquarters
    jwtPizzaService-->jwtPizzaFactory
    end
```

With this deliverable from the application team you now have all the code for the final product.

## Setting up your development environment

As noted above, a database, is required for the successful deployment of the application. The application team has chosen MySQL as the persistent data store. You will therefore need a MySQL compatible instance of MySQL running both in your development and production environments.

If you do not already have MySQL installed in your development environment, or want to reenforce your basic understanding of how MySQL works then you should review the [Getting Started guide](https://dev.mysql.com/doc/mysql-getting-started/en/) found on dev.mysql.com.

## Forking the application team's repository

To get started you need to fork the code to your GitHub account, run it locally and study how it works. This will get you comfortable with the code so that you are ready to start putting on your QA and DevOps hat.

Here are the steps to take:

1. Navigate your browser over to the [jwt-pizza](https://github.com/devops329/jwt-pizza-service) repository on GitHub.
   ![forkRepo](forkRepo.png)
1. Copy the URL for your fork of the repository.
   ![cloneUrl](cloneUrl.png)
1. Use the URL to clone the repository from your account to your development environment.
   ```sh
   git clone https://github.com/youraccountnamehere/jwt-pizza-service.git
   ```
1. Change directory into the newly clone repository and install the NPM package dependencies.
   ```sh
   cd jwt-pizza-service
   npm install
   ```
1. Obtain a JWT Pizza Factory API Key. You can get this key from the [Autograder](https://autograder.cs329.click) application.
1. Create a `config.js` file in the `src` directory and insert your database credentials, jwtSecret, and API Key. The factory should point to the ULR provided by JWT Headquarters. The following is an example `config.js` file.

   ⚠️ Note that you must replace `jwtSecret`, `connection.password`, and `factory.apiKey` with a values that you generate. `jwtSecret` is used to sign authorization tokens. `connection.password` is the password for your MySQL database. `factory.apiKey` allows you to fulfill orders from the JWT Headquarters factory.

   ```sh
   module.exports =  {
      jwtSecret: 'yourjwtsecrethere',
      db: {
        connection: {
          host: 'localhost',
          user: 'root',
          password: 'yourpasswordhere',
          database: 'pizza',
          connectTimeout: 60000,
        },
        listPerPage: 10,
      },
      factory: {
        url: 'https://jwt-pizza-factory.cs329.click',
        apiKey: 'yourapikeyhere',
      },
   };
   ```

   1. Start the service using `node index.js` or debugging it from within your IDE.
   1. Test that the service is running properly
      ```sh
      curl http://localhost:3000/api/docs
      ```

## Keep in sync

As the application team makes changes to the frontend code you will need to sync your fork of the repository. As long as you are only adding tests and not changing the core code, you shouldn't have to merge any code.

To sync your fork, navigate to your account's fork of the `jwt-pizza-service` repository. It will display if your fork is out of date. Press the `Sync fork` button and confirm the action.

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

### JWT Pizza Service endpoints

The chief architect for the JWT Pizza Service defined the following endpoints for the service. You can also obtain the endpoints using the undocumented [docs](https://pizza.cs329.click/docs) endpoint.

| Method | path                                       | 🔐  | description                               | example                                                                                                                                                                                                         |
| ------ | ------------------------------------------ | :-: | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/auth                                  | no  | Register a new user                       | curl -X POST -c cookies.txt localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"a\"}' -H 'Content-Type: application/json'"                                           |
| PUT    | /api/auth                                  | no  | Login existing user                       | curl -X PUT -c cookies.txt localhost:3000/api/auth -d '{\"email\":\"a@jwt.com\", \"password\":\"a\"}' -H 'Content-Type: application/json'"                                                                      |
| DELETE | /api/auth                                  | no  | Logout a user                             | curl -X DELETE -c cookies.txt localhost:3000/api/auth"                                                                                                                                                          |
| GET    | /api/order/menu                            | no  | Get the pizza menu                        | curl localhost:3000/order/menu"                                                                                                                                                                                 |
| GET    | /api/order                                 | yes | Get the orders for the authenticated user | curl -b cookies.txt -X GET localhost:3000/api/order"                                                                                                                                                            |
| POST   | /api/order                                 | yes | Create a order for the authenticated user | curl -b cookies.txt -X POST localhost:3000/api/order -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"storeId\":1, \"items\":[{ \"menuId\": 1, \"description\": \"Veggie\", \"price\": 0.05 }]}'" |
| GET    | /api/franchise                             | no  | List all the franchises                   | curl -b cookies.txt localhost:3000/api/franchise"                                                                                                                                                               |
| GET    | /api/franchise/:userId                     | yes | List a user's franchises                  | curl -b cookies.txt localhost:3000/api/franchise/1"                                                                                                                                                             |
| POST   | /api/franchise                             | yes | Create a new franchise                    | curl -b cookies.txt -X POST localhost:3000/api/franchise -H 'Content-Type: application/json' -d '{\"name\": \"pizzaPocket\"}'"                                                                                  |
| DELETE | /api/franchise/:franchiseId                | yes | Delete a franchises                       | curl -X DELETE -b cookies.txt localhost:3000/api/franchise/1"                                                                                                                                                   |
| POST   | /api/franchise/:franchiseId/store          | yes | Create a new franchise store              | curl -b cookies.txt -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"name\":\"SLC\"}'"                                                               |
| DELETE | /api/franchise/:franchiseId/store/:storeId | yes | Delete a store                            | curl -X DELETE -b cookies.txt localhost:3000/api/franchise/1/store/1"                                                                                                                                           |

### JWT Pizza Factory endpoints

The chief architect for the Headquarters JWT Pizza Factory service defined the follow endpoints for the service. This is the service that the JWT Pizza Service calls to fulfill pizza orders. You will not deploy a pizza factory, but you will need to know how to use it when you test and deploy the JWT Pizza Service.

| Method | path              | 🔐  | description            | example                                                                                                                                                                                                                    |
| ------ | ----------------- | :-: | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/order        | yes | Create a JWT pizza     | curl -X POST localhost:3000/api/order -H 'authorization: Bearer a42nkl3fdsfagfdagnvcaklfdsafdsa9' -d '{\"diner\": {\"name\":\"joe\"}, \"order\": {\"pizzas\":[\"pep\", \"cheese\"]}}' -H 'Content-Type: application/json'" |
| POST   | /api/order/verify | yes | Verifies a pizza order | curl -X POST localhost:3000/api/order/verify -d '{\"jwt\":\"JWT here\"}' -H 'Content-Type: application/json'"                                                                                                              |

## ☑ Assignment

1. Fork the [jwt-pizza-service](https://github.com/devops329/jwt-pizza-service) repository.
1. Clone it to your development environment.
1. Build and explore the application code.

Once you are done, go over to Canvas and submit the URL of your forked repository. This should look something like this:

```
https://github.com/youraccountnamehere/jwt-pizza-service
```
