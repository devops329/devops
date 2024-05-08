# JWT Pizza

![JWT Pizza](jwtPizzaPhone.png)

In order for us to master the concepts of Quality Assurance and Developer Operations we will work on a simple web application named JWT Pizza (pronounced Jot Pizza).

JWT Pizza provides the valuable service of exchanging BitCoin for virtual pizzas that are represented by a cryptographically signed token ([JWT](https://jwt.io/introduction)). JWT Pizza also provides that opportunity to create a franchise and cash in on the 🍕 virtual pizza craze.

An external developer team has written the code for the application and you are in charge of the QA and DevOps roles for writing the tests, deploying to, and managing the production environment.

You shouldn't assume that the external development engineers have done a perfect job with JWT Pizza. In fact, there are several known bugs and security vulnerabilities in the code. Part of your job will be to discover and report these problems.

## JWT Pizza architecture

The 10,000 foot overview of the JWT Pizza application consists of the following pieces:

- **jwtPizza** - React frontend representing the website. Customers can order pizzas, review purchases. Administrators create and manage franchises. Franchisees can add stores and review profits.
- **jwtPizzaService** - Express backend that provides all of the endpoints necessary to manage users, franchises, and pizza orders.
- **jwtPizzaFactory** - External headquarters service that generates and validates JWTs representing a pizza order.

```mermaid
graph TB;
    subgraph Your JWT Pizza
    jwtPizza-->jwtPizzaService
    jwtPizzaService-->database
    end
    subgraph Headquarters
    jwtPizzaService-->jwtPizzaFactory
    end
```

## JWT Pizza frontend

The following is the sitemap for JWT Pizza as provided by the product team. Note that while JWT Pizza is a fairly simple website, it has a significant amount of components and views that will require testing.

Note that interfaces support a breadcrumb that allows a user to view and backtrack their navigation.

```mermaid
graph TB;
    Home-->Login
    Home-->Logout
    Home-->Register
    Home-->History
    Home-->About
    Home-->Menu
    Home-->AdminDashboard
    Home-->FranchiseDashboard
    Register<-->Login
    AdminDashboard-->CreateFranchise
    AdminDashboard-->CloseFranchise
    AdminDashboard-->CloseStore
    FranchiseDashboard-->CreateStore
    FranchiseDashboard-->CloseStore
    Home-->DinnerDashboard
    DinnerDashboard-->Menu
    Menu-->Payment
    Payment-->Login
    Payment-->Delivery
    Delivery-->Verify
    Delivery-->Menu
```

## JWT Pizza Service

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

### JWT Pizza Factory

The chief architect for the JWT Pizza Factory defined the follow endpoints for the service.

| Method | path              | 🔐  | description            | example                                                                                                                                                                                                                    |
| ------ | ----------------- | :-: | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/order        | yes | Create a JWT pizza     | curl -X POST localhost:3000/api/order -H 'authorization: Bearer a42nkl3fdsfagfdagnvcaklfdsafdsa9' -d '{\"diner\": {\"name\":\"joe\"}, \"order\": {\"pizzas\":[\"pep\", \"cheese\"]}}' -H 'Content-Type: application/json'" |
| POST   | /api/order/verify | yes | Verifies a pizza order | curl -X POST localhost:3000/api/order/verify -d '{\"jwt\":\"JWT here\"}' -H 'Content-Type: application/json'"                                                                                                              |

## Application team deployment plan

The application team plans on the following release phases to the QA and DevOps teams. The deliverables will be available via different GitHub repositories. You are expected to **fork** these repositories and use them for your testing and deployment needs.

Note that the application team may release updates to their original deliverable. This will require you to merge your fork with their updates. As long as you do not manipulate the core application code beyond what is necessary to test and deploy the application this should not require you to resolve and merge conflicts.

| Order | Deliverable              | Notes                                                                                                                                                                                                                                                                                                         | Repo                                                                |
| :---: | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
|  1.   | **JWT Pizza (frontend)** | By using the reference version of the _JWT Pizza Service_ that is provided by [JWT headquarters](https://jwt-pizza-service.cs329.click) you can deploy the frontend while you are waiting for the application team to deliver the backend service.                                                            | [JWT Pizza](https://github.com/devops329/jwt-pizza)                 |
|  2.   | **JWT Pizza Service**    | With this deliverable you can change your frontend to use your deployment of this service rather than the [JWT headquarters](https://jwt-pizza-service.cs329.click) version. Note that you are required to obtain an API key from JWT headquarters before you will be able to create a JWT pizza order token. | [JWT Pizza Service](https://github.com/devops329/jwt-pizza-service) |
