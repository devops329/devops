# Grafana logging

Grafana Cloud provides a service called Loki that makes it easy to harness the full power of logging.

![Grafana log explorer](grafanaLogExplorer.png)

## Inserting logs using HTTP

For this exercise you will use the `HTTP Metrics` connector to insert data into a Prometheus data service hosted on Grafana Cloud and exposed using the `grafana-youraccountnamehere-prom` data source that Grafana created by default when you set up your account.

![Logging overview](loggingOverview.png)

In order to send logs over HTTP you will need an API key.

1. Open up your Grafana Cloud dashboard.
1. Select the `Connections` option form the left home menu and press `Add new connection`.
1. In the connection search box enter `Logs HTTP` and press enter
1. This will display the template necessary to obtain the API Key for uploading logs to the Grafana Cloud Loki service.
1. Supply the name `jwt-pizza-logs` for the `Access Policy token name`.
1. Press `Create token`.
1. Copy the token to a secure location in your development environment. You will need this token up upload logs.
1. Note the section titled `Anatomy of your Loki log`. This defines how to format the data that you upload to Loki.
1. Note the section titled `Send logs from your application code`. This gives you examples of how to upload a log event using things like Curl, Node.js, or Go. The example has your API Key already prepopulated in the example.
1. Copy the example for Curl. It will look something like the following:

   ```sh
   curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer 111111:glc_111111111111111111=" -d '{"streams": [{"stream": {"Language": "Curl", "source": "Shell"},"values": [["'"$(($(date +%s)*1000000000))"'", "This is my log line"]]}]}' https://https://logs-prod-006.grafana.net/loki/api/v1/push
   ```

   ⚠️ **Note** that as when this instruction was written there is a bug in the URL. It has the protocol listed twice. Remove the duplicate when you execute the Curl command.

### Loki JSON log syntax

The interesting part of the request displayed above is the body of the HTTP requests. The body follows the [HTTP Loki log syntax](https://grafana.com/docs/loki/latest/reference/loki-http-api/), and is what you will use when you generate log messages. Each message is comprised of one or more streams. Each **stream** contains the labels (e.g. tags) for the log messages represented by the stream. This is followed by one or more **values** that represent that actual log message. You can also include an option **metadata** object that defines one or more metadata values. Note that labels are indexed and searchable, while metadata is not index but can still be used for filtering log messages. You should not include labels that have high cardinality, or lots of different values. That will cause Loki queries to perform poorly.

The general syntax looks like this:

```json
{
  "streams": [
    {
      "stream": {
        "label": "value"
      },
      "values": [["<unix epoch in nanoseconds>", "<log line>", { "<metadata label>": "<metadata value>" }]]
    }
  ]
}
```

If you was going to create a log message that described a login HTTP request, you might create a message that looked like this:

```json
{
  "streams": [
    {
      "stream": {"component":"jwt-pizza-service", "level": "info", "type":"http-req"},
      "values": [
        ["1717627004763", "{"name":"pizza diner", "email":"d@jwt.com", "password":"****"}", { "userID":"32", "traceID": "0242ac120002"}]
      ]
    }
  ]
}
```

### Using Curl to insert logs

Using the example command and your newly minted API key you can now insert data into Loki.

```sh
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer 111111:glc_e111111=" -d '{"streams": [{"stream": {"component":"jwt-pizza-service", "level": "info", "type":"http-req"},"values": [["'"$(($(date +%s)*1000000000))"'","{\"name\":\"hacker\", \"email\":\"d@jwt.com\", \"password\":\"****\"}",{"user_id": "44","traceID": "9bc86924d069e9f8ccf09192763f1120"}]]}]}' -H "Content-Type:application/json" https://logs-prod-006.grafana.net/loki/api/v1/push
```

## Create a visualization

1. Open up your Grafana Cloud dashboard.
1. Open the Home menu, click on Dashboards, and then select **Awesome Dashboard** that you previous created.
1. Click the `Add` button on the top menu and create a new visualization.
1. For the `Data source` specify **grafanacloud-youraccountnamehere-prom**.

## Sending metrics from code

Next we will create a simple Express service that sends metrics to Grafana.

## ☑ Assignment

Go to the associated Canvas assignment and submit the public dashboard URL.

# ------------------------------------------------------------------------------

**OLD STUFF**

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
