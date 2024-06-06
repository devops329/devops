const express = require('express');

const app = express();
app.use(express.json());

const cities = [{ name: 'Provo', population: 116618 }];
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9';

app.post('/login', (req, res) => {
  res.json({ message: 'Success', authorization: authToken });
});

app.get('/cities', (req, res) => {
  res.json(cities);
});

app.post('/cities', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  if (token !== authToken) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    cities.push(req.body);
    res.json(cities);
  }
});

module.exports = app;
