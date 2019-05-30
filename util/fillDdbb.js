"use strict";

const edamam = require("../services/edamam");
const session = require("../datasource/index");

async function fillDdbb(req, res) {
  const params = req.query;

  await edamam
    .getRecipes(params, (err, rec) => {
      if (err) res.status(409).send({ error: err });
      else {
        try {
          let body = JSON.parse(rec);
          let recipes = body.hits;

          if (undefined === recipes) {
            res.status(404).send({ message: "No se encontraron recetas" });
          } else {
            recipes.map(async recipe => {
              await fillData(recipe.recipe);
            });
            res.status(200).send("OK");
          }
        } catch (error) {
          throw new Error(error);
        }
      }
    })
    .then(() => {})
    .catch(err => {
      res.status(409).send({ error: err });
    });
}

async function fillData(data) {
  await createRecipe(data);
}

async function createRecipe(data) {
  let uri = data.uri;
  let label = data.label;
  let image = data.image;
  let source = data.source;
  let url = data.url;
  let shareAs = data.shareAs;
  let yields = data.yield;
  let calories = data.calories;
  let totalWeight = data.totalWeight;
  let recipeId;
  await session
    .run(
      `MERGE (recipe:Recipe 
			{
				uri: $uri
			})
		ON CREATE SET  
			recipe.label = $label,
			recipe.image = $image,
			recipe.source = $source,
			recipe.url = $url,
			recipe.shareAs = $shareAs,
			recipe.yield = $yields,
			recipe.calories = $calories,
			recipe.totalWeight = $totalWeight,
			recipe.date = datetime()
		RETURN recipe`,
      {
        uri,
        label,
        image,
        source,
        url,
        shareAs,
        yields,
        calories,
        totalWeight
      }
    )
    .then(result => {
      session.close();
      let singleRecord = result.records[0];
      recipeId = singleRecord._fields[0].identity;
    })
    .catch(err => {
      console.log(err);
    });

  if (undefined !== recipeId) {
    await createNodes(
      recipeId,
      data.dietLabels,
      "dl",
      "DietLabels",
      "r:DIET_LABELS"
    );
    await createNodes(
      recipeId,
      data.healthLabels,
      "hl",
      "HealthLabels",
      "r:HEALTH_LABELS"
    );
    await createNodes(
      recipeId,
      data.ingredientLines,
      "il",
      "IngredientLines",
      "r:INGREDIENT_LINES"
    );
    await createAuxiliarNodes(
      recipeId,
      data.totalNutrients,
      "tn",
      "TotalNutrients",
      "r:TOTAL_NUTRIENTS"
    );
  }
}

async function createNodes(recipeId, data, nodeFirst, nodeSecond, relation) {
  data.map(async result => {
    let name = result.replace("'", "");
    console.log(name);
    await session
      .run(
        `MATCH (recipe:Recipe)
          WHERE id(recipe)= ${recipeId}
          MERGE (${nodeFirst}:${nodeSecond} { name: '${name}' })
          CREATE UNIQUE (recipe)-[${relation}]->(${nodeFirst})
          RETURN type(r)`
      )
      .then(() => {
        session.close();
      })
      .catch(err => {
        console.log(err);
      });
  });
}

async function createAuxiliarNodes(
  recipeId,
  data,
  nodeFirst,
  nodeSecond,
  relation
) {
  for (let key in data) {
    await session
      .run(
        `MATCH (recipe:Recipe)
				WHERE id(recipe)= ${recipeId}
				MERGE (${nodeFirst}:${nodeSecond} { name: '${key}',
													quantity: '${data[key].quantity}',
													unit: '${data[key].unit}'
												  })
				CREATE UNIQUE (recipe)-[${relation}]->(${nodeFirst})
				RETURN type(r)`
      )
      .then(() => {
        session.close();
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = {
  fillDdbb,
  createNodes,
  createAuxiliarNodes
};
