require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/api', function (req, res) {
    res.send('API Endpoint');
});


app.listen(3000, () => console.log('Server ready on http://localhost:3000'));

module.exports = app;
