"use strict";

const request = require("request");

async function getRecipes(params, callback) {
  if (undefined === params.q) {
    throw new Error("Falta el parametro q");
  }

  const paramsObject = {
    app_id: "f5cd31de",
    app_key: "5af0d717e2f9c1cf26cb93b4c2452375",
    q: params.q,
    to: 200
  };

  request.get(
    {
      url: "https://test-es.edamam.com/search",
      qs: paramsObject
    },
    (error, response) => {
      if (error) {
        callback(error);
      }
      let body = response.body;

      if ("[" === body) {
        callback("Parametros incorrectos");
      } else {
        callback(null, body);
      }
    }
  );
}

async function getRecipeById(params) {
  if (undefined === params.r) {
    throw new Error("Falta el parametro r");
  }

  const paramsObject = {
    app_id: "f5cd31de",
    app_key: "5af0d717e2f9c1cf26cb93b4c2452375",
    r: params.r,
    to: 100
  };

  request.get(
    {
      url: "https://test-es.edamam.com/search",
      qs: paramsObject
    },
    (error, response) => {
      if (error) {
        throw new Error(error);
      }
      let body = response.body;

      if ("[" === body) {
        throw new Error("Parametros incorrectos");
      } else {
        return body;
      }
    }
  );
}

module.exports = {
  getRecipes,
  getRecipeById
};
