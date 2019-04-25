'use strict'

var request = require('request');

exports.getRecipes = function(params, callback) {
	if (undefined === params.q) {
		return callback("Falta el parametro q");
	}

	var from;
	var to;

	if (undefined === params.from) {
		from = 0;
	} else {
		from = parseInt(params.from) + (20 * parseInt(params.from));
		to = from + 20;
	}

	const paramsObject = 
		{ 
			app_id: "f5cd31de", 
			app_key: "5af0d717e2f9c1cf26cb93b4c2452375", 
			q: params.q,
			from: from,
			to: from + 20
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
	// var arraySplit = [];
	// arraySplit = params.r.split("#");

	// let prefixUri = 'http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23';
	// let postfixUri = arraySplit[1];
	// var r = prefixUri . postfixUri;

	const paramsObject = 
		{ 
			app_id: "f5cd31de", 
			app_key: "5af0d717e2f9c1cf26cb93b4c2452375", 
			r: params.r
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
