## Sending metrics via http to Grafana Cloud

Grafana stores Prometheus metrics using Mimir, described as "scalable long-term storage for Prometheus."

We have provided an example server with metrics added. Copy and edit this example on your computer.
The steps below show how to send the logs from this example to your Grafana dashboard.

### Send some test metrics

- Go to Grafana Cloud
- Go to Connections - Add new connection
- Search and select "Http Metrics"
  - Keep metrics format as Prometheus
  - Generate an API Key and add to config.json
  - At the bottom of the page, select the Node code snippet. Add the user ID into config.json.
- Run the server and make some requests to it in the browser

### Visualize the metrics in your PizzaServer dashboard.

- Edit the Requests per Minute visualization in your dashboard.
- Enter a PromQL query to see the metrics data.
  - `{source="example", bar_label="requests_per_minute"}`
- Run query
- Apply and save changes to Dashboard
- Repeat for the Total Requests panel.
  - `{source="example", bar_label="total_requests"}`
