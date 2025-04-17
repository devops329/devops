# Visualizing metrics

🔑 **Key points**

- Experiment with creating visualizations based on generated data.

---

Inserting and visualizing metrics can take some time to get comfortable with. You should spend time both inserting data and experimenting with the visualization options that have made Grafana so popular.

![Big green number](bigGreenNumber.png)

For this course we mainly focus on visualizing service metric and so let's carefully walk through the basic concepts you are going to need in order to build your JWT Pizza dashboard.

## A simple web service

Let's start by creating a simple web service that has a single endpoint.

1. Open your command console.
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

1. Create an `index.js` that contains your simple demonstration service that returns a greeting to the given person.

   ```js
   const express = require('express');
   const app = express();

   let greeting = 'hello';

   app.get('/greet/:name', (req, res) => {
     res.send({ [greeting]: req.params.name });
   });

   app.listen(3000, function () {
     console.log(`Listening on port 3000`);
   });
   ```

1. Create a `config.js` file to include your Grafana credentials just like you did in the [Grafana Metrics](../grafanaMetrics/grafanaMetrics.md#generating-data-with-javascript) instruction.
1. Create a `metrics.js` file that uses a similar `sendMetricToGrafana` that we created earlier. The difference is that it sends multiple metrics in a single request and also parameterize the OTel request so that we can represent different types of data with different labels.

   There are two different ways that the application can supply metrics. The `greetingChanged` method simply increments each time the greeting is reported as being changed. The `requestTracker` Express middleware makes it so you can add the middleware function to each endpoint that we want to track.

   We then use `setInterval` so that every 10 seconds the metrics are aggregated together and sent to grafana.

   ```js
   const config = require('./config');

   // Metrics stored in memory
   const requests = {};
   let greetingChangedCount = 0;

   // Function to track when the greeting is changed
   function greetingChanged() {
     greetingChangedCount++;
   }

   // Middleware to track requests
   function requestTracker(req, res, next) {
     const endpoint = `[${req.method}] ${req.path}`;
     requests[endpoint] = (requests[endpoint] || 0) + 1;
     next();
   }

   // This will periodically send metrics to Grafana
   setInterval(() => {
     const metrics = [];
     Object.keys(requests).forEach((endpoint) => {
       metrics.push(createMetric('requests', requests[endpoint], '1', 'sum', 'asInt', { endpoint }));
       metrics.push(createMetric('greetingChange', greetingChangedCount, '1', 'sum', 'asInt', {}));
     });

     sendMetricToGrafana(metrics);
   }, 10000);

   function createMetric(metricName, metricValue, metricUnit, metricType, valueType, attributes) {
     attributes = { ...attributes, source: config.source };

     const metric = {
       name: metricName,
       unit: metricUnit,
       [metricType]: {
         dataPoints: [
           {
             [valueType]: metricValue,
             timeUnixNano: Date.now() * 1000000,
             attributes: [],
           },
         ],
       },
     };

     Object.keys(attributes).forEach((key) => {
       metric[metricType].dataPoints[0].attributes.push({
         key: key,
         value: { stringValue: attributes[key] },
       });
     });

     if (metricType === 'sum') {
       metric[metricType].aggregationTemporality = 'AGGREGATION_TEMPORALITY_CUMULATIVE';
       metric[metricType].isMonotonic = true;
     }

     return metric;
   }

   function sendMetricToGrafana(metrics) {
     const body = {
       resourceMetrics: [
         {
           scopeMetrics: [
             {
               metrics,
             },
           ],
         },
       ],
     };

     fetch(`${config.url}`, {
       method: 'POST',
       body: JSON.stringify(body),
       headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
     })
       .then((response) => {
         if (!response.ok) {
           throw new Error(`HTTP status: ${response.status}`);
         }
       })
       .catch((error) => {
         console.error('Error pushing metrics:', error);
       });
   }

   module.exports = { requestTracker, greetingChanged };
   ```

1. Modify `index.js` so that the endpoint includes the `metrics.requestTracker` middleware.

   ```js
   const metrics = require('./metrics');

   app.get('/greet/:name', metrics.requestTracker, (req, res) => {
     res.send({ [greeting]: req.params.name });
   });
   ```

## Generate data

With the service created you can now start it running.

```sh
npm run start
```

And use a Curl command to repeatedly hits the **greeting** endpoint.

```sh
while true; do curl localhost:3000/greet/torkel; sleep 1; done;
```

## Create the visualization

Now that you are generating data for your web service you can create a visualization to display the endpoint request count.

1. Go to your dashboard.
1. Create a new visualization.
1. Set the `Query options` to display on a **Min interval** of 10s.
1. Select the `requests_total` metric with a label filter of `source` equal to `jwt-pizza-service-dev`.
1. Add an operation with a `Rate` **Range function** with a **Range** of 30s.
1. Change the legend options to be custom with a value of {{endpoint}}.
1. Experiment with the visualization options to make the graph more appealing.

![endpoint visualization](endpointVisualization.png)

## ☑ Exercise

At this point you should have a pretty good idea of how to create a Grafana dashboard that displays a simple request count metric as generated from JavaScript. Now it is time to take it to the next level. Do the following:

1. Modify the service code to:
   1. Provide a PUT endpoint that updates the greeting. Include the `metrics.requestTracker` middleware. When the greeting is changed, call `metrics.greetingChanged` so that we visualize how often the greeting is changed.
      ```sh
      [PUT] /greeting/:greeting
      ```
   1. Provide a DELETE endpoint that resets the greeting back to the default. Include the `metrics.requestTracker` middleware.
      ```sh
      [DELETE] /greeting
      ```
1. Use the [generateMetricTraffic.sh](exampleCode/generateMetricTraffic.sh) shell script to make requests to all the endpoints.
1. Change the visualization so that it shows a series for **each endpoint** as well as a **total** request count. Also include the rate at which the greeting is changed.

When you are done, you should have a dashboard that looks something like this:

![all endpoint visualization](allEndpointsVisualization.png)
