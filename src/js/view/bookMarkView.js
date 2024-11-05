import { PreviewView } from "./previewView";
class BookMarkView extends PreviewView {
  _parentElement = document.querySelector(".bookmarks__list");
  _messageError = `No bookmarks yet. Find a nice recipe and bookmark it :`;

  addHandlerBookMarks(handler) {
    window.addEventListener("load", handler);
  }
}

export const bookMarkView = new BookMarkView();
