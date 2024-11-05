
import * as model from "./model.js";
import { Recipe } from "./view/recipeDisplay.js"; // Correct file path
import "core-js/stable";
import "regenerator-runtime/runtime.js";
import { SearchViews } from "./view/searchDisplay.js";
import { resultView } from "./view/resultView.js";
import { paginationView } from "./view/pagination.js";
import { bookMarkView } from "./view/bookMarkView.js";
import { addRecipe } from "./view/addRecipe.js";
import { MODAL_CLOSE_SEC } from "./config.js";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    Recipe.renderSpinner();

    // 0 update recipe mark selected
    resultView.update(model.getSearchResult());
    bookMarkView.update(model.state.bookMarks);
    // 1️⃣ loading recipe
    await model.loadRecipe(id);
    // 2. Rendering Recipe
    Recipe.render(model.state.recipe);
   
  } catch (err) {
    Recipe.renderError();
  }
};
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    //1 get Search query
    const query = SearchViews.getQuery();
    if (!query) return;
    // 2 load search result
    await model.loadSearch(query);
    // 3 render a result
    resultView.render(model.getSearchResult((page = 1)));
    //4 render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    Recipe.renderError();
  }
};

const controlPagination = function (page) {
  // 1 render new  result
  resultView.render(model.getSearchResult(page));

  //2 render initial pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // 1 update serving
  model.updateServing(newServing);
  // 2 update recipe view
  Recipe.update(model.state.recipe);
};

const controlBookMark = function () {
  // 1 add/delete bookmarks
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);
  // 2 update recipe view
  Recipe.update(model.state.recipe);

  // 3 render bookMarks
  bookMarkView.render(model.state.bookMarks);
};

const controlBookMarkLoad = function () {
  bookMarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.updateRecipe(newRecipe);

    // Render Spinner
     addRecipe.renderSpinner();

    // Render Recipe
    Recipe.render(model.state.recipe);

    // Success message
    addRecipe.renderMessage();

    // BookMark render 
    bookMarkView.render(model.state.bookMarks);

    // change ID in URL immediately after upload
    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // close the form
    setTimeout(function (MODAL_CLOSE_SEC) {
      addRecipe.toggleWindow();
    },MODAL_CLOSE_SEC * 1000);
  } catch (err) {
  
    addRecipe.renderError(err.message);
  }
};
const init = function () {
  bookMarkView.addHandlerBookMarks(controlBookMarkLoad);
  Recipe.andHandlerRender(controlRecipes);
  Recipe.addHandlerAddBookMark(controlBookMark);
  SearchViews.addHandlerSearch(controlSearchResult);
  Recipe.addHandlerUpdateServing(controlServing);
  paginationView.addHandlerClick(controlPagination);
  addRecipe.addHandlerUpdate(controlAddRecipe);
};
init();
