import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".btn--inline ");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const NumPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 and there is other pages
    if (currentPage === 1 && NumPage > 1) {
      return `
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    // last page
    if (currentPage === NumPage && NumPage > 1) {
      return `
          <button class="btn--inline pagination__btn--prev" data-goto = "${
            currentPage - 1
          }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
       
       `;
    }

    // other page like on the middle
    if (currentPage > 1 && NumPage > currentPage) {
      return `
         <button class="btn--inline pagination__btn--prev" data-goto = "${
           currentPage - 1
         }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
       
       `;
    }

    return "";
  }
}

export const paginationView = new PaginationView();
