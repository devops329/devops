const config = require('./config.json');

class Metrics {
  constructor() {
    this.requests = {};

    // This will periodically sent metrics to Grafana
    const timer = setInterval(() => {
      Object.keys(this.requests).forEach((httpMethod) => {
        this.sendMetricToGrafana('request', httpMethod, 'total', this.requests[httpMethod]);
      });
      const totalRequests = Object.values(this.requests).reduce((acc, curr) => acc + curr, 0);
      this.sendMetricToGrafana('request', 'all', 'total', totalRequests);
    }, 10000);

    timer.unref();
  }

  incrementRequests(httpMethod) {
    this.requests[httpMethod] = (this.requests[httpMethod] || 0) + 1;
  }

  sendMetricToGrafana(metricPrefix, httpMethod, metricName, metricValue) {
    const metric = `${metricPrefix},source=${config.source},method=${httpMethod} ${metricName}=${metricValue}`;

    fetch(`${config.url}`, {
      method: 'post',
      body: metric,
      headers: { Authorization: `Bearer ${config.userId}:${config.apiKey}` },
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
