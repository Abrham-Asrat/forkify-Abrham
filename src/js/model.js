// import { search } from "core-js/fn/symbol";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJX } from "./helper.js";
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookMarks: [],
};
const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    Serving: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipe(data);
    if (state.bookMarks.some((bookMark) => bookMark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    const data = await AJX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResult = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServing = function (newServing = 8) {
  state.recipe.ingredients.forEach((ing) => {
    // formula :  newQuantity = oldQuantity * newServing /oldServing
    ing.quantity = (ing.quantity * newServing) / state.recipe.Serving;
  });
  state.recipe.Serving = newServing;
};

const persistBookMarks = function () {
  localStorage.setItem("BookMarks", JSON.stringify(state.bookMarks));
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;

  persistBookMarks();
};
export const removeBookMark = function (id) {
  // delete bookMark
  const index = state.bookMarks.findIndex((bookMark) => bookMark.id === id);
  state.bookMarks.splice(index, 1);
  // remove markup
  if (id === state.recipe.id) state.recipe.bookMarked = false;

  persistBookMarks();
};
const init = function () {
  const storage = localStorage.getItem("BookMarks");
  if (storage) {
    state.bookMarks = JSON.parse(storage);
  }
};
init();

export const updateRecipe = async function (newRecipe) {
  // update recipe in the model
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const newArr = ing[1].replaceAll(" ", "").split(",");
        const [quantity, unit, description] = newArr;
        if (newArr.length !== 3)
          throw Error(
            "Wrong ingredient format! Please use the correct format):"
          );
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookMark(state.recipe);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
