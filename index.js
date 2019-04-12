'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/recipes', { useNewUrlParser: true }, (err, res) => {
	if (err){
		throw err;
	} else {
		console.log("Base corriendo");

		app.listen(port, function(){
			console.log("Servidor corriendo en http://localhost:" + port);
		});
	}
});