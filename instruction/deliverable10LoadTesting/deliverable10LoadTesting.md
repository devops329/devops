# Deliverable ⓾ Load testing: JWT Pizza Service

Now that you have learned to perform simple load tests with k6, it's time to load test a more typical use of your pizza application. In this deliverable, you will load test the process of a new user registering and ordering pizzas.

## Perform a service load test

In the `k6` folder, create a `jwt-pizza-order.js` file. The options can be identical to the simple test. You will change the default function to perform the following steps:

1. Make a post request to the backend login endpoint to register a new user.
1. Make two post requests to the backend order endpoint ordering pizzas.

To see how to structure your request objects, you can look at the endpoint specifications in `jwt-pizza-service`.

### Managing authentication

You will need to save the authentication token returned by the login request and send this with the authorization header in the order requests.

```javascript
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
   },
```

## ☑ Assignment

🚧 Perhaps have them automate the load test as part of deployment?

In order to demonstrate your mastery of the concepts for this deliverable, complete the following.

1. Create a service load test

Once this is all working, submit JWT Pizza URL of your fork of the `jwt-pizza` repository to the Canvas assignment. This should look something like this:

```txt
https://pizza.cs329.click
```

### Rubric

| Percent | Item     |
| ------- | -------- |
| 100%    | It works |
