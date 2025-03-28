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

> [!NOTE]
>
> You must use a POSIX compliant environment to use these scripts. Linux and MacOS are POSIX compliant. On Windows you can use the Git Bash command terminal to be sufficiently compatible. These commands also assume that you have populated your database with the default data provided by the [JWT Pizza Data](../jwtPizzaData/jwtPizzaData.md) instruction.

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

### Login, buy "too many pizzas" to cause an order to fail, wait 5 seconds, logout, wait 295 seconds

```sh
while true; do
  response=$(curl -s -X PUT $host/api/auth -d '{"email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json')
  token=$(echo $response | jq -r '.token')
  echo "Login hungry diner..."

  items='{ "menuId": 1, "description": "Veggie", "price": 0.05 }'
  for (( i=0; i < 21; i++ ))
  do items+=', { "menuId": 1, "description": "Veggie", "price": 0.05 }'
  done

  curl -s -X POST $host/api/order -H 'Content-Type: application/json' -d "{\"franchiseId\": 1, \"storeId\":1, \"items\":[$items]}"  -H "Authorization: Bearer $token"
  echo "Bought too many pizzas..."
  sleep 5
  curl -s -X DELETE $host/api/auth -H "Authorization: Bearer $token" > /dev/null
  echo "Logging out hungry diner..."
  sleep 295
done
```

## Simulating traffic script

You can also combine commands together into a script that runs all commands. The [generatePizzaTraffic.sh](simulatingTrafficExample/generatePizzaTraffic.sh) provides an example of doing this. The following outlines the general flow of the script.

1. Exit if host not provided as a parameter
1. Provide a function that kills all of the while loops background processes on CTRL-C
1. Repeatedly run curl commands in while loops as background processes.
1. Simulate different request types
1. Wait for the background processes to complete

You can run this script by providing the URL of the server you want to target. In the following example, make sure you replace the service pizza URL with `localhost:3000` if you are running against your development environment, or your production pizza service URL it you are trying simulate traffic there.

```sh
./generatePizzaTraffic.sh https://pizza-service.yourdomainname.click
```

This will result in something like the following output

```sh
Requesting menu... 200
Logging in with invalid credentials... 404
Login hungry diner... true
Login franchisee... true
Login diner... true
Bought a pizza... 200
Requesting menu... 200
Requesting menu... 200
Requesting menu... 200
Bought too many pizzas... 500
```
