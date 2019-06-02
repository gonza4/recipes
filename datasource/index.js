const neo4j = require("neo4j-driver").v1;
require("dotenv").config();

const driver = neo4j.driver(
  process.env.HOST_NAME,
  neo4j.auth.basic(process.env.USER, process.env.PASS)
);
const session = driver.session();

module.exports = session;
