# ⓻ Metrics: JWT Pizza Service

It is time to add observability to the jwt-pizza-service code. In your fork of the code use what you learned about Grafana metrics to create visualizations that demonstrate the following:

1. HTTP requests by method
1. Active users
1. Total users
1. Authentication attempts
   1. Successful
   1. Failed
1. CPU percentage
1. Available memory
1. Pizzas sold

## Modifying the application code

You are going to have to modify the `jwt-pizza-service` code in order to add observability. You want to be careful to not modify the development team's work as much as possible. If you change things too much then you are probably going to have merge problems when they update the application and you have to merge your fork.

Try to use design patterns and principles such as middleware and modularity to isolate your changes as much as possible.

## Getting started

Here are some suggestions about how to get started

### Add Grafana credentials to config.js

Modify your config.js file to contain the Grafana credentials.

```js
  metrics: {
    source: 'jwt_pizza_service',
    userId: 1,
    host: '',
    apiKey: '',
  }
```

### Create metrics.js

Create a file named `metrics.js`. Use this file to for all the code necessary to interact with Grafana. This may be somewhat similar to what you created in the [Grafana Metrics instruction](../grafanaMetrics/grafanaMetrics.md). However, it will need to be more complex than what was presented in the instruction because it will have to supply metrics for more than just http requests.

### Add request metrics code

Modify your Express application routers to report on the request related metrics. If you expose an Express middleware function from your metrics class this can get a good start on providing metrics by installing that the metrics middleware.

```js
app.use(metrics.requestTracker);
```

### Add system metrics code

Modify `metrics.js` to periodically report on the system metrics. You can get metrics from the operating system in node.js with the `os` module as demonstrated in the following code.

```js
   const os = require('os');

  getCpuUsagePercentage() {
    const cpuUsage = os.loadavg()[0] / os.cpus().length;
    return cpuUsage.toFixed(2) * 100;
  }

  getAvailableMemoryPercentage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;
    return memoryUsage.toFixed(2);
  }
```
