const gameMap = (() => {
  const map = ["", "", "", "", "", "", "", "", ""];
  const setMark = (i, mark) => {
    if (i > map.length) return;
    map[i] = mark;
  };
  const returnMark = (i, mark) => {
    if (i > map.length) return;
    return map[i];
  };
  const restart = () => {
    map.forEach((mark, index, map) => (map[index] = ""));
  };
  return { setMark, returnMark, restart };
})();
// Player Factory
const playerFactory = (name, mark) => {
  const getMark = () => {
    return mark;
  };
  return { getMark };
};

const start = (() => {
  const gameSettings = {};
  // cache DOM
  const options = document.querySelector(".options");
  const gameCanvas = document.querySelector(".main-game");
  const startBtnDiv = options.querySelector(".button-wrapper");
  const selectBtnDiv = options.querySelector(".select-buttons");
  const aiDifficultyBtnDiv = options.querySelector(".ai-difficulty-wrapper");
  const playerNamesDiv = options.querySelector(".player-names");

  // bind events
  startBtnDiv.firstElementChild.addEventListener("click", _setGameRules, true);
  selectBtnDiv.firstElementChild.addEventListener("click", _setGameRules, true);
  selectBtnDiv.lastElementChild.addEventListener("click", _setGameRules, true);

  // TODO replace with render
  // renders content
  function render(before, next, classListAdd, classListRemove) {
    before.classList.add(`${classListAdd}`);
    next.classList.remove(`${classListRemove}`);
  }

  // handle menu clicks & remove eventListeners
  function _setGameRules(e) {
    const aiSelection = options.querySelector(".ai");
    const labels = document.querySelectorAll(".form-wrap label");
    e.target.parentElement.classList.add("inactive");
    e.target.classList.add("btn-inactive");
    switch (e.target.parentElement) {
      case startBtnDiv:
        selectBtnDiv.classList.remove("inactive");
        startBtnDiv.firstElementChild.removeEventListener(
          "click",
          _setGameRules,
          true
        );
        break;
      case selectBtnDiv:
        e.target === aiSelection
          ? aiDifficultyBtnDiv.classList.remove("inactive")
          : playerNamesDiv.classList.remove("inactive"),
          (gameSettings.mode = "Duo"),
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
          _setGameRules,
          true
        );
        selectBtnDiv.lastElementChild.removeEventListener(
          "click",
          _setGameRules,
          true
        );
        playerNamesDiv.firstElementChild[2].addEventListener(
          "click",
          _setDuo,
          true
        );
      case aiDifficultyBtnDiv:
        aiDifficultyBtnDiv.children[1].children[0].addEventListener(
          "change",
          _setDifficulty,
          true
        );
    }
  }
  // set AI difficulty
  function _setDifficulty() {
    const difficulty = aiDifficultyBtnDiv.children[1].children[0].value;
    gameSettings.difficulty = difficulty;
    gameSettings.mode = "Solo";
    gameSettings.playerX = playerFactory("AI", "X");
    gameSettings.playerO = playerFactory("You", "O");
    aiDifficultyBtnDiv.children[1].children[0].value = "";
    aiDifficultyBtnDiv.children[1].children[0].removeEventListener(
      "change",
      _setDifficulty,
      true
    );
    render(options, gameCanvas, "inactive-section", "inactive-section");
    // options.classList.add("inactive-section");
    // gameCanvas.classList.remove("inactive-section");
    render;
  }
  // set Duo mode
  function _setDuo(e) {
    // e.preventDefault();
    gameSettings.playerX = playerFactory(
      playerNamesDiv.firstElementChild[0].value,
      "X"
    );
    gameSettings.playerO = playerFactory(
      playerNamesDiv.firstElementChild[1].value,
      "O"
    );
    playerNamesDiv.firstElementChild[2].removeEventListener(
      "click",
      _setDuo,
      true
    );
    // TODO fix name inputs
    // options.classList.add("inactive-section");
    // gameCanvas.classList.remove("inactive-section");
    // playerNamesDiv.firstElementChild[0].value = "";
    // playerNamesDiv.firstElementChild[1].value = "";
    console.log(gameSettings);
  }
  gameSettings.round = 0;
  gameSettings.maxRounds = 9;
  _handleField();

  function _handleField() {
    const allFields = document.querySelectorAll(".press");
    const restart = document.querySelector(".restart-btn");
    const quit = document.querySelector(".quit-btn");

    // handles player turns
    const _playerTurn = (round) => {
      if (round % 2 === 0) {
        return gameSettings.playerX.getMark();
      } else {
        return gameSettings.playerO.getMark();
      }
    };
    // handles field-clicking and updated the gameMap
    function _useField(e) {
      const field = e.target;
      const id = +e.target.parentElement.attributes[1].value;
      const mark = _playerTurn(gameSettings.round);
      field.textContent = mark;
      gameMap.setMark(+id, mark);
      gameSettings.round++;
      _blockField(field);
    }
    function _blockField(field) {
      field.removeEventListener("click", _useField);
    }
    allFields.forEach((field) => {
      field.addEventListener("click", _useField);
    });
  }
})();
