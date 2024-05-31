# Deliverable 11: Perform End-to-End Load Testing on JWT Pizza

Now that you have learned to perform simple load tests with k6, it's time to load test a more typical use of your pizza application. In this deliverable, you will load test the complete process of ordering a pizza.

## Register a user

Because we are testing the performance of logging in and ordering a pizza, you will need to pre-register a user before running the tests so that the registration time is not part of the test.

## Perform an end-to-end load test

In the `k6` folder, create a `jwt-pizza-order.js` file. The options can be identical to the simple test. You will change the default function to perform the following steps:

1. Make a get request to your pizza frontend page
1. Make a put request to the backend login endpoint with the credentials of the user you registered.
1. Make a post request to the backend order endpoint with the pizza order details.

To see how to structure your request objects, you can look at the endpoint specifications in `jwt-pizza-service`.

## Managing cookies

The order endpoint expects the authentication cookie that was sent in the login response. A simple way to get and send cookies is by using a `cookie jar` as follows:

```javascript
// Create a cookie jar to store the authentication cookie
const jar = http.cookieJar();
// Replace the backend url with the url of your pizza-service
res = http.put('https://pizza-service.cs329.click/api/auth', JSON.stringify(userObject), {
  headers: { 'Content-Type': 'application/json' },
  jar: jar,
});
```

The cookie jar will store the cookies from the response, and you can send them in the order request by adding the `jar` property to the request.

## Verifying the http responses

You can verify the responses using k6's `check` function.

```javascript
import { check } from 'k6';

...

check(res, {
'status is 200': (r) => r.status === 200,
});
```

## ☑ Assignment

🚧 Perhaps have them automate the load test as part of deployment?

In order to demonstrate your mastery of the concepts for this deliverable, complete the following.

1. Create an end to end test load testing the complete order process.

Once this is all working, submit JWT Pizza URL of your fork of the `jwt-pizza` repository to the Canvas assignment. This should look something like this:

```txt
https://pizza.cs329.click
```

### Rubric

| Percent | Item     |
| ------- | -------- |
| 100%    | It works |
