## Sending metrics via http to Grafana Cloud

### Send some test metrics

-   Go to Grafana Cloud
-   Go to Connections - Add new connection
-   Search and select "Http Metrics"
-   Follow the provided steps.
    -   Keep default metrics format (Prometheus)
    -   Select Node for the code snippet and copy into a `metrics.js` file in the same folder as your pizza server
-   Run the code

### Visualize the metrics in your PizzaServer dashboard.

-   Create a visualization panel
-   Select grafanacloud-yourusername-prom as the data source.
-   Enter a PromQL query to see all metrics from the test data source.
    -   `{source="grafana_cloud_doc"}` or whatever source the test metric has.

### Adapt the code snippet to send custom metrics

-   Convert the given fetch request into an async sendMetrics function with error handling.
-   Having learned the anatomy of a metric, create a function that takes a bar_label and metric value and returns a metric in the correct format.
    -   Change the source to be `pizza_server`.
-   Adapt your sendMetrics function to send a metric given as a parameter, test it works.
-   Create an interval function that sends test metrics every 10 seconds.

### Send Pizza Server metrics

-   Create a function that allows the Pizza Server to create a custom metric.
    -   This could be requests per 10 seconds, total requests, current CPU usage.
-   Export the function and import it in your server.
-   Change the test metric in the interval timer to be your custom metric.
-   View the metrics in your dashboard.
