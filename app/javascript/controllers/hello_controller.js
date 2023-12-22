import { Controller } from "@hotwired/stimulus"
import { Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard"
import { MARKER_TYPE, Markers } from "cm-chessboard-markers"
import { Chess } from "chess.js"

const chess = new Chess()

const board = new Chessboard(document.getElementById("board"), {
  position: FEN.start,
  responsive: true,
  assetsUrl: "./assets/",
  extensions: [{ class: Markers }]
})

export default class extends Controller {
  connect() {
    //this.element.textContent = "Hello World!"
    board.enableMoveInput(this.inputHandler)
  }

  inputHandler(event) {
    console.log("inputHandler", event)
    if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
      return // ignore this event
    }
    if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
      event.chessboard.removeMarkers(MARKER_TYPE.dot)
      event.chessboard.removeMarkers(MARKER_TYPE.bevel)
    }
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
      const moves = chess.moves({ square: event.squareFrom, verbose: true })
      for (const move of moves) { // draw dots on possible squares
        if (move.promotion && move.promotion !== "q") {
          continue
        }
        if (event.chessboard.getPiece(move.to)) {
          event.chessboard.addMarker(MARKER_TYPE.bevel, move.to)
        } else {
          event.chessboard.addMarker(MARKER_TYPE.dot, move.to)
        }
      }
      return moves.length > 0
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      const move = { from: event.squareFrom, to: event.squareTo, promotion: event.promotion }
      const result = chess.move(move, { sloppy: true })
      if (result) {
        event.chessboard.state.moveInputProcess.then(() => { // wait for the move input process has finished
          event.chessboard.setPosition(chess.fen(), true).then(() => { // update position, maybe castled and wait for animation has finished
          })
        })
      }
      return result
    }
  }
}
