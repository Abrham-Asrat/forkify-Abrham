import icons from "url:../../img/icons.svg"; // parcel 2

export default class View {
  _data;
  render(data) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElement = Array.from(newDom.querySelectorAll("*"));
    const curElement = Array.from(this._parentElement.querySelectorAll("*"));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];

      // 1 update the text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // 2 update the attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((atr) => {
          curEl.setAttribute(atr.name, atr.value);
        });
      }
    });
  }
  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._messageError) {
    const markupError = `
    <div class="error">
            <div>
              <svg>          
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markupError);
  }
  renderMessage(_message = this._message) {
    const markupError = `
    <div class="error">
            <div>
              <svg>          
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${_message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markupError);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
