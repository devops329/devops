const config = require('./config.json');

const USER_ID = config.userId;
const API_KEY = config.apiKey;
const SOURCE = config.source;

let totalRequests = 0;

function incrementRequests() {
  totalRequests++;
}

function createMetricString(metricPrefix, metricName, metric) {
  return `${metricPrefix},source=${SOURCE} ${metricName}=${metric}`;
}

// This will periodically sent metrics to Grafana
setInterval(() => {
  sendMetricToGrafana(createMetricString('request', 'total', totalRequests));
}, 10000);

async function sendMetricToGrafana(metric) {
  fetch(`https://${config.host}/api/v1/push/influx/write`, {
    method: 'post',
    body: metric,
    headers: {
      Authorization: `Bearer ${USER_ID}:${API_KEY}`,
      'Content-Type': 'text/plain',
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error('Failed to push metrics data to Grafana');
      } else {
        console.log('Metrics pushed successfully');
      }
    })
    .catch((error) => {
      console.error('Error pushing metrics:', error);
    });
}

module.exports = {
  incrementRequests,
};
