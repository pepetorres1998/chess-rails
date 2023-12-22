import { Controller } from "@hotwired/stimulus"
import { Chessboard, FEN, INPUT_EVENT_TYPE } from "cm-chessboard"
import { MARKER_TYPE, Markers } from "cm-chessboard-markers"
import { PROMOTION_DIALOG_RESULT_TYPE, PromotionDialog } from "cm-chessboard-promotion-dialog"
import { Chess } from "chess.js"

const chess = new Chess()

const board = new Chessboard(document.getElementById("board"), {
  position: FEN.start,
  responsive: true,
  assetsUrl: "./assets/",
  extensions: [
    { class: Markers },
    { class: PromotionDialog }
  ]
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
      return true
    } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
      const move = { from: event.squareFrom, to: event.squareTo, promotion: event.promotion }
      const result = chess.move(move, { sloppy: true })
      if (result) {
        event.chessboard.state.moveInputProcess.then(() => { // wait for the move input process has finished
          event.chessboard.setPosition(chess.fen(), true).then(() => { // update position, maybe castled and wait for animation has finished
          })
        })
      } else {
        // promotion?
        let possibleMoves = chess.moves({ square: event.squareFrom, verbose: true })
        for (const possibleMove of possibleMoves) {
          if (possibleMove.promotion && possibleMove.to === event.squareTo) {
            event.chessboard.showPromotionDialog(event.squareTo, chess.turn(), (result) => {
              console.log("promotion result", result)
              if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
                chess.move({ from: event.squareFrom, to: event.squareTo, promotion: result.piece.charAt(1) })
                event.chessboard.setPosition(chess.fen(), true)
              } else {
                // promotion canceled
                console.log("promotion canceled")
                // event.chessboard.enableMoveInput(inputHandler, COLOR.white)
                event.chessboard.setPosition(chess.fen(), true)
              }
            })
            return true
          }
        }
      }
      return result
    } else if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
      if (chess.game_over()) {
        let gameWinner;

        if (chess.in_checkmate()) {
          gameWinner = chess.turn() == "w" ? "Black" : "White"
        } else {
          gameWinner = "Nobody"
        }
        alert(`${gameWinner} wins!`)
        chess.reset()
        event.chessboard.setPosition(chess.fen(), true)
      }
    }
  }
}
