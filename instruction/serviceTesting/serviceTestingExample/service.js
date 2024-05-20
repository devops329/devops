const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const cities = [{ name: 'Provo', population: 116618 }];
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp9';

app.post('/login', (req, res) => {
  res.cookie('token', authToken, { secure: true, httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Success' });
});

app.get('/cities', (req, res) => {
  res.json(cities);
});

app.post('/cities', (req, res) => {
  const token = req.cookies.token;
  if (token !== authToken) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    cities.push(req.body);
    res.json(cities);
  }
});

module.exports = app;
