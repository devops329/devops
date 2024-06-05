const config = require('./config.json');

const USER_ID = config.userId;
const API_KEY = config.apiKey;
const SOURCE = config.source;

class Metrics {
  constructor() {
    this.requests = {};

    // This will periodically sent metrics to Grafana
    setInterval(() => {
      Object.keys(this.requests).forEach((httpMethod) => {
        this.sendMetricToGrafana('request', httpMethod, 'total', this.requests[httpMethod]);
      });
      const totalRequests = Object.values(this.requests).reduce((acc, curr) => acc + curr, 0);
      this.sendMetricToGrafana('request', 'all', 'total', totalRequests);
    }, 10000);
  }

  incrementRequests(httpMethod) {
    this.requests[httpMethod] = (this.requests[httpMethod] || 0) + 1;
  }

  sendMetricToGrafana(metricPrefix, httpMethod, metricName, metricValue) {
    const metric = `${metricPrefix},source=${SOURCE},method=${httpMethod} ${metricName}=${metricValue}`;

    fetch(`https://${config.host}/api/v1/push/influx/write`, {
      method: 'post',
      body: metric,
      headers: { Authorization: `Bearer ${USER_ID}:${API_KEY}` },
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to push metrics data to Grafana');
        } else {
          console.log(`Pushed ${metric}`);
        }
      })
      .catch((error) => {
        console.error('Error pushing metrics:', error);
      });
  }
}

const metrics = new Metrics();
module.exports = metrics;
