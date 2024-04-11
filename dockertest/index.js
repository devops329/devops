const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/menu', (req, res) => {
  const storeNames = {
    menu: [{ name: 'Pep' }, { name: 'Cheese' }, { name: 'Veggies' }, { name: 'Meat' }, { name: 'Supreme' }],
  };

  res.json(storeNames);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
