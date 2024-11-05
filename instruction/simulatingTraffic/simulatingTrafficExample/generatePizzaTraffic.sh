#!/bin/bash

# Check if $host is defined
if [ -z "$host" ]; then
    echo "Error: The host variable is not defined."
    exit 1
fi

# Function to cleanly exit
cleanup() {
    echo "Terminating background processes..."
    kill $pid1 $pid2 $pid3 $pid4
    exit 0
}

# Trap SIGINT (Ctrl+C) to execute the cleanup function
trap cleanup SIGINT

while true
do
  curl -s "$host/api/order/menu"
  sleep 3
done & 
pid1=$!

while true
do
  curl -s -X PUT "$host/api/auth" -d '{"email":"unknown@jwt.com", "password":"bad"}' -H 'Content-Type: application/json'
  sleep 25
done &
pid2=$!

while true
do
  response=$(curl -s -X PUT $host/api/auth -d '{"email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json');
  token=$(echo $response | jq -r '.token');
  sleep 110;
  curl -X DELETE $host/api/auth -H "Authorization: Bearer $token";
  sleep 10;
done &
pid3=$!

while true
do
  response=$(curl -s -X PUT $host/api/auth -d '{"email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json');
  token=$(echo $response | jq -r '.token');
  curl -s -X POST $host/api/order -H 'Content-Type: application/json' -d '{"franchiseId": 1, "storeId":1, "items":[{ "menuId": 1, "description": "Veggie", "price": 0.05 }]}'  -H "Authorization: Bearer $token";
  sleep 20;
  curl -X DELETE $host/api/auth -H "Authorization: Bearer $token";
  sleep 30;
done &
pid4=$!


# Wait for the background processes to complete
wait $pid1 $pid2 $pid3 $pid4