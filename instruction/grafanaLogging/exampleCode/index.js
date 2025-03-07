const express = require('express');
const app = express();
const logger = require('./logger');

app.use(express.json());
app.use(logger.httpLogger);

app.get('/hello/:name', (req, res) => {
  res.send({ hello: req.params.name });
});

app.post('/hello', (req, res) => {
  res.send({ hello: req.body.name });
});

app.get('/error', (req, res) => {
  throw new Error('Trouble in river city!');
});

app.use((req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.listen(3000, function () {
  console.log(`Listening on port 3000`);
});
