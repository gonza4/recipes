"use strict";

var session = require("../datasource/index");
var recipeController = require("../util/recipes");
var urlExists = require("url-exists-deep");

async function getRecipes(params) {
  let relation = params.relation;
  let category = params.category;
  let value = params.value;
  let orderType = params.orderType;
  let order = params.order;
  let from = params.from;

  await session
    .run(
      `MATCH (re:Recipe)-[r:${relation}]->(dl:${category} {name:'${value}' })
			 RETURN DISTINCT re 
			 LIMIT 300`
    )
    .then(async result => {
      session.close();
      let total = [];
      let totalPages = Math.floor(result.records.length / 20);
      totalPages = totalPages < 1 ? 1 : totalPages;

      result.records.map(async value => {
        let recipeId = value._fields[0].identity.low;

        await buildRecipeArray(recipeId)
          .then(value => {
            total.push({ ...value, totalPages: totalPages });
          })
          .catch(err => {
            throw new Error(err);
          });
      });
      await recipeController
        .orderResults(total, orderType, order, from)
        .then(value => {
          return value;
        })
        .catch(err => {
          throw new Error(err);
        });
    })
    .catch(e => {
      throw new Error(e);
    });
}

async function buildRecipeArray(recipeId) {
  await session
    .run(
      `MATCH (re:Recipe)-[r]-(o)
			 WHERE id(re) = ${recipeId}
			 RETURN o, re`
    )
    .then(result => {
      session.close();
      let dietLabels = [];
      let healthLabels = [];
      let ingredientLines = [];
      let totalNutrientsFirst = [];
      let total = [];
      let recipe = result.records[0]._fields[1].properties;

      result.records.map(value => {
        let label = value._fields[0].labels;
        let properties = value._fields[0].properties;

        switch (label.join()) {
          case "DietLabels":
            dietLabels.push(properties.name);
            break;
          case "HealthLabels":
            healthLabels.push(properties.name);
            break;
          case "IngredientLines":
            ingredientLines.push(properties.name);
            break;
          case "TotalNutrients":
            totalNutrientsFirst.push({
              label: properties.name,
              quantity: properties.quantity,
              unit: properties.unit
            });
            break;
        }
      });

      total.push({
        id: recipeId,
        ...recipe,
        dietLabels: dietLabels,
        healthLabels: healthLabels,
        ingredientLines: ingredientLines,
        totalNutrients: totalNutrientsFirst
      });
      return total;
    })
    .catch(err => {
      throw new Error(err);
    });
}

async function getCategories() {
  await session
    .run(
      `MATCH ()-[r:DIET_LABELS]->(o:DietLabels)
			 RETURN DISTINCT type(r), o.name`
    )
    .then(async result => {
      session.close();
      let totalDiet = [];
      let values = [];
      let relation = result.records[0]._fields[0];

      result.records.map(value => {
        values.push(value._fields[1]);
      });

      totalDiet.push({
        DietLabels: {
          relation: relation,
          values: values
        }
      });
      await session
        .run(
          `MATCH ()-[r:HEALTH_LABELS]->(o:HealthLabels)
					RETURN DISTINCT type(r), o.name`
        )
        .then(async result => {
          session.close();
          let totalHealth = [];
          let values = [];
          let relation = result.records[0]._fields[0];

          result.records.map(value => {
            values.push(value._fields[1]);
          });

          totalHealth.push({
            HealthLabels: {
              relation: relation,
              values: values
            }
          });
          totalDiet.push(...totalHealth);

          return totalDiet;
        })
        .catch(err => {
          throw new Error(err);
        });
    })
    .catch(err => {
      throw new Error(err);
    });
}

async function getSearch(params, from) {
  let text = params.text;
  text = replace(text);

  let finalText = buildSearchText(text);
  await session
    .run(
      `CALL db.index.fulltext.queryNodes("labelAndName", "${finalText}~2") 
			 YIELD node, score 
       RETURN node, score
       LIMIT 10`
    )
    .then(async result => {
      session.close();
      let total = [];
      let totalPages = Math.floor(result.records.length / 20);
      totalPages = totalPages < 1 ? 1 : totalPages;

      result.records.map(async recipe => {
        let recipeId = recipe._fields[0].identity.low;
        await buildRecipeArray(recipeId)
          .then(value => {
            total.push({ ...value, totalPages: totalPages });
          })
          .catch(err => {
            throw new Error(err);
          });
      });

      await recipeController
        .orderResults(total, null, null, from)
        .then(result => {
          return result;
        })
        .catch(err => {
          throw new Error(err);
        });
    })
    .catch(err => {
      throw new Error(err);
    });
}

async function verifyImage() {
  await session
    .run(
      `MATCH (re:Recipe)
    RETURN DISTINCT re 
    order by id(re) DESC
    LIMIT 4500`
    )
    .then(result => {
      session.close();

      result.records.map(async value => {
        let recipeId = value._fields[0].identity.low;
        let recipe = value._fields[0].properties;

        urlExists(recipe.image)
          .then(async response => {
            if (response) {
              console.log("entra 1");
            } else {
              console.log("entra 2");
              await session.run(
                `MATCH (re:Recipe)
                  WHERE id(re) = ${recipeId}
                  SET re.image = 'http://recipes-club.s3-website.us-east-2.amazonaws.com/img/imagen_no_disponible.jpeg'
                  RETURN re.image`
              );
              // http://recipes-club.s3-website.us-east-2.amazonaws.com/img/imagen_no_disponible.jpeg
            }
          })
          .catch(async err => {
            console.log("entra 3");
            await session.run(
              `MATCH (re:Recipe)
                WHERE id(re) = ${recipeId}
                SET re.image = 'http://recipes-club.s3-website.us-east-2.amazonaws.com/img/imagen_no_disponible.jpeg'
                RETURN re.image`
            );
            console.log(err);
            throw new Error(err);
          });
      });
    })
    .catch(function(e) {
      //   callback(e);
      console.log(e);
    });
}

function replace(text) {
  return text
    .replace(" de ", "")
    .replace(" con ", "")
    .replace(" la ", "")
    .replace(" las ", "")
    .replace(" en ", "")
    .replace(" un ", "")
    .replace(" una ", "")
    .replace(" unos ", "")
    .replace(" unas ", "")
    .replace(" al ", "")
    .replace(" el ", "")
    .replace(" lo ", "")
    .replace(" los ", "")
    .replace(" a ", "")
    .replace(" del ", "");
}

function buildSearchText(text) {
  let arrayText = text.split(" ");
  return arrayText
    .map(element => {
      if ("" !== element) {
        return (finalText += " " + element + "*");
      }
    })
    .trim();
}

module.exports = {
  getRecipes,
  buildRecipeArray,
  getCategories,
  getSearch,
  verifyImage
};
