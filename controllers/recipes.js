"use strict";

var recipeRepo = require("../repositories/recipes");

async function getRecipes(req, res) {
  let params = req.query;

  await recipeRepo.getRecipes(params, (err, recipes) => {
    if (err) {
      res.status(409).send({ error: err });
      return;
    } else {
      if (undefined === recipes) {
        res.status(404).send({ message: "No se encontraron recetas" });
      } else {
        res.status(200).send(recipes);
      }
    }
  });
}

async function getRecipeById(req, res) {
  var recipeId = req.params.id;

  await recipeRepo.buildRecipeArray(recipeId, (err, recipe) => {
    if (err) {
      res.status(409).send({ error: err });
    } else {
      if (undefined === recipe) {
        res.status(404).send({ message: "No se encontro la receta" });
      } else {
        res.status(200).send(recipe);
      }
    }
  });
}

async function getCategories(req, res) {
  await recipeRepo.getCategories((err, categories) => {
    if (err) {
      res.status(409).send({ error: err });
    } else {
      if (undefined === categories) {
        res.status(404).send({ message: err });
      } else {
        res.status(200).send(categories);
      }
    }
  });
}

async function getSearch(req, res) {
  let params = req.params;
  await recipeRepo.getSearch(params, (err, recipes) => {
    if (err) {
      res.status(409).send({ error: err });
      return;
    } else {
      if (undefined === recipes) {
        res.status(404).send({ message: err });
      } else {
        res.status(200).send(recipes);
      }
    }
  });
}

async function verifyImage(req, res) {
  await recipeRepo.verifyImage();
}

module.exports = {
  getRecipes,
  getRecipeById,
  getCategories,
  getSearch,
  verifyImage
};
