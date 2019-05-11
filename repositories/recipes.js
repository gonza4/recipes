'use strict'

var session = require("../datasource/index");
var recipeController = require("../util/recipes");

async function getRecipes(params, callback) {
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
		.then(function (result) {
			session.close();
			let total = [];

			for (let key in result.records) {
				let recipeId = result.records[key]._fields[0].identity.low;

				buildRecipeArray(recipeId, (err, recipe) => {
					if (err) {
						callback(err);
					} else {
						total.push(recipe[0]);

					}
				});
			}

			setTimeout(() => {
				recipeController.orderResults(total, orderType, order, from, (err, result) => {
					if (err) {
						callback({ err: err });
					} else {
						callback(null, result);
					}
				});
			}, 200)
		})
		.catch(function (e) {
			callback(e);
		});
}

async function buildRecipeArray(recipeId, callback) {
	await session
		.run(
			`MATCH (re:Recipe)-[r]-(o)
			 WHERE id(re) = ${recipeId}
			 RETURN o, re`,
		)
		.then(function (result) {
			session.close();
			let dietLabels = [];
			let healthLabels = [];
			let ingredientLines = [];
			let totalNutrientsFirst = [];
			let total = [];
			let recipe = result.records[0]._fields[1].properties;

			for (let key in result.records) {
				let label = result.records[key]._fields[0].labels;
				let properties = result.records[key]._fields[0].properties;

				switch (label.join()) {
					case 'DietLabels':
						dietLabels.push(properties.name);
						break;
					case 'HealthLabels':
						healthLabels.push(properties.name);
						break;
					case 'IngredientLines':
						ingredientLines.push(properties.name);
						break;
					case 'TotalNutrients':
						totalNutrientsFirst.push({
							label: properties.name,
							quantity: properties.quantity,
							unit: properties.unit
						});
						break;
				}
			}
			total.push({
				id: recipeId,
				...recipe,
				dietLabels: dietLabels,
				healthLabels: healthLabels,
				ingredientLines: ingredientLines,
				totalNutrients: totalNutrientsFirst
			})

			callback(null, total);
		})
		.catch(function (err) {
			callback(err);
		});
}

async function getCategories(callback) {
	await session
		.run(
			`MATCH ()-[r:DIET_LABELS]->(o:DietLabels)
			 RETURN DISTINCT type(r), o.name`
		)
		.then(function (result) {
			session.close();
			let totalDiet = [];
			let values = [];
			let relation = result.records[0]._fields[0];

			for (const key in result.records) {
				values.push(
						result.records[key]._fields[1]
				);
			}

			totalDiet.push(
				{
					'DietLabels':
						{
							'relation': relation,
							'values': values
						}
				}
			);
			session
				.run(
					`MATCH ()-[r:HEALTH_LABELS]->(o:HealthLabels)
					RETURN DISTINCT type(r), o.name`
				)
				.then(function(result) {
					session.close();
					let totalHealth = [];
					let values = [];
					let relation = result.records[0]._fields[0];

					for (const key in result.records) {
						values.push(
							result.records[key]._fields[1],
						);
					}

					totalHealth.push(
						{
							'HealthLabels':
								{
									'relation': relation,
									'values': values
								}
						}
					);
					totalDiet.push(...totalHealth)

					callback(null, totalDiet);
				})
				.catch(function(e) {
					callback(e);
				});
		})
		.catch(function (e) {
			callback(e);
		});
}

module.exports = {
	getRecipes,
	buildRecipeArray,
	getCategories
}