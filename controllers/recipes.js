"use strict";

var recipeRepo = require("../repositories/recipes");

async function getRecipes(req, res) {
  let params = req.query;
  await recipeRepo
    .getRecipes(params)
    .then(recipes => {
      if (undefined === recipes)
        res.status(404).send({ message: "No se encontro la receta" });
      res.status(200).send(recipes);
    })
    .catch(err => {
      res.status(404).send({ err: err });
    });
}

async function getRecipeById(req, res) {
  var recipeId = req.params.id;

  await recipeRepo
    .buildRecipeArray(recipeId)
    .then(recipe => {
      if (undefined === recipe)
        res.status(404).send({ message: "No se encontro la receta" });
      res.status(200).send(recipe);
    })
    .catch(err => {
      res.status(404).send({ err: err });
    });
}

async function getCategories(req, res) {
  await recipeRepo
    .getCategories()
    .then(recipe => {
      res.status(200).send(recipe);
    })
    .catch(err => {
      res.status(404).send({ err: err });
    });
}

async function getSearch(req, res) {
  let params = req.params;
  let from = req.query.from;

  await recipeRepo
    .getSearch(params, from)
    .then(recipes => {
      if (undefined === recipes)
        res.status(404).send({ message: "No se encontraron recetas" });
      res.status(200).send(recipes);
    })
    .catch(err => {
      res.status(404).send({ err: err });
    });
}

async function verifyImage(req, res) {
  await recipeRepo.verifyImage();
}

async function createRecipe(req, res) {
  await recipeRepo
    .createRecipe(req)
    .then(recipes => {
      if (undefined === recipes)
        res
          .status(404)
          .send({ message: "Hubo un problema al cargar la receta", err: err });
      res.status(200).send(recipes);
    })
    .catch(err => {
      res.status(404).send({ err: err });
    });
}

module.exports = {
  getRecipes,
  getRecipeById,
  getCategories,
  getSearch,
  verifyImage,
  createRecipe
};
