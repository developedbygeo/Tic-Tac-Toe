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
const AiFactory = (name, mark, difficulty) => {
  const getDifficulty = () => {
    return difficulty;
  };
  const isEmpty = (field) => {
    return field.length === 0;
  };
  const mapCheck = () => {
    return gameMap.map.filter((field) => isEmpty(field));
  };
  const randomMoveGenerator = () => {
    const filtered = gameMap.map.filter((field) => field.length === 0);
    const maxIndex = filtered.length;
    const id = Math.floor(Math.random() * (maxIndex - 1 + 1) + 1);
    // return id;
    move(id);
  };
  // TODO generate random move for testing purposes
  const fillField = (index) => {
    const selectedField = document.getElementById(`${index}`);
    gameMap.setMark(index, mark);
    selectedField.firstElementChild.textContent = mark;
  };
  const move = (index) => {
    if (!isEmpty(gameMap.map[index])) return;
    fillField(index);
    start.gameSettings.round++;
  };
  return { getDifficulty, randomMoveGenerator, move };
};
const commentaryController = (obj) => {
  // cache DOM
  const playingSpan = document.querySelector(".playing");
  const commentary = document.querySelector(".commentary");
  function commentaryLive() {
    commentary.textContent = obj.state;
    switch (obj.state) {
      case "is playing":
        playingSpan.textContent = obj.NextPlayer;
        break;
      case "WON!":
        playingSpan.textContent = obj.winner;
        break;
      case "DRAW!":
        playingSpan.textContent = "";
        break;
      case "":
        playingSpan.textContent = "";
    }
  }
  commentaryLive();
};
const AiController = () => {
  const mark = "X";

  function basicAI() {
    let selectedField;
    const filtered = gameMap.map.filter((field) => field.length === 0);
    const maxIndex = filtered.length;
    return random(0, maxIndex);
  }
  function random(min, max) {
    Math.floor(Math.random() * (max - min)) + min;
  }
  return basicAI;
};
const gameController = (obj) => {
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
  // cache DOM
  const allFields = document.querySelectorAll(".press");
  const restartBtn = document.querySelector(".restart-btn");
  const quitBtn = document.querySelector(".quit-btn");
  //   cache gameSettings
  let { playerX, playerO } = obj;

  // Binding events
  restartBtn.addEventListener("click", _restart, true);
  quitBtn.addEventListener("click", _quit, true);

  function _enableFields() {
    switch (obj.mode) {
      case "AI":
        _turnHandlerAI();
        allFields.forEach((field) =>
          field.addEventListener("click", _useFieldAI, true)
        );
        break;
      case "Duo":
        allFields.forEach((field) =>
          field.addEventListener("click", _useFieldDuo, true)
        );
        break;
    }
  }

  function _handleGame() {
    switch (_checkWinner()) {
      case true:
        _disableFields();
        _handleWin();
        break;
      case false:
        if (obj.round < 10) {
          return;
        } else {
          _handleDraw();
        }
        break;
    }
  }
  function _useFieldDuo(e) {
    const field = e.target;
    const id = +field.parentElement.attributes[1].value;
    const mark = (obj.turn = _playerTurn());
    obj.NextPlayer = _nextPlayerTurn();
    console.log(obj);
    field.textContent = mark;
    obj.state = "is playing";
    gameMap.setMark(id, mark);
    obj.round++;
    e.target.removeEventListener("click", _useFieldDuo, true);
    _handleGame();
    commentaryController(obj);
    console.log(obj);
  }
  function _disableFields() {
    allFields.forEach((field) =>
      field.removeEventListener("click", _useFieldDuo, true)
    );
  }

  // function _useFieldAI(e) {
  //   const field = e.target;
  //   const id = +field.parentElement.attributes[1].value;
  //   const mark = obj.playerO.getMark();
  //   obj.turn = _playerTurn();
  //   // let check = setInterval(checkRound, 2000);
  //   field.textContent = mark;
  //   gameMap.setMark(id, mark);
  //   field.removeEventListener("click", _useFieldAI, true);
  //   _handleGame();
  //   obj.round++;
  //   commentaryController(obj);
  //   // console.log(obj);
  //   console.log(gameMap.map);

  //   // _basicAI();
  //   // }
  //   // obj.NextPlayer = _nextPlayerTurn();

  //   // console.log(obj);
  //   console.log(gameMap.map);
  //   // }
  // }
  // TODO could add a bridge function on eventclick,
  function _useFieldAI(e) {
    // TODO could add distinction about ai levels here
    // _enableFields();
    const field = e.target;
    const id = e.target.parentElement.attributes[1].value;
    _useFieldSolo(field, id);
    // _turnHandlerAI();

    // console.log(_playerTurn());
    // player click etc
    // code goes here and basicAI is the last invocation
    // _basicAI();
  }
  function _basicAI() {
    let selectedField;
    const mark = obj.playerX.getMark();
    const filtered = gameMap.map.filter((field) => field.length === 0);
    const maxIndex = filtered.length;
    // TODO replace filtered with a function to check for the empty fields in the gamemap.
    // TODO check isEmpty function in the AiFactory
    const id = Math.floor(Math.random() * (maxIndex - 1 + 1) + 1);
    console.log(`Selected ID is ${id}`);
    // _disableFields();
    selectedField = document.getElementById(`${id}`);
    selectedField.firstElementChild.textContent = mark;
    gameMap.setMark(id, mark);
    obj.turn = _playerTurn();
    obj.round++;
    console.log(obj.round);
    selectedField.firstElementChild.removeEventListener(
      "click",
      _useFieldAI,
      true
    );
    _handleGame();
    // console.log(obj);
    // console.log(gameMap.map);
    commentaryController(obj);

    console.log(_playerTurn());
  }
  function _turnHandlerAI() {
    _playerTurn() === "X" ? _basicAI() : _useFieldSolo();
  }
  function _useFieldSolo(field, id) {
    const target = field;
    const mark = (obj.turn = _playerTurn());
    obj.NextPlayer = _nextPlayerTurn();
    field.innerText = mark;
    obj.state = "is playing";
    gameMap.setMark(id, mark);
    field.removeEventListener("click", _useFieldAI, true);
    obj.round++;
    _handleGame();
    commentaryController(obj);
    _turnHandlerAI();
    console.log(obj);
  }

  function _handleWin() {
    [obj.gameOver, obj.state, obj.winner] = ["true", "WON!", _findWinner()];
  }
  function _handleDraw() {
    [obj.gameOver, obj.state] = ["true", "DRAW!"];
  }
  // function _basicAI() {
  //   console.log(obj);
  //   let selectedField;
  //   const mark = obj.playerX.getMark();
  //   const filtered = gameMap.map.filter((field) => field.length === 0);
  //   const maxIndex = filtered.length;
  //   const id = Math.floor(Math.random() * (maxIndex - 1 + 1) + 1);
  //   selectedField = document.getElementById(`${id}`);
  //   selectedField.firstElementChild.textContent = mark;
  //   gameMap.setMark(id, mark);
  //   obj.turn = _playerTurn();
  //   obj.round++;
  //   selectedField.firstElementChild.removeEventListener(
  //     "click",
  //     _useFieldAI,
  //     true
  //   );
  //   _handleGame();
  //   // console.log(obj);
  //   console.log(gameMap.map);
  //   commentaryController(obj);
  // }
  function _checkWinner() {
    return winConditions.some((combination) => {
      return combination.every(
        (index) => gameMap.returnMark(index) === obj.turn
      );
    });
  }
  function _findWinner() {
    return obj.turn === "X" ? playerX.getName() : playerO.getName();
  }
  function _playerTurn() {
    return obj.round % 2 === 0 ? playerX.getMark() : playerO.getMark();
  }
  function _nextPlayerTurn() {
    return obj.round % 2 === 1 ? playerX.getMark() : playerO.getMark();
  }
  function _restart() {
    allFields.forEach((field) => (field.textContent = ""));
    gameMap.restart();
    _enableFields();
    [obj.round, obj.state] = [0, ""];
    commentaryController(obj);
  }
  function _quit() {
    window.location.href = "/";
    quitBtn.removeEventListener("click", _quit, true);
  }
  _enableFields();
};
const start = (() => {
  let gameSettings = {
    maxRounds: 9,
    gameOver: false,
    round: 0,
    turn: "X",
    NextPlayer: "",
    state: "is playing",
  };
  // Cache DOM
  const options = document.querySelector(".options");
  const gameCanvas = document.querySelector(".main-game");

  //   buttons
  const startBtn = options.querySelector(".start-btn");
  const playVsAiBtn = options.querySelector(".ai");
  const playVsPlayerBtn = options.querySelector(".players");
  const duoPlayBtn = options.querySelector(".play-pl");
  //  inputs
  const difficultyAI = options.querySelector("#difficulty");
  const player1Input = options.querySelector("#name1");
  const player2Input = options.querySelector("#name2");

  // Bind initial events
  startBtn.addEventListener("click", _initializeGame, true);
  playVsAiBtn.addEventListener("click", _initializeGame, true);
  playVsPlayerBtn.addEventListener("click", _initializeGame, true);

  // render content
  function _renderDiv(before, classListAdd, next, classListRemove) {
    before.classList.add(`${classListAdd}`);
    if (!next) {
      return;
    } else {
      next.classList.remove(`${classListRemove}`);
    }
  }
  // reset input
  function _resetInput(input1, input2 = input1) {
    input1.value = "";
    input2.value = "";
  }
  function _animateLabels() {
    const labels = options.querySelectorAll(".form-wrap label");
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
  function _initializeGame(e) {
    e.target !== playVsPlayerBtn
      ? [
          _renderDiv(
            e.target.parentElement,
            "inactive",
            e.target.parentElement.nextElementSibling,
            "inactive"
          ),
          difficultyAI.addEventListener("change", _setAISettings, true),
        ]
      : [
          _renderDiv(
            e.target.parentElement,
            "inactive",
            e.target.parentElement.nextElementSibling.nextElementSibling,
            "inactive"
          ),
          _animateLabels(),
          duoPlayBtn.addEventListener("click", _setDuoSettings),
        ];
    e.target.removeEventListener("click", _initializeGame, true);
  }
  function _setAISettings() {
    gameSettings.AI = difficultyAI.value;
    _renderDiv(options, "inactive-section", gameCanvas, "inactive-section");
    difficultyAI.removeEventListener("change", _setAISettings, true);
    const [playerX, playerO] = [
      playerFactory("AI", "X"),
      playerFactory("You", "O"),
    ];
    [gameSettings.playerX, gameSettings.playerO, gameSettings.mode] = [
      playerX,
      playerO,
      "AI",
    ];
    _resetInput(difficultyAI);
    _gameInit();
  }
  function _setDuoSettings(e) {
    const [playerX, playerO] = [
      playerFactory(player1Input.value, "X"),
      playerFactory(player2Input.value, "O"),
    ];
    [gameSettings.playerX, gameSettings.playerO, gameSettings.mode] = [
      playerX,
      playerO,
      "Duo",
    ];
    duoPlayBtn.removeEventListener("click", _setDuoSettings, true);
    [player1Input.value.length && player2Input.value.length] > 0
      ? [
          e.preventDefault(),
          _gameInit(),
          _resetInput(player1Input, player2Input),
        ]
      : e;
  }
  function _gameInit() {
    _renderDiv(options, "inactive-section", gameCanvas, "inactive-section");
    gameController(gameSettings);
  }
  return { gameSettings };
})();
