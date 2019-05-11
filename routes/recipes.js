'use strict'

var express = require('express');
var recipesController = require('../controllers/recipes');
var utilController = require('../util/fillDdbb');

var api = express.Router();

api.get('/recipes', recipesController.getRecipes);
api.get('/recipe/byId/:id', recipesController.getRecipeById);
api.get('/categories', recipesController.getCategories);
api.get('/recipe/search/:text', recipesController.getSearch);
api.post('/fill/ddbb', utilController.fillDdbb);

module.exports = api;