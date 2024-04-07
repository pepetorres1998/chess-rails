import { INPUT_EVENT_TYPE } from "cm-chessboard"
import { MARKER_TYPE } from "cm-chessboard-markers"
import { PROMOTION_DIALOG_RESULT_TYPE } from "cm-chessboard-promotion-dialog"

export class Game {
  constructor(chess, board) {
    this.chess = chess;
    this.board = board;
  }

  setEvent(event) {
    this.event = event;

    return this.doAction();
  }

  doAction() {
    if (this.movingOverSquare()) {
      return;
    }
    if (!this.moveInputFinished()) {
      this.event.chessboard.removeMarkers(MARKER_TYPE.dot);
      this.event.chessboard.removeMarkers(MARKER_TYPE.bevel);
    }
    if (this.moveInputStarted()) {
      if (!this.pieceIsTurnColor()) {
        return false;
      }

      for (const move of this.availableMoves()) { // draw dots on possible squares
        // Checks for promotion possible moves so it just draws it 1 time
        if (move.promotion && move.promotion !== "q") {
          continue;
        }
        if (this.event.chessboard.getPiece(move.to)) {
          this.event.chessboard.addMarker(MARKER_TYPE.bevel, move.to);
        } else {
          this.event.chessboard.addMarker(MARKER_TYPE.dot, move.to);
        }
      }
      return true;
    } else if (this.validateMoveInput()) {
      const move = { from: this.event.squareFrom, to: this.event.squareTo, promotion: this.event.promotion }
      const result = this.chess.move(move, { sloppy: true });

      if (result) {
        this.event.chessboard.state.moveInputProcess.then(() => { // wait for the move input process has finished
          this.event.chessboard.setPosition(this.chess.fen(), true).then(() => { // update position, maybe castled and wait for animation has finished
          });
        });
      } else {
        // set promotion dialog result = nil
        for (const possibleMove of this.availableMoves()) {
          if (possibleMove.promotion && possibleMove.to === this.event.squareTo) {
            this.event.chessboard.showPromotionDialog(this.event.squareTo, this.chess.turn(), (result) => {
              if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
                this.chess.move({ from: this.event.squareFrom, to: this.event.squareTo, promotion: result.piece.charAt(1) });
                this.event.chessboard.setPosition(this.chess.fen(), true);
              } else {
                // promotion canceled
                this.event.chessboard.setPosition(this.chess.fen(), true);
              }
            })
            return true;
          }
        }
      }
      return result;
    } else if (this.moveInputFinished()) {
      if (this.chess.game_over()) {
        let gameWinner;

        if (this.chess.in_checkmate()) {
          gameWinner = this.chess.turn() == "w" ? "Black" : "White";
        } else {
          gameWinner = "Nobody";
        }
        alert(`${gameWinner} wins!`);
        this.event.chessboard.disableMoveInput();
      }
    }
  }

  pieceIsTurnColor() {
    return this.event.piece.startsWith(this.chess.turn())
  }

  availableMoves() {
    return this.chess.moves({ square: this.event.squareFrom, verbose: true });
  }

  movingOverSquare() {
    return this.event.type === INPUT_EVENT_TYPE.movingOverSquare;
  }

  moveInputFinished() {
    return this.event.type === INPUT_EVENT_TYPE.moveInputFinished;
  }

  moveInputStarted() {
    return this.event.type === INPUT_EVENT_TYPE.moveInputStarted;
  }

  validateMoveInput() {
    return this.event.type === INPUT_EVENT_TYPE.validateMoveInput;
  }
}
