var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var employeesRouter = require('./routes/employees');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/employees', employeesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
