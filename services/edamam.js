'use strict'

var request = require('request');

exports.getRecipes = function(params, callback) {
	if (undefined === params.q) {
		return callback("Falta el parametro q");
	}

	const paramsObject = 
		{ 
			app_id: "f5cd31de", 
			app_key: "5af0d717e2f9c1cf26cb93b4c2452375", 
			q: params.q,
			to: 100
	};
	
	request.get({
			url: 'https://test-es.edamam.com/search',
			qs: paramsObject,
		},
		(error, response) => {
			if (error) {
				return callback(error);
			}
			let body = response.body;
			
			if('[' === body){
				callback("Parametros incorrectos");
			} else{
				callback(null, body);
			}
	});
};

exports.getRecipeById = function(params, callback) {
	if (undefined === params.r) {
		return callback("Falta el parametro r");
	}

	const paramsObject = 
		{ 
			app_id: "f5cd31de", 
			app_key: "5af0d717e2f9c1cf26cb93b4c2452375", 
			r: params.r,
			to: 100
	};
	
	request.get({
			url: 'https://test-es.edamam.com/search',
			qs: paramsObject,
		},
		(error, response) => {
			if (error) {
				return callback(error);
			}
			let body = response.body;
			
			if('[' === body){
				callback("Parametros incorrectos");
			} else{
				callback(null, body);
			}
	});
};
