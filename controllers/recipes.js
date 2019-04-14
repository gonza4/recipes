'use strict'

var edamam = require('../services/edamam');

function getRecipes(req, res) {
	var params = req.params;

	edamam.getRecipes(params, (err, body) => {
		if(err){
			console.log(err);
		} else{
			console.log(body);
		}
	});
}

module.exports = {
	getRecipes
};