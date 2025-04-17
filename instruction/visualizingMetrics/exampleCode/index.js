const express = require('express');
const app = express();
const metrics = require('./metrics');

let greeting = 'hello';

app.get('/greet/:name', metrics.requestTracker, (req, res) => {
  res.send({ [greeting]: req.params.name });
});

app.put('/greeting/:greeting', metrics.requestTracker, (req, res) => {
  metrics.greetingChanged();

  greeting = req.params.greeting;
  res.send({ msg: `greeting is now ${greeting}` });
});

app.delete('/greeting', metrics.requestTracker, (req, res) => {
  greeting = 'hello';
  res.send({ msg: `greeting is now ${greeting}` });
});

app.listen(3000, function () {
  console.log(`Listening on port 3000`);
});
