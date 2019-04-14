'use strict'

var request = require('request');

exports.getRecipes = function(params, callback) {
	// if (undefined = params.q) {
	// 	return "Falta el parametro q"
	// }

	const paramsObject = { app_id: "f5cd31de", app_key: "5af0d717e2f9c1cf26cb93b4c2452375", q: "carne" };
	
	request.get({
			url: 'https://test-es.edamam.com/search',
			qs: paramsObject,
		},
		(error, response) => {
		
		if (error) {
			return callback(error);
		}

		callback(null, response.body);
	});
};
