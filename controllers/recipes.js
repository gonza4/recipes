'use strict'

var edamam = require('../services/edamam');

function getRecipes(req, res) {
	var params = req.query;

	edamam.getRecipes(params, (err, body) => {
		if(err){
			res.status(409).send({error: err});
		} else{
			body = JSON.parse(body);
			let recipes = body.hits;
			let data = [];
			let orderType = params.orderType;

			if(undefined === recipes) {
				res.status(404).send({message: "No se encontraron recetas"});
			}else{
				if(undefined !== orderType) {
					let order = params.order;
					
					for (var i = 0; i < recipes.length; i++) {
						data[i] = recipes[i].recipe;
					}

					orderResults(data, orderType, order, (err, result) => {
						if (err) {
							res.status(404).send({err: err});
						} else {
							res.status(200).send(result);
						}
					});	
				} else {
					for (var i = 0; i < recipes.length; i++) {
						data[i] = recipes[i].recipe;
					}

					res.status(200).send(data);
				}
			}
		}
	});
}

function orderResults(data, orderType, order, callback) {
	switch (orderType) {
		case 'ingredientes':
			if ('menor' === order) {
				data.sort(sort_by('ingredients', false, parseInt, true));
			} else {
				data.sort(sort_by('ingredients', true, parseInt, true));
			}
			
			callback(null, data);
			break;
		case 'porciones':
			if ('menor' === order) {
				data.sort(sort_by('yield', false, parseInt));
			} else {
				data.sort(sort_by('yield', true, parseInt));
			}
			
			callback(null, data);
			break;
		case 'calorias':
			if ('menor' === order) {
				data.sort(sort_by('calories', false, parseFloat));
			} else {
				data.sort(sort_by('calories', true, parseFloat));
			}
			
			callback(null, data);
			break;
		default:
			callback(null, data);
			break;
	}
}

function sort_by(field, reverse, primer, count){

	var key = primer ? 
		function(x) {return count ? primer(x[field].length) : primer(x[field])} : 
		function(x) {return x[field]};
	
	reverse = !reverse ? 1 : -1;
 
	return function (a, b) {
		if (count) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		} else {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	  } 
 }

function getRecipeById(req, res) {
	var params = req.query;

	edamam.getRecipeById(params, (err, body) => {
		if(err){
			res.status(409).send({error: err});
		} else{
			body = JSON.parse(body);
			let recipe = body;
			
			if(undefined === recipe) {
				res.status(404).send({message: "No se encontraron recetas"});
			}else{
				res.status(200).send(recipe[0]);
			}
		}
	});
}
module.exports = {
	getRecipes,
	getRecipeById
};