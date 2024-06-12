const config = require('./config.js');

accumulator = 0;
count = 0;

setInterval(() => {
  const instantValue = Math.floor(Math.random() * 100) + 1;
  sendMetricToGrafana('demo', 'instant', instantValue);

  count++;
  accumulator += Math.floor(Math.random() * 200) + 1;
  sendMetricToGrafana('demo', 'accumulator_total', accumulator);
  sendMetricToGrafana('demo', 'accumulator_count', count);
}, 1000);

function nowString() {
  return (Math.floor(Date.now()) * 1000000).toString();
}

function sendMetricToGrafana(metricPrefix, metricName, metricValue) {
  const metric = `${metricPrefix},source=${config.metrics.source} ${metricName}=${metricValue} ${nowString()}`;
  console.log(metric);

  fetch(`${config.metrics.url}`, {
    method: 'post',
    body: metric,
    headers: { Authorization: `Bearer ${config.metrics.userId}:${config.metrics.apiKey}` },
  }).catch((error) => {
    console.error('Error pushing metrics:', error);
  });
}
