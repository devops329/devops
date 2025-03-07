const express = require('express');
const app = express();

const metrics = require('./metrics');
let greeting = 'hello';

app.use(express.json());

app.get('/hello/:name', metrics.track('getGreeting'), (req, res) => {
  res.send({ [greeting]: req.params.name });
});

app.post('/greeting/:greeting', metrics.track('createGreeting'), (req, res) => {
  greeting = req.params.greeting;
  res.send({ msg: `greeting is now ${greeting}` });
});

app.delete('/greeting', metrics.track('deleteGreeting'), (req, res) => {
  greeting = 'hello';
  res.send({ msg: `greeting is now ${greeting}` });
});

app.listen(3000, function () {
  console.log(`Listening on port 3000`);
});
