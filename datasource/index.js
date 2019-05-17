var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
var session = driver.session();

module.exports = session;