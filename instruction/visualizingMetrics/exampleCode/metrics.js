const config = require('./config');

const requests = {};

function track(endpoint) {
  return (req, res, next) => {
    requests[endpoint] = (requests[endpoint] || 0) + 1;
    next();
  };
}

// This will periodically send metrics to Grafana
const timer = setInterval(() => {
  Object.keys(requests).forEach((endpoint) => {
    sendMetricToGrafana('requests', requests[endpoint], { endpoint });
  });
}, 10000);

function sendMetricToGrafana(metricName, metricValue, attributes) {
  attributes = { ...attributes, source: config.source };

  const metric = {
    resourceMetrics: [
      {
        scopeMetrics: [
          {
            metrics: [
              {
                name: metricName,
                unit: '1',
                sum: {
                  dataPoints: [
                    {
                      asInt: metricValue,
                      timeUnixNano: Date.now() * 1000000,
                      attributes: [],
                    },
                  ],
                  aggregationTemporality: 'AGGREGATION_TEMPORALITY_CUMULATIVE',
                  isMonotonic: true,
                },
              },
            ],
          },
        ],
      },
    ],
  };

  Object.keys(attributes).forEach((key) => {
    metric.resourceMetrics[0].scopeMetrics[0].metrics[0].sum.dataPoints[0].attributes.push({
      key: key,
      value: { stringValue: attributes[key] },
    });
  });

  fetch(`${config.url}`, {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        console.error('Failed to push metrics data to Grafana');
      } else {
        console.log(`Pushed ${metricName}`);
      }
    })
    .catch((error) => {
      console.error('Error pushing metrics:', error);
    });
}

module.exports = { track };
