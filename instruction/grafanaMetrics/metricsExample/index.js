const express = require('express');
const app = express();

const metrics = require('./metrics');

app.use(express.json());

app.use((_, _res, next) => {
  metrics.incrementRequests();
  next();
});

app.get('/hello/:name', (req, res) => {
  res.send({ hello: req.params.name });
});

app.post('/hello/:greeting', (req, res) => {
  res.send({ hello: req.params.name });
});

app.delete('/hello', (req, res) => {
  res.send({ hello: req.params.name });
});

const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
