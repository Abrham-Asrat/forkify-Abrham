import { PreviewView } from "./previewView";
class ResultView extends PreviewView {
  _parentElement = document.querySelector(".results");
  _messageError = `No recipe with your query. Please try another one!`;
}
export const resultView = new ResultView();
