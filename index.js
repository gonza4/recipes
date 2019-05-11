#!/usr/bin/env node
'use strict'
var app = require('./app');
var port = process.env.PORT || 5000;

app.listen(port, function(){
	console.log("Servidor corriendo en http://localhost:" + port);
});