'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var recipesRoutes = require('./routes/recipes');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

app.use('/api', recipesRoutes);

module.exports = app;