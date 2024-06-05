# Grafana logging

https://grafana.com/docs/loki/latest/

## Sending logs via http to Loki in Grafana Cloud

We have provided an example server with logging added. Copy this example onto your computer.
The steps below show how to send the logs from this example to your Grafana dashboard.

### Send some test logs

- Go to Grafana Cloud
- Go to Connections - Add new connection
- Search and select "Logs Http"
  - Keep format as Http
  - Generate an Access Policy Token and add to config.json
  - At the bottom of the page, select the Node code snippet. The number following `'Authorization': 'Bearer ` is your user id. Add this to config.json
- Run the server and make some requests to it in the browser

### View the logs in your PizzaServer dashboard.

- Edit the Metrics visualization in your dashboard
- Under 'Query' toggle 'Code'
- Enter this Loki query to see the logs data
  - `{source="example"}`
- Run query
- Apply and save changes to Dashboard
