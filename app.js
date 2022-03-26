var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var db = require('./db/db');
var overlaps = require('./model/employeesOverlaps');

var employeesRouter = require('./routes/employees');

db.connect()
db.createTables()

overlaps.loadFromDB()

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/employees', employeesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
