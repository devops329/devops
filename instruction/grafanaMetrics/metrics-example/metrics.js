const config = require('./config.json');

const USER_ID = config.userId;
const API_KEY = config.apiKey;
const SOURCE = 'example';

let totalRequests = 0;
let requestsPerMinute = 0;

function incrementRequests() {
  totalRequests++;
  requestsPerMinute++;
}

function createMetricString(label, metric) {
  return `counter,bar_label=${label},source=${SOURCE} metric=${metric}`;
}

function sendRequestsMetrics() {
  // Every minute this will send the requests per minute and the total requests to grafana
  setInterval(() => {
    const requests_per_minute_metric = createMetricString('requests_per_minute', requestsPerMinute);
    sendMetricToGrafana(requests_per_minute_metric);
    const total_requests_metric = createMetricString('total_requests', totalRequests);
    sendMetricToGrafana(total_requests_metric);
    requestsPerMinute = 0;
  }, 60000);
}

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
  sendRequestsMetrics,
  incrementRequests,
};
