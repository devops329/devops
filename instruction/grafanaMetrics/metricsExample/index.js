const express = require('express');
const app = express();

const metrics = require('./metrics');

app.use(express.json());

app.use((_, _res, next) => {
  metrics.incrementRequests();
  next();
});

app.get('/hello', (_, res) => {
  res.send('hello');
});

const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);

  setInterval(() => {
    metrics.incrementRequests();
  }, 100);
});
