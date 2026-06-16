# Simulating traffic

🔑 **Key points**

- Using `curl`, you can simulate data to help create and test visualizations for production use.

---

When building DevOps automation components—such as metrics, logs, or alerts—it is often necessary to simulate traffic to validate that the system responds correctly. While you could manually use a browser to generate requests, automating traffic with scripts is more efficient. One effective method is using `curl` commands wrapped in shell scripts.

## Specifying the target host

First, define the host you want to target. If you are running the application in a local development environment, set the variable like this:

```sh
host=http://localhost:3000
```

If you are targeting a production system, set it to your service's URL:

```sh
host=https://pizza-service.yourdomainname.click
```

## Common endpoint calls

The following examples demonstrate how to simulate various user behaviors.

> [!NOTE]
>
> You must use a POSIX-compliant environment (such as Linux or macOS) to run these scripts. On Windows, you can use Git Bash. These commands also require `jq` for processing JSON and assume you have populated your database using the [JWT Pizza Data](../jwtPizzaData/jwtPizzaData.md) instructions.

### Request the menu every three seconds

This script simulates a user browsing the menu at regular intervals.

```sh
while true; do
  curl -s "$host/api/order/menu"
  sleep 3
done
```

### Attempt an invalid login every 25 seconds

This simulates failed authentication attempts, which is useful for testing security alerts.

```sh
while true; do
  curl -s -X PUT "$host/api/auth" \
    -d '{"email":"unknown@jwt.com", "password":"bad"}' \
    -H 'Content-Type: application/json'
  sleep 25
done
```

### Login and logout two minutes later

This simulates a user session that lasts for two minutes.

```sh
while true; do
  response=$(curl -s -X PUT "$host/api/auth" -d '{"email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json')
  token=$(echo "$response" | jq -r '.token')
  sleep 110
  curl -s -X DELETE "$host/api/auth" -H "Authorization: Bearer $token"
  sleep 10
done
```

### Login, buy a pizza, and logout

This script simulates a complete successful transaction: logging in, placing an order, waiting 20 seconds, and logging out.

```sh
while true; do
  response=$(curl -s -X PUT "$host/api/auth" -d '{"email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json')
  token=$(echo "$response" | jq -r '.token')
  curl -s -X POST "$host/api/order" \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $token" \
    -d '{"franchiseId": 1, "storeId":1, "items":[{ "menuId": 1, "description": "Veggie", "price": 0.05 }]}'
  sleep 20
  curl -s -X DELETE "$host/api/auth" -H "Authorization: Bearer $token"
  sleep 30
done
```

### Simulate a failed order (too many pizzas)

This script attempts to order more pizzas than the system allows (e.g., 22 pizzas), causing a server error. This is useful for testing how your monitoring system handles `500` status codes.

```sh
while true; do
  response=$(curl -s -X PUT "$host/api/auth" -d '{"email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json')
  token=$(echo "$response" | jq -r '.token')
  echo "Login hungry diner..."

  items='{ "menuId": 1, "description": "Veggie", "price": 0.05 }'
  for (( i=0; i < 21; i++ ))
  do 
    items+=', { "menuId": 1, "description": "Veggie", "price": 0.05 }'
  done

  curl -s -X POST "$host/api/order" \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $token" \
    -d "{\"franchiseId\": 1, \"storeId\":1, \"items\":[$items]}"
  
  echo "Bought too many pizzas..."
  sleep 5
  curl -s -X DELETE "$host/api/auth" -H "Authorization: Bearer $token" > /dev/null
  echo "Logging out hungry diner..."
  sleep 295
done
```

## Simulating traffic with a combined script

You can combine these patterns into a single script that runs multiple simulations in the background. The [generatePizzaTraffic.sh](simulatingTrafficExample/generatePizzaTraffic.sh) script provides an example of this approach.

The general flow of the script is:
1. Exit if the host is not provided as a parameter.
2. Define a cleanup function to kill background processes when `CTRL-C` is pressed.
3. Launch several `while` loops as background processes to simulate different request types.
4. Wait for the background processes to complete.

To run the script, provide the URL of the target server as an argument:

```sh
./generatePizzaTraffic.sh https://pizza-service.yourdomainname.click
```

The script will produce output similar to the following:

```text
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


## ☑ Exercise


```masteryls
{"id":"0142ee9c-d109-40af-81fe-30d7fafde63a", "title":"Simulating traffic", "type":"essay", "gradingCriteria":"- Must contain output from the traffic simulation script. This includes Requesting menu, Login diner, and invalid credentials." }
Submit the output from running the script.
```
