'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const recipesRoutes = require('./routes/recipes');

app.use(cors());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

app.use('/api', recipesRoutes);

module.exports = app;