// const startBtn = document.querySelector(".start-btn");
// const aiBtn = document.querySelector(".ai");
// const playersBtn = document.querySelector(".players");
// const labels = document.querySelectorAll(".form-wrap label");

// labels.forEach((label) => {
//   label.innerHTML = label.textContent
//     .split("")
//     .map(
//       (letter, index) =>
//         `<span style="transition-delay:${index * 55}ms">${letter}</span>`
//     )
//     .join("");
// });

// startBtn.addEventListener("click", () => {
//   const startBtnWrapper = document.querySelector(".button-wrapper");
//   const selectBtnWrapper = document.querySelector(".select-buttons");
//   startBtnWrapper.classList.add("inactive");
//   startBtn.classList.add("btn-inactive");
//   setTimeout(function () {
//     selectBtnWrapper.classList.remove("inactive");
//   }, 400);
// });

// aiBtn.addEventListener("click", () => {
//   const selectWrapper = document.querySelector(".select-buttons");
//   const difficultyWrapper = document.querySelector(".ai-difficulty-wrapper");
//   selectWrapper.classList.add("inactive");
//   setTimeout(function () {
//     difficultyWrapper.classList.remove("inactive");
//   }, 200);
// });

// playersBtn.addEventListener("click", () => {
//   const selectWrapper = document.querySelector(".select-buttons");
//   const playerMenu = document.querySelector(".player-names");
//   selectWrapper.classList.add("inactive");
//   playerMenu.classList.remove("inactive");
// });

// (function () {
//   const game = {
//     players: [],
//     init: function () {
//       this.cacheDOM();
//       this.bindEvents();
//       this.startGame();
//       // this.render();
//     },
//     cacheDOM: function () {
//       this.start = document.querySelector(".start");
//       this.startBtn = this.start.querySelector(".start-btn");
//       this.aiBtn = document.querySelector(".ai");
//       this.playersBtn = document.querySelector(".players");
//       this.difficultySelect = this.start.querySelector("select");
//       this.inputPlayer1 = this.start.querySelector("#name1");
//       this.inputPlayer2 = this.start.querySelector("#name2");
//     },
//     bindEvents: function () {
//       this.startBtn.addEventListener(
//         "click",
//         this.startGame.bind(this, this.startBtn)
//       );
//     },
//     startGame: function (button) {
//       console.log(button);
//       // this.startBtn.parentElement.classList.add('inactive');
//       // this.startBtn.classList.add('btn-inactive');
//       // setTimeout(function(){
//       // })
//     },
//   };
//   game.init();
// })();

const start = (function () {
  // cache DOM
  const el = document.querySelector(".start");
  const startBtnDiv = el.querySelector(".button-wrapper");
  const allBtns = el.querySelector("button");
  const selectBtnDiv = el.querySelector(".select-buttons");
  const aiDifficultyBtnDiv = el.querySelector(".ai-difficulty-wrapper");
  const playerNamesDiv = el.querySelector(".player-names");

  // bind events
  startBtnDiv.firstElementChild.addEventListener("click", startGame, true);
  selectBtnDiv.firstElementChild.addEventListener("click", startGame, true);
  selectBtnDiv.lastElementChild.addEventListener("click", startGame, true);

  // handle menu clicks & remove eventListeners
  function startGame(e) {
    const aiSelection = el.querySelector(".ai");
    const labels = document.querySelectorAll(".form-wrap label");
    e.target.parentElement.classList.add("inactive");
    e.target.classList.add("btn-inactive");
    switch (e.target.parentElement) {
      case startBtnDiv:
        selectBtnDiv.classList.remove("inactive");
        startBtnDiv.firstElementChild.removeEventListener(
          "click",
          startGame,
          true
        );
        break;
      case selectBtnDiv:
        e.target === aiSelection
          ? aiDifficultyBtnDiv.classList.remove("inactive")
          : playerNamesDiv.classList.remove("inactive"),
          labels.forEach((label) => {
            label.innerHTML = label.textContent
              .split("")
              .map(
                (letter, index) =>
                  `<span style="transition-delay:${
                    index * 55
                  }ms">${letter}</span>`
              )
              .join("");
          });
        selectBtnDiv.firstElementChild.removeEventListener(
          "click",
          startGame,
          true
        );
        selectBtnDiv.lastElementChild.removeEventListener(
          "click",
          startGame,
          true
        );
    }
  }
})();
