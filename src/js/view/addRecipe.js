import View from "./view.js";
class AddRecipe extends View {
  _parentElement = document.querySelector(".upload");
  _message = `Recipe was Successfully. Uploaded:)`;
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShow();
    this.addHandlerClose();
  }

  addHandlerUpdate(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }
  _addHandlerShow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }
  addHandlerClose() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }
}

export const addRecipe = new AddRecipe();
