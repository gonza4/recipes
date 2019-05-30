'use strict'

const express = require('express');
const recipesController = require('../controllers/recipes');
const utilController = require('../util/fillDdbb');

const api = express.Router();

api.get('/recipes', recipesController.getRecipes);
api.get('/recipe/byId/:id', recipesController.getRecipeById);
api.get('/categories', recipesController.getCategories);
api.get('/recipe/search/:text', recipesController.getSearch);
api.get('/recipe/verify-image', recipesController.verifyImage);
api.post('/recipe', recipesController.createRecipe);
api.post('/fill/ddbb', utilController.fillDdbb);

module.exports = api;