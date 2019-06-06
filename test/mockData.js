const recipeOK = {
  res: {
    statusCode: 200
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};

const recipeWithoutTitle = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithoutYields = {
  res: {
    statusCode: 404
  },
  body: {
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithoutUrlOrProcedure = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithoutCategory = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithoutIngredients = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithoutCalories = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithWrongCategory = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Esto no es una categoria"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWithourNutInfo = {
  res: {
    statusCode: 200
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: ["Baja en carbohidratos"],
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ]
  }
};
const recipeWrongDietCatFormat = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: "Baja en carbohidratos",
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWrongHealthCatFormat = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: "Baja en carbohidratos",
    healthLabels: "Libre de mariscos",
    ingredientLines: [
      "Sal",
      "Aceite",
      "2 huevos",
      "8 filetes de terneras finos"
    ],
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
const recipeWrongIngFormat = {
  res: {
    statusCode: 404
  },
  body: {
    yield: 60,
    calories: 27092.875,
    label: "Milanesa",
    url: "http://milanesa.recetascomidas.com/",
    dietLabels: "Baja en carbohidratos",
    healthLabels: ["Libre de mariscos", "Libre de Lacteos"],
    ingredientLines: "Sal",
    totalNutrients: [
      {
        label: "VITK1",
        quantity: "190.4406",
        unit: "µg"
      },
      {
        label: "ENERC_KCAL",
        quantity: "27092.875",
        unit: "kcal"
      }
    ]
  }
};
module.exports = {
  recipeOK,
  recipeWithWrongCategory,
  recipeWithourNutInfo,
  recipeWithoutCalories,
  recipeWithoutCategory,
  recipeWithoutIngredients,
  recipeWithoutTitle,
  recipeWithoutUrlOrProcedure,
  recipeWithoutYields,
  recipeWrongDietCatFormat,
  recipeWrongHealthCatFormat,
  recipeWrongIngFormat
};
