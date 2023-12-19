# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "chess.js", to: "https://ga.jspm.io/npm:chess.js@1.0.0-beta.6/dist/esm/chess.js"
pin "cm-chessboard", to: "https://ga.jspm.io/npm:cm-chessboard@8.5.0/src/Chessboard.js"
