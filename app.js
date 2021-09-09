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
  const findEmpty = (selectedMap = map) => {
    let unselected = [];
    let i;
    selectedMap.forEach(function (x, index) {
      if (x.length === 0) {
        i = index;
        unselected.push(i);
      }
    });
    return unselected;
  };
  const restart = () => {
    map.forEach((mark, i, map) => (map[i] = ""));
  };
  return {
    map,
    setMark,
    returnMark,
    findEmpty,
    restart,
  };
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
  // Confetti
  const jsConfetti = new JSConfetti();
  const confettiArgs = {
    confettiColors: [
      "#a864fd",
      "#29cdff",
      "#78ff44",
      "#ff718d",
      "#fdff6a",
      "#f8b5bf",
    ],
    confettiRadius: 5,
    confettiNumber: 700,
  };
  // cache DOM
  const allFields = document.querySelectorAll(".press");
  const restartBtn = document.querySelector(".restart-btn");
  //   cache gameSettings
  let { playerX, playerO } = obj;
  // Binding events
  restartBtn.addEventListener("click", _restart, true);
  function _enableFields() {
    switch (obj.mode) {
      case "AI":
        _turnHandlerAI();
        allFields.forEach((field) =>
          field.addEventListener("click", _useFieldSolo, true)
        );
        break;
      case "Duo":
        allFields.forEach((field) =>
          field.addEventListener("click", _useFieldDuo, true)
        );
        break;
    }
  }
  function _enableFieldsAI() {
    allFields.forEach((field) =>
      field.addEventListener("click", _useFieldSolo, true)
    );
  }
  // handles the game state for duo mode
  function _handleGame() {
    switch (_checkWinner()) {
      case false:
        if (obj.round < 9) {
          return;
        } else {
          _handleDraw();
        }
        break;
      case true:
        _disableFields();
        _handleWin();
        break;
    }
  }
  // handles the game state for solo
  function _handleGameAI() {
    switch (_checkWinner()) {
      case true:
        _handleWin();
        _disableFields(_useFieldSolo);
        break;
      case false:
        if (obj.round < 9) {
          return;
        } else {
          _handleDraw();
        }
        break;
    }
  }
  function _useFieldDuo(e) {
    if (!e) return;
    const field = e.target;
    const id = +field.parentElement.attributes[1].value;
    const mark = (obj.turn = _playerTurn());
    obj.NextPlayer = _nextPlayerTurn();
    field.textContent = mark;
    obj.state = "is playing";
    gameMap.setMark(id, mark);
    obj.round++;
    e.target.removeEventListener("click", _useFieldDuo, true);
    _handleGame();
    commentaryController(obj);
  }
  function _disableFields(func = _useFieldDuo) {
    allFields.forEach((field) =>
      field.removeEventListener("click", func, true)
    );
  }
  function _useFieldAI(e) {
    _useFieldSolo(e);
  }
  // gets an array of empty indices and comes up with a random spot to play
  function _basicAI() {
    const id = _.sampleSize(_findEmptyPositions(), 1);
    _arrayRemove(_findEmptyPositions(), id);
    _disableFields(_useFieldSolo);
    _move(id);
    _handleGameAI();
    commentaryController(obj);
    if (obj.gameOver === true) {
      _turnHandlerAI("stop");
    } else {
      _enableFieldsAI();
    }
  }
  // plays in an intermediate pattern, else picks randomly
  function _intermediateAI() {
    const map = _findEmptyPositions();
    switch (obj.round) {
      case 0:
        firstOptimalMove();
        break;
      case 2:
        map.includes(8) ? _move(8) : _move(6);
        break;
      case 4:
        if (map.includes(2)) {
          _move(2);
        } else if (map.includes(0)) {
          if (!map.includes(2) && !map.includes(8)) {
            _move(5);
          } else {
            _move(0);
          }
        } else if (!map.includes(2) && !map.includes(8)) {
          _move(6);
        } else {
          _basicAI;
        }
        break;
      case 6:
      case 8:
        _basicAI();
        break;
    }
  }

  function _findEmptyPositions() {
    const filteredSorted = _updateEmptyPositions().sort(function (a, b) {
      return a - b;
    });
    return filteredSorted;
  }
  function _updateEmptyPositions() {
    const filtered = gameMap.findEmpty();
    return filtered;
  }

  function _arrayRemove(arr, value) {
    return arr.filter(function (positions) {
      return positions != value;
    });
  }
  function _isEmpty(field) {
    return field.length === 0;
  }
  function _fillField(index) {
    const selectedField = document.getElementById(`${index}`);
    const mark = obj.playerX.getMark();
    gameMap.setMark(index, mark);
    selectedField.firstElementChild.textContent = mark;
  }
  function _removeEventListener(index) {
    const selectedField = document.getElementById(`${index}`);
    selectedField.removeEventListener("click", _useFieldAI, true);
  }
  function _move(index, selectedMap = gameMap.map) {
    _disableFields();
    if (!_isEmpty(selectedMap[index])) return null;
    setTimeout(() => {
      _fillField(index);
      _handleGameAI();
      commentaryController(obj);
    }, 550);
    _removeEventListener(index);
    obj.round++;
    [obj.turn, obj.NextPlayer] = ["X", "O"];
  }
  function _turnHandlerAI(command) {
    if (command) return;
    if (_playerTurn() === "X") {
      obj.AI === "Medium" ? _intermediateAI() : _basicAI();
    } else {
      _useFieldSolo();
    }
  }
  function _useFieldSolo(e) {
    if (e === undefined) return;
    const target = e.target;
    const id = e.target.parentElement.attributes[1].value;
    const mark = (obj.turn = _playerTurn());
    obj.NextPlayer = _nextPlayerTurn();
    target.textContent = mark;
    obj.state = "is playing";
    gameMap.setMark(id, mark);
    target.removeEventListener("click", _useFieldAI, true);
    obj.round++;
    _handleGameAI();
    commentaryController(obj);
    if (obj.gameOver === true) {
      _turnHandlerAI("stop");
    } else {
      _turnHandlerAI();
    }
  }
  function _handleWin() {
    [obj.gameOver, obj.state, obj.winner] = [true, "WON!", _findWinner()];
    jsConfetti.addConfetti(confettiArgs);
  }
  function _handleDraw() {
    [obj.gameOver, obj.state] = ["true", "DRAW!"];
  }
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
    _enableFieldsAI();
    [obj.round, obj.gameOver, obj.state, obj.turn, obj.NextPlayer] = [
      0,
      false,
      "is playing",
      "X",
    ];
    commentaryController(obj);
    if (obj.mode === "AI") {
      obj.AI === "Medium" ? _intermediateAI() : _basicAI();
    } else {
      _useFieldDuo();
    }
  }
  function _checkEmpty() {
    return gameMap.findEmpty();
  }

  function firstOptimalMove() {
    _move(_checkEmpty()[4]);
    _handleGameAI();
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
