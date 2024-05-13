import { Controller } from "@hotwired/stimulus"
import { Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard"
import { MARKER_TYPE, Markers } from "cm-chessboard-markers"
import { PROMOTION_DIALOG_RESULT_TYPE, PromotionDialog } from "cm-chessboard-promotion-dialog"
import { Chess } from "chess.js"
import { Game } from "../src/game.js"

const chess = new Chess()

const board = new Chessboard(document.getElementById("board"), {
  responsive: true,
  assetsUrl: "./assets/",
  extensions: [
    { class: Markers },
    { class: PromotionDialog }
  ]
})

const game = new Game(chess, board)

export default class extends Controller {
  static values = {
    fen: String,
    movesArray: Array
  }

  connect() {
    board.setPosition(this.fenValue)
    chess.load(this.fenValue)
    board.setOrientation(this.boardOrientation(chess.turn()))
    setTimeout(() => {
      game.makeFirstMove(this.movesArrayValue[0]);
    }, 500);

    board.enableMoveInput(this.inputHandler)
  }

  inputHandler(event) {
    return game.setEvent(event)
  }

  boardOrientation(value) {
    return value === "w" ? "b" : "w";
  }
}
