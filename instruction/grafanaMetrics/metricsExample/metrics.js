const config = require('./config.json');

const USER_ID = config.userId;
const API_KEY = config.apiKey;
const SOURCE = config.source;

class Metrics {
  constructor() {
    this.totalRequests = 0;

    // This will periodically sent metrics to Grafana
    setInterval(() => {
      this.sendMetricToGrafana(this.createMetricString('request', 'total', this.totalRequests));
    }, 10000);
  }

  incrementRequests() {
    this.totalRequests++;
  }

  createMetricString(metricPrefix, metricName, metric) {
    return `${metricPrefix},source=${SOURCE} ${metricName}=${metric}`;
  }

  sendMetricToGrafana(metric) {
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
