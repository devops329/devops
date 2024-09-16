const express = require('express');

const app = express();
const port = 3000;

app.get('/api/joke', (req, res) => {
  if (app.mode === 'test') {
    return res.json({ joke: 'Chuck Norris can divide by zero.' });
  }
  res.json(jokeServer.getJoke());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
