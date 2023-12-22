# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "chess.js", to: "https://cdn.jsdelivr.net/npm/chess.mjs@1/src/chess.mjs/Chess.js"
pin "cm-chessboard", to: "https://ga.jspm.io/npm:cm-chessboard@8.5.0/src/Chessboard.js"
pin "cm-chessboard-markers", to: "https://ga.jspm.io/npm:cm-chessboard@8.5.0/src/extensions/markers/Markers.js"
