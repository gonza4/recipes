'use strict'

var express = require('express');
var recipesController = require('../controllers/recipes');

var api = express.Router();

api.post('/recipes', recipesController.getRecipes);

module.exports = api;