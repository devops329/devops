# Simulating traffic

🔑 **Key points**

- Using Curl you can simulate data helps to create visualizations for production use.

---

It is often necessary when building DevOps automation components (e.g. when creating metrics, logs, or alerts) to simulate traffic in order to validate that things are working. You can open your browser and start manually buying pizzas, or you can write some code to automate a simulation of the traffic. One way to do this is to use Curl commands wrapped in some scripting code.

## Specifying the target host

First you need to assign the host that you are wanting to drive traffic against. If you are running in your development environment then it will look like this:

```sh
host=http://localhost:3000
```

If you are hitting your production system then you will set it to something like:

```sh
host=https://pizza-service.yourdomainname.click
```

## Common endpoint calls

The following are some examples that you can use.

⚠️ **Note** that you must use a POSIX compliant command console to use these scripts. These commands also assume that you have populated your database with the default data provided by the [JWT Pizza Data](../jwtPizzaData/jwtPizzaData.md) instruction.

### Hit the menu every three seconds

```sh
while true; do
  curl -s $host/api/order/menu
  sleep 3
done
```

### Invalid login every 25 seconds

```sh
while true; do
  curl -s -X PUT $host/api/auth -d '{"email":"unknown@jwt.com", "password":"bad"}' -H 'Content-Type: application/json'
  sleep 25
done
```

### Login and logout two minutes later

```sh
while true; do
  response=$(curl -s -X PUT $host/api/auth -d '{"email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json')
  token=$(echo $response | jq -r '.token')
  sleep 110
  curl -X DELETE $host/api/auth -H "Authorization: Bearer $token"
  sleep 10
done
```

### Login, buy a pizza, wait 20 seconds, logout, wait 30 seconds

```sh
while true; do
  response=$(curl -s -X PUT $host/api/auth -d '{"email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json')
  token=$(echo $response | jq -r '.token')
  curl -s -X POST $host/api/order -H 'Content-Type: application/json' -d '{"franchiseId": 1, "storeId":1, "items":[{ "menuId": 1, "description": "Veggie", "price": 0.05 }]}'  -H "Authorization: Bearer $token"
  sleep 20
  curl -X DELETE $host/api/auth -H "Authorization: Bearer $token"
  sleep 30
done
```

## Simulating traffic script

You can also combine commands together into a script that runs all commands. The [generatePizzaTraffic.sh](simulatingTrafficExample/generatePizzaTraffic.sh) provides an example of doing this. The following outlines the general flow of the script.

```sh
# Exit if host not provided as a parameter

# Provide a function that kills all of the while loops background processes on CTRL-C

# Repeatedly run curl commands in while loops as background processes.

# Simulate a user requesting the menu every 3 seconds
# Simulate a user with an invalid email and password every 25 seconds
# Simulate a franchisee logging in every two minutes
# Simulate a diner ordering a pizza every 20 seconds

# Wait for the background processes to complete
```

You can run this script by providing the URL of the server you want to target. In the following example, make sure you replace the Headquarters pizza URL with `localhost:3000` if you are running against your development environment, or your production pizza service URL it you are trying simulate traffic there.

```sh
./generatePizzaTraffic.sh https://pizza-service.yourdomainname.click
```

This will result in something like the following output

```sh
Requesting menu...
Logging in with invalid credentials...
Login franchisee...
Login diner...
Bought a pizza...
Requesting menu...
Requesting menu...
Requesting menu...
Requesting menu...
Requesting menu...
Requesting menu...
Logging out diner...
Requesting menu...
```
