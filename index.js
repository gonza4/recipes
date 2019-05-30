#!/usr/bin/env node
'use strict'
const app = require('./app');
const port = process.env.PORT || 5000;

app.listen(port, function(){
	console.log("Servidor corriendo en http://localhost:" + port);
});