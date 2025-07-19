require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;   
