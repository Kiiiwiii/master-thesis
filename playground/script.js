const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: __dirname + '/./public',
  })
});
app.get('/obj', (req, res) => {
  res.sendFile('example.obj', {
    root: __dirname + '/./data',
  });
});
app.get('/mtl', (req, res) => {
  res.sendFile('example.mtl', {
    root: __dirname + '/./data',
  });
});
app.use('/static', express.static('public'));

app.listen(3000);