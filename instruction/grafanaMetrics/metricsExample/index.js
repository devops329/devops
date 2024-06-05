const express = require('express');
const app = express();

const metrics = require('./metrics');
let greeting = 'hello';

app.use(express.json());

app.get('/hello/:name', (req, res) => {
  metrics.incrementRequests('get');
  res.send({ [greeting]: req.params.name });
});

app.post('/greeting/:greeting', (req, res) => {
  greeting = req.params.greeting;
  metrics.incrementRequests('post');
  res.send({ msg: `greeting is now ${greeting}` });
});

app.delete('/greeting', (req, res) => {
  greeting = 'hello';
  metrics.incrementRequests('delete');
  res.send({ msg: `greeting is now ${greeting}` });
});

app.listen(3000, function () {
  console.log(`Listening on port 3000`);
});
