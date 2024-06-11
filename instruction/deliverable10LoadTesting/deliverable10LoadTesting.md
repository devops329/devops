# Deliverable ⓾ Load testing: JWT Pizza Service

![course overview](../sharedImages/courseOverview.png)

Now that you have learned to perform simple load tests with k6, it's time to load test a more typical use of your pizza application. In this deliverable, you will load test the process of a new user registering and ordering pizzas.

## Perform a service load test

In your `k6` folder, create a `jwt-pizza-order.js` file. The options can be identical to the simple test, but rename the test group to `JWT Pizza Order`. Change the default function to perform the following steps:

1. Make a post request to the service login endpoint to register a new user.
1. Make two post requests to the service order endpoint ordering pizzas.

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

In order to demonstrate your mastery of the concepts for this deliverable, create a service load test that registers a user and orders two pizzas.

Once this is all working, submit a screenshot of the performance overview to the Canvas assignment.

### Rubric

| Percent | Item                                                       |
| ------- | ---------------------------------------------------------- |
| 100%    | Screenshot demonstrating performance overview of load test |
