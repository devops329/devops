const express = require('express');
const app = express();

const metrics = require('./metrics');

app.use(express.json());

app.use((_, _res, next) => {
  metrics.incrementRequests();
  next();
});

// Every minute this will send the total requests and the requests per minute
metrics.sendRequestsMetrics();

app.get('/hello', (_, res) => {
  res.send('hello');
});

const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
