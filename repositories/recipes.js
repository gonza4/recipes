"use strict";

const session = require("../datasource/index");
const recipeController = require("../util/recipes");
const urlExists = require("url-exists-deep");
const path = require("path");
const createNodes = require("../util/fillDdbb");
const s3 = require("../util/s3");

async function getRecipes(params) {
  let relation = params.relation;
  let category = params.category;
  let value = params.value;
  let orderType = params.orderType;
  let order = params.order;
  let from = params.from;

  const finalResult = await session
    .run(
      `MATCH (re:Recipe)-[r:${relation}]->(dl:${category} {name:'${value}' })
			 RETURN DISTINCT re 
			 LIMIT 200`
    )
    .then(async result => {
      session.close();
      let total = [];
      let totalPages = Math.floor(result.records.length / 20);
      totalPages = totalPages < 1 ? 1 : totalPages;

      for (let index in result.records) {
        let recipeId = result.records[index]._fields[0].identity.low;

        let temp = await buildRecipeArray(recipeId);
        total.push({ ...temp[0], totalPages: totalPages });
      }
      return await recipeController.orderResults(total, orderType, order, from);
    })
    .catch(e => {
      throw e;
    });
  return finalResult;
}

async function buildRecipeArray(recipeId) {
  const finalResult = await session
    .run(
      `MATCH (re:Recipe)-[r]-(o)
			 WHERE id(re) = ${recipeId}
			 RETURN o, re`
    )
    .then(async result => {
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
      throw err;
    });
  return finalResult;
}

async function getCategories() {
  const finalResult = await session
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
      const firstResult = await session
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
          throw err;
        });
      return firstResult;
    })
    .catch(err => {
      throw err;
    });
  return finalResult;
}

async function getSearch(params, from) {
  let text = params.text;
  text = replace(text);
  text = validateAccent(text);
  let finalText = buildSearchText(text);

  const finalResult = await session
    .run(
      `CALL db.index.fulltext.queryNodes("indexLabelAndIng", '${finalText}~') 
       YIELD node, score 
       RETURN node 
       ORDER BY score DESC, node.date DESC
       LIMIT 200`
    )
    .then(async result => {
      session.close();
      let total = [];
      let totalPages = Math.floor(result.records.length / 20);
      totalPages = totalPages < 1 ? 1 : totalPages;

      for (let index in result.records) {
        let recipeId = result.records[index]._fields[0].identity.low;
        let temp = await buildRecipeArray(recipeId);
        total.push({ ...temp[0], totalPages: totalPages });
      }
      return await recipeController.orderResults(total, null, null, from);
    })
    .catch(err => {
      throw err;
    });
  return finalResult;
}

async function verifyImage() {
  await session
    .run(
      `MATCH (re:Recipe)
       where id(re) > 118401
       RETURN DISTINCT re 
       LIMIT 2`
    )
    .then(result => {
      session.close();

      result.records.map(async value => {
        let recipeId = value._fields[0].identity.low;
        let recipe = value._fields[0].properties;
        console.log(recipeId);
        // await session
        //   .run(
        //     `MATCH (re:Recipe)-[r]-(o)
        //     WHERE id(re) = ${recipeId}
        //     RETURN o, re`
        //   )
        //   .then(async result => {
        //     session.close();
        //     if (result.records.length === 0) {
        //       await session.run(`MATCH (re:Recipe)
        //       WHERE id(re) = ${recipeId}
        //       DETACH DELETE re`);
        //     }
        //   })
        //   .catch(e=>{
        //     console.log(e)
        //   });

        urlExists(recipe.image)
          .then(async response => {
            if (response) {
              console.log("entra 1");
            } else {
              console.log("entra 2");
              await session.run(
                `MATCH (re:Recipe)
                  WHERE id(re) = ${recipeId}
                  SET re.image = '${
                    process.env.AWS_S3_ROUTE
                  }imagen_no_disponible.jpeg'
                  RETURN re.image`
              );
            }
          })
          .catch(async err => {
            console.log("entra 3");
            await session.run(
              `MATCH (re:Recipe)
                WHERE id(re) = ${recipeId}
                SET re.image = '${
                  process.env.AWS_S3_ROUTE
                }imagen_no_disponible.jpeg'
                RETURN re.image`
            );
            console.log(err);
            // throw err;
          });
      });
    })
    .catch(e => {
      //   callback(e);
      console.log(e);
    });
}

function replace(text) {
  return text
    .replace(" de ", " ")
    .replace(" con ", " ")
    .replace(" la ", " ")
    .replace(" las ", " ")
    .replace(" en ", " ")
    .replace(" un ", " ")
    .replace(" una ", " ")
    .replace(" unos ", " ")
    .replace(" unas ", " ")
    .replace(" al ", " ")
    .replace(" el ", " ")
    .replace(" lo ", " ")
    .replace(" los ", " ")
    .replace(" a ", " ")
    .replace(" del ", " ");
}

function buildSearchText(text) {
  let arrayText = text.split(" ");
  return arrayText
    .map(element => {
      if ("" !== element) {
        return " " + element + "*";
      }
    })
    .join("")
    .trim();
}
async function createRecipe(req) {
  try {
    let image = req.file
      ? uploadImage(req.file)
      : process.env.AWS_S3_ROUTE + imagen_no_disponible.jpeg;
    let data = req.body;
    let label = data.label;
    let indexLabel = validateAccent(label) + " ";
    let source = "recipesclub";
    let yields = data.yield;
    let calories = data.calories;
    let url = undefined !== data.url ? data.url : "";
    let procedure = undefined !== data.procedure ? data.procedure : "";

    const finalResult = await session
      .run(
        `CREATE (r:Recipe {
        label: $label,
        indexLabel: $indexLabel,
        source: $source,
        yield: $yields,
        calories: $calories,
        image: $image,
        url: $url,
        procedure: $procedure,
        date: datetime()
      }) RETURN r`,
        {
          label,
          source,
          yields,
          calories,
          url,
          procedure,
          image,
          indexLabel
        }
      )
      .then(async result => {
        session.close();
        let singleRecord = result.records[0];
        let recipeId = singleRecord._fields[0].identity;

        if (data.dietLabels)
          await createNodes.createNodes(
            recipeId,
            data.dietLabels,
            "dl",
            "DietLabels",
            "r:DIET_LABELS"
          );
        if (data.healthLabels)
          await createNodes.createNodes(
            recipeId,
            data.healthLabels,
            "hl",
            "HealthLabels",
            "r:HEALTH_LABELS"
          );
        if (data.ingredientLines)
          await createNodes.createNodes(
            recipeId,
            data.ingredientLines,
            "il",
            "IngredientLines",
            "r:INGREDIENT_LINES"
          );
        if (data.totalNutrients)
          await createNodes.createAuxiliarNodes(
            recipeId,
            data.totalNutrients,
            "tn",
            "TotalNutrients",
            "r:TOTAL_NUTRIENTS"
          );

        return "La receta se cargo con exito";
      })
      .catch(err => {
        throw err;
      });
    return finalResult;
  } catch (error) {
    throw error;
  }
}

async function createIndex() {
  const finalResult = await session
    .run(
      `MATCH (r:Recipe)
       WHERE id(r) > 173403
       RETURN r
       LIMIT 2`
    )
    .then(result => {
      let recipeId;
      let name;
      result.records.map(async value => {
        recipeId = value._fields[0].identity.low;
        name = value._fields[0].properties.label;
        name = validateAccent(name);
        console.log(name);
        console.log(recipeId);
        await session.run(`MATCH (r:Recipe)
        WHERE id(r) = ${recipeId}
        SET r.indexLabel = '${name}'
        RETURN r.label, r.indexLabel`);
      });

      return "Ok";
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
  return finalResult;
}

function validateAccent(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("'", "");
}

function uploadImage(file) {
  try {
    if (file) {
      if (checkFileType(file)) {
        let filename =
          "RecipesClub" +
          "-" +
          Date.now() +
          path.extname(file.originalname).toLowerCase();
        s3.upload(file.path, filename);
        return process.env.AWS_S3_ROUTE + filename;
      }
    }
    throw "No se cargo ninguna foto";
  } catch (error) {
    throw error;
  }
}

function checkFileType(file) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  const size = file.size < 1000000;

  if (!size) {
    throw "El archivo debe pesar hasta 1 MB";
  }
  if (mimetype && extname) {
    return true;
  } else {
    throw "Error: Los formatos permitidos son: jpeg|jpg|png|gif";
  }
}

module.exports = {
  getRecipes,
  buildRecipeArray,
  getCategories,
  getSearch,
  verifyImage,
  createRecipe,
  createIndex
};
