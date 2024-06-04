# Grafana metrics

In previous instruction we use the TestData data source to display randomly generated metrics on a Grafana dashboard. Now we want to demonstrate how to actually to actually supply data for visualization.

Grafana has dozens of predefined data sources for all kinds of data services. This includes services such as MySQL, AWS CloudWatch, Caddy Server, CSV files, ElasticSearch, GitHub, and so on. Each of these data sources define how to connect to the service and what data they expose for visualization in a dashboard panel.

## Inserting metrics using HTTP

For this exercise you will use the `HTTP Metrics` connector to insert data into a Prometheus data service hosted on Grafana Cloud and exposed using the `grafana-youraccountnamehere-prom` data source that Grafana created by default when you set up your account.

![Metrics overview](metricsOverview.png)

In order to send metrics over HTTP you will need an API key.

1. Open up your Grafana Cloud dashboard.
1. Select the `Connections` option form the left home menu and press `Add new connection`.
1. In the connection search box enter `HTTP Metrics` and press enter

   ![HTTP Metrics connection](httpMetricsConnection.png)

1. This will display the template necessary to obtain the API Key for uploading metrics to the Grafana Cloud Prometheus service.
1. Supply the name `jwt-pizza-metrics` for the `Access Policy token name`.
1. Press `Create token`.
1. Copy the token to a secure location in your development environment. You will need this token up upload metrics.
1. Note the section titled `Anatomy of a metric`. This defines how to format the data that you upload to Prometheus.
1. Note the section titled `Send a Prometheus metric from your application code`. This gives you examples of how to upload a metric using things like Curl, Node.js, or Go. The example has your API Key already prepopulated in the example.
1. Copy the example for Curl. It will look something like the following:

   ```sh
   API_KEY="1111111:glc_111111111111111111111111111111111111111111="
   URL="https://influx-prod-13-prod-us-east-0.grafana.net/api/v1/push/influx/write"

   curl -X  POST -H  "Authorization: Bearer $API_KEY" -H  "Content-Type: text/plain" "$URL" -d "test,bar_label=abc,source=grafana_cloud_docs metric=35.2"
   ```

   The first two commands set shell variables for the API key and the connection URL for the Prometheus service. The final command tells Curl to upload a metric.

### InfluxDB line protocol syntax

The metric string uses uses the [InfluxDB line protocol syntax](https://docs.influxdata.com/influxdb/cloud/reference/syntax/line-protocol/). This has the following general syntax.

```sh
<measurement>[,<tag_key>=<tag_value>]* [<field_key>=<field_value>]*
```

The example that you copied looks like this:

```sh
test,bar_label=abc,source=grafana_cloud_docs metric=35.2
```

This will create a Prometheus metric named **test_metric** with a value of 35.2 that is tagged with two labels: **bar_label** and **source**.

We want to insert data that represents the number of total HTTP requests we have seen, and so we will use the following:

```sh
request,source=jwt_pizza_service total=1000
```

### Using Curl to insert metrics

Using the example command and your newly minted API key you can now insert data into Prometheus.

1. Open up a command console window.
1. Paste and execute the commands that set up the key and URL shell variables.
1. Modify the Curl command to insert the data so that it represents total number of requests.
   ```sh
   curl -X  POST -H  "Authorization: Bearer $API_KEY" -H  "Content-Type: text/plain" "$URL" -d "request,source=jwt_pizza_service total=1000"
   ```
1. Execute the Curl command a few more times. Wait a couple seconds between each execution. This will insert multiple metrics so that the visualization is more interesting.

### Create a visualization

1. Open up your Grafana Cloud dashboard.
1. Open the Home menu, click on Dashboards, and then select **Awesome Dashboard** that you previous created.
1. Click the `Add` button on the top menu and create a new visualization.
1. For the `Data source` specify **grafanacloud-youraccountnamehere-prom**.
1. For `Metric` select **request_total**, and for `Label filters` select **source** with a value of **jwt_pizza_service**. These are the values that you provided with the Curl command.
1. Press `Run Queries` to cause the data source to pull data from Prometheus.
1. Change the time range, on the top menu bar, to be the last 15 minutes.

   ![Visualization editor](visualizationEditor.png)

1. Press the `Save` button, confirm the save, and then press `Apply` to return to your dashboard.
1. Save the dashboard with the new panel by pressing the `Save` button.

This should display the metrics that you inserted using Curl. You can experiment with this by executing more Curl commands and refreshing the dashboard to see the result.

## Sending metrics from code

Next we will create a simple Express service that sends metrics to Grafana.

Create a simple Express app by doing the following.

1. Open you command console.
1. Execute the commends:
   ```sh
   mkdir metricsExample && cd metricsExample
   npm init -y
   npm install express
   ```
1. Modify the `package.json` file to include a start script.
   ```json
     "scripts": {
       "start": "node index.js"
     },
   ```
1. Create a `config.json` file to include your credentials. Make sure you include this in your `.gitignore` file if you push this code to GitHub.
1. Create an `index.js` that contains your simple demonstration service.

   ```js
   cow;
   ```
