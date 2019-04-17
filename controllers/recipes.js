'use strict'

var edamam = require('../services/edamam');

function getRecipes(req, res) {
	var params = req.query;

	edamam.getRecipes(params, (err, body) => {
		if(err){
			res.status(409).send({error: err});
		} else{
			var body = JSON.parse(body);
			var recipes = body.hits;
			var data = [];

			if(undefined === recipes) {
				res.status(404).send({message: "No se encontraron recetas"});
			}else{
				for (var i = 0; i < recipes.length; i++) {
					data[i] = recipes[i].recipe;
				}

				res.status(200).send(data);
			}
		}
	});
}

module.exports = {
	getRecipes
};