# Loki Logging

https://grafana.com/docs/loki/latest/

## Sending logs via http to Loki in Grafana Cloud

### Send some test logs

-   Go to Grafana Cloud
-   Go to Connections - Add new connection
-   Search and select "Logs Http"
-   Follow the provided steps.
    -   Keep default format (via Http)
    -   Select Node for the code snippet and copy into a `logger.js` file in the same folder as your pizza server
-   Run the code

### Visualize the metrics in your PizzaServer dashboard.

-   Edit the Metrics visualization in your dashboard.
-   Enter a Loki query to see all logs from the test data source.
    -   `{source="Code"}` or whatever source the test log has.

### Adapt the code snippet to send custom logs

-   Convert the given fetch request into an async sendLogs function with error handling.
-   Add code to the sendLogs function that constructs the logs request body.

```
const logs = {
    streams: [
                {
                    stream: { Language: 'NodeJS', source: 'pizza_server' },
                    values: logEntries, // Array of log entries
                },
            ],
    };
```

-   Test the sendLogs function with a logEntries array of test logs.

### Send Pizza Server metrics

-   Create an addLog function that takes a message as a parameter and constructs a log in the following format and pushes it onto a global logEntries array.

```
[
    (Math.floor(Date.now() / 1000) * 1000000000).toString(), // Loki wants the current time in nanoseconds
    logMessage,
];
```

-   Add logic so that if there are more than 10 logs, it sends them to the cloud and clears the array.
-   Add an interval timer so that every 5 seconds, if there are logs waiting to be sent it sends them and clears the array.
-   Export addLog and import it into the pizza server. Every time a request is made to the server, send a log message containing the request method and endpoint.
-   Run your server, make some requests, ensure the log messages show up on your dashboard.
