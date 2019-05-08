'use strict'

var recipeRepo = require('../repositories/recipes');

async function getRecipes(req, res) {
	let params = req.query;
	
	await recipeRepo.getRecipes(params, (err, recipes) => {
		if(err){
			res.status(409).send({error: err});
		} else{
			if(undefined === recipes) {
				res.status(404).send({message: "No se encontraron recetas"});
			}else{
				res.status(200).send(recipes);
			}
		}
	});
}

async function getRecipeById(req, res) {
	var recipeId = req.params.id;

	await recipeRepo.buildRecipeArray(recipeId, (err, recipe) => {
		if(err){
			res.status(409).send({error: err});
		} else{
			if(undefined === recipe) {
				res.status(404).send({message: "No se encontro la receta"});
			}else{
				res.status(200).send(recipe);
			}
		}
	});
}

module.exports = {
	getRecipes,
	getRecipeById
};