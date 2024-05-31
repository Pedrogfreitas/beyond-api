const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
})

app.post('/content', function (req, res) {
    res.send('Hello World!');
})

app.get('/contents', function (req, res) {
    res.send('Hello World!');
})

app.listen(8080, function () {
    console.log('Iniciado na porta 3000');
})