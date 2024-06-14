# Simulating traffic

It is often necessary when building DevOps automation components (e.g. when creating metrics, logs, or alerts) to simulate traffic in order to validate that things are working. You can open your browser and start manually buying pizzas, or you can write some code to automate a simulation of the traffic. One way to do this is to use Curl commands wrapped in some scripting code.

## Specifying the target host

First you need to assign the host that you are wanting to drive traffic against. If you are running in your development environment then it will look like this:

```sh
host=http://localhost:3000
```

If you are hitting your production system then you will set it to something like:

```sh
host=https://pizza-service.byucsstudent.click
```

## Common scripts

The following are some examples that you can use.

⚠️ **Note** that you must use a POSIX compliant command console to use these scripts. These commands also assume that you have populated your database with the default data provided by the [JWT Pizza Data](../jwtPizzaData/jwtPizzaData.md) instruction.

### Hit the menu every three seconds

```sh
while true
 do curl -s $host/api/order/menu;
  sleep 3;
 done;
```

### Invalid login every 25 seconds

```sh
while true
 do
  curl -s -X PUT $host/api/auth -d '{"email":"unknown@jwt.com", "password":"bad"}' -H 'Content-Type: application/json';
  sleep 25;
 done;
```

### Login and logout two minutes later

```sh
while true
 do
  response=$(curl -s -X PUT $host/api/auth -d '{"email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json');
  token=$(echo $response | jq -r '.token');
  sleep 110;
  curl -X DELETE $host/api/auth -H "Authorization: Bearer $token";
  sleep 10;
 done;
```

### Login, buy a pizza, wait 20 seconds, logout, wait 30 seconds

```sh
while true
 do
   response=$(curl -s -X PUT $host/api/auth -d '{"email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json');
   token=$(echo $response | jq -r '.token');
   curl -s -X POST $host/api/order -H 'Content-Type: application/json' -d '{"franchiseId": 1, "storeId":1, "items":[{ "menuId": 1, "description": "Veggie", "price": 0.05 }]}'  -H "Authorization: Bearer $token";
   sleep 20;
   curl -X DELETE $host/api/auth -H "Authorization: Bearer $token";
   sleep 30;
 done;
```
