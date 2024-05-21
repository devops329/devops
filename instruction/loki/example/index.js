const express = require('express');
const app = express();

const logger = require('./logger');

app.use(express.json());

app.use((req, _, next) => {
  logger.info(
    {
      timestamp: new Date().toISOString(),
      message: 'Request received',
      method: req.method,
      path: req.path,
    },
    { app: 'example' }
  );
  next();
});

app.get('/hello', (_, res) => {
  res.send('hello');
});

const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
