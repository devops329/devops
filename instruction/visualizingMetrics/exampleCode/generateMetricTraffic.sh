#!/bin/bash

# Check if host is provided as a command line argument
if [ -z "$1" ]; then
  echo "Usage: $0 <host>"
  echo "Example: $0 http://localhost:3000"
  exit 1
fi
host=$1

echo hello

# Function to cleanly exit
cleanup() {
  echo "Terminating background processes..."
  kill $pid1 $pid2 $pid3
  exit 0
}

# Trap SIGINT (Ctrl+C) to execute the cleanup function
trap cleanup SIGINT

# Simulate a saying hello
while true; do
  curl -s "$host/hello/torkel" > /dev/null
  echo "Saying hello..."
  sleep $((RANDOM % 2 + 1))
done &
pid1=$!

# Simulate adding a greeting
while true; do
  curl -s -X POST "$host/greeting/hello" > /dev/null
  echo "Adding greeting..."
  sleep $((RANDOM % 9 + 2))
done &
pid2=$!

# Simulate deleting a greeting
while true; do
  curl -s -X DELETE "$host/greeting" > /dev/null
  echo "Deleting greeting..."
  sleep $((RANDOM % 10 + 1))
done &
pid3=$!


# Wait for the background processes to complete
wait $pid1 $pid2 $pid3
