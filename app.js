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
  return { map, setMark, returnMark, restart };
})();
const playerFactory = (name, mark) => {
  const getMark = () => {
    return mark;
  };
  const getName = () => {
    return name;
  };
  return { name, mark, getName, getMark };
};

const gameCommentary = () => {
  // Cache DOM
  const playingSpan = document.querySelector(".playing");
  const commentary = document.querySelector(".commentary");
  function commentaryHandler() {
    playingSpan.textContent = start.gameSettings.NextPlayer;
    commentary.textContent = start.gameSettings.state;
    if (start.gameSettings.state !== "is playing") {
      return;
    }
    console.log(start.gameSettings);
    // console.log(start.);
    // console.log(obj);
    // console.log("hi");
  }
  return { commentaryHandler };
};

const gameController = (obj) => {
  // TODO check if we can return the following functions and handle the rest through start.
  const playingSpan = document.querySelector(".playing");
  const commentary = document.querySelector(".commentary");
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  // function _stateHandler() {
  //   cache.playingSpan.textContent = `${_playerTurn(gameSettings.round)}`;
  //   cache.commentary = `${gameSettings.state}`;
  // }
  // const checkWinner = (currentMap) => {
  //   return winConditions.some((combination) => {
  //     return combination.every((index) => {
  //       return currentMap[index].value === obj.turn;
  //     });
  //   });
  // };
  // TODO CHECK OUT THIS BAD BOY
  const checkWinner = () => {
    gameCommentary(start).commentaryHandler();
    return winConditions.some((combination) => {
      // return combination.every(
      //   (index) => gameMap.returnMark(index) === obj.turn
      // );
      return combination.every(
        (index) => gameMap.returnMark(index) === obj.turn
      );
    });
  };
  const announceWinner = (winner) => {
    playingSpan.textContent = winner;
    commentary.textContent = ` has won! `;
  };

  const findWinner = (playerX, playerO) => {
    if (checkWinner() === true) {
      if (playerX.getMark() === obj.turn) {
        return playerX.getName();
      } else {
        return playerO.getName();
      }
    }
  };
  // TODO possibly create a render func for commentary too

  console.log(checkWinner());
  // console.log(findWinner(obj.playerX, obj.playerO));
  // console.log(obj);
  // console.log(gameMap.map);
  // announceWinner(findWinner(obj.playerX, obj.playerO));
};

const start = (() => {
  const gameSettings = {
    maxRounds: 9,
    gameOver: false,
    round: 0,
    turn: "X",
    NextPlayer: "",
    state: "is playing",
  };
  // cache DOM
  const options = document.querySelector(".options");
  const gameCanvas = document.querySelector(".main-game");
  const startBtnDiv = options.querySelector(".button-wrapper");
  const selectBtnDiv = options.querySelector(".select-buttons");
  const aiDifficultyBtnDiv = options.querySelector(".ai-difficulty-wrapper");
  const playerNamesDiv = options.querySelector(".player-names");
  const initDuoButton = playerNamesDiv.querySelector("button");
  const form = playerNamesDiv.querySelector("form");
  const player1Input = playerNamesDiv.querySelector("#name1");
  const player2Input = playerNamesDiv.querySelector("#name2");
  const restartBtn = document.querySelector(".restart-btn");
  const quitBtn = document.querySelector(".quit-btn");
  const playAIBtn = selectBtnDiv.firstElementChild;
  const playVersusPlayer = selectBtnDiv.lastElementChild;
  const AiDifficultySelection = aiDifficultyBtnDiv.children[1].children[0];

  // bind initial events
  startBtnDiv.firstElementChild.addEventListener("click", _setGameRules, true);
  selectBtnDiv.firstElementChild.addEventListener("click", _setGameRules, true);
  selectBtnDiv.lastElementChild.addEventListener("click", _setGameRules, true);
  // TODO replace with render
  // renders content
  function renderDiv(before, next, classListAdd, classListRemove) {
    before.classList.add(`${classListAdd}`);
    next.classList.remove(`${classListRemove}`);
  }
  function renderElement(element, classList, action) {
    if (!action) {
      element.classList.add(`${classList}`);
    } else {
      element.classList.remove(`${classList}`);
    }
  }
  function resetInput(input) {
    input.value = "";
  }
  // handle menu clicks & remove eventListeners
  function _setGameRules(e) {
    const aiSelection = options.querySelector(".ai");
    const labels = document.querySelectorAll(".form-wrap label");
    renderElement(e.target.parentElement, "inactive");
    // e.target.classList.add("btn-inactive");
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
          _animateLabels();
        playAIBtn.removeEventListener("click", _setGameRules, true);
        playVersusPlayer.removeEventListener("click", _setGameRules, true);
        initDuoButton.addEventListener("click", _setDuo, true);
      case aiDifficultyBtnDiv:
        AiDifficultySelection.addEventListener("change", _setDifficulty, true);
    }
    function _animateLabels() {
      labels.forEach((label) => {
        label.innerHTML = label.textContent
          .split("")
          .map(
            (letter, index) =>
              `<span style="transition-delay:${index * 55}ms">${letter}</span>`
          )
          .join("");
      });
    }
  }

  // set AI difficulty
  function _setDifficulty() {
    const difficulty = aiDifficultyBtnDiv.children[1].children[0].value;
    gameSettings.difficulty = difficulty;
    gameSettings.mode = "Solo";
    gameSettings.playerX = playerFactory("AI", "X");
    gameSettings.playerO = playerFactory("You", "O");
    resetInput(difficulty);
    aiDifficultyBtnDiv.children[1].children[0].removeEventListener(
      "change",
      _setDifficulty,
      true
    );
    renderDiv(options, gameCanvas, "inactive-section", "inactive-section");
    gameController(gameSettings);
  }
  // set Duo mode
  function _setDuo(e) {
    if (player1Input.value.length > 0 && player2Input.value.length > 0) {
      const playerX = playerFactory(player1Input.value, "X");
      const playerO = playerFactory(player2Input.value, "O");
      gameSettings.playerX = playerX;
      gameSettings.playerO = playerO;
      renderDiv(options, gameCanvas, "inactive-section", "inactive-section");
      gameController(gameSettings);
      e.preventDefault();
      form.reset();
      // console.log(gameSettings);
      _playerTurn(gameSettings.round);
      gameCommentary(gameSettings).commentaryHandler();
      // console.log(_playerTurn(gameSettings.round));
      initDuoButton.removeEventListener("click", _setDuo, true);
    }
    // console.log(gameSettings.playerX.getName());
    // console.log(gameSettings.playerX.getMark());
  }
  gameSettings.round = 0;
  _handleField();

  function _playerTurn(round) {
    if (round % 2 == 0) {
      // gameSettings.turn = gameSettings.playerX.getMark();
      return gameSettings.playerX.getMark();
    } else {
      // gameSettings.turn = gameSettings.playerX.getMark();
      return gameSettings.playerO.getMark();
    }
  }
  function _getNextPlayer() {
    if (gameSettings.round % 2 === 1) {
      gameSettings.NextPlayer = gameSettings.playerX.getMark();
    } else {
      gameSettings.NextPlayer = gameSettings.playerO.getMark();
    }
  }

  function _handleField() {
    const allFields = document.querySelectorAll(".press");
    _enableFields();

    // handles field-clicking and updated the gameMap
    function _useField(e) {
      const field = e.target;
      const id = +e.target.parentElement.attributes[1].value;
      const mark = _playerTurn(gameSettings.round);
      field.textContent = mark;
      gameMap.setMark(+id, mark);
      gameSettings.turn = _playerTurn(gameSettings.round);
      _getNextPlayer();
      gameSettings.round++;
      gameCommentary(gameSettings).commentaryHandler();
      _blockField(field);
      gameController(gameSettings);
    }
    function _enableFields() {
      allFields.forEach((field) => {
        field.addEventListener("click", _useField);
      });
    }
    function _blockField(field) {
      field.removeEventListener("click", _useField);
    }
    function _restart() {
      allFields.forEach((field) => {
        field.textContent = "";
        gameMap.restart();
        _enableFields();
        gameSettings.round = 0;
      });
    }
    function _quit() {
      window.location.href = "/";
    }

    restartBtn.addEventListener("click", _restart);
    quitBtn.addEventListener("click", _quit);
  }
  return { gameSettings };
})();
