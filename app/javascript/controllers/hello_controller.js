import { Controller } from "@hotwired/stimulus"
import { Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard"
// import { Markers } from "cm-chessboard-extensions/" // this needs to be pinned, the cm-chessboard project has the sources for the extensions

export default class extends Controller {
  connect() {
    //this.element.textContent = "Hello World!"
    const board = new Chessboard(document.getElementById("board"), {
      position: FEN.start,
      responsive: true,
      assetsUrl: "./assets/"
    })

    board.enableMoveInput(this.inputHandler)
  }

  inputHandler(event) {
    console.log(event)
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted ||
      event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      return true // false cancels move
    }
  }
}
