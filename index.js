var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var hello = require('./api/hello');
var grocery = require('./api/grocery');

if (process.env.NODE_ENV !== 'test') {
   app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/hello', hello);
app.use('/groceries', grocery);

module.exports = app;
