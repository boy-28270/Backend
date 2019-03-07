var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var users = require('./routes/users');
var pos = require('./routes/pos');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', users);
app.use('/api/pos', pos);


app.listen(3000, () => console.log('server run listening on port 3000'));
