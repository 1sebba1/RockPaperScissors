import GameObj from "./game.js";

const Game = new GameObj();

const initApp = () => {
  //All time data
  initAllTimeData();

  //update scoreboard
  updateScoreboard();

  //listen for player choice
  listenForPlayerChoice();

  //listen for enter key
  listenForEnterKey();

  //listen for play again
  listenForPlayAgain();

  //lock the gameboard height
  lockComputerGameBoardHeight();
  // set focus to start new game
  document.querySelector("h1").focus();
};

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeData = () => {
  Game.setP1AllTime(parseInt(localStorage.getItem("p1AllTime")) || 0);
  Game.setCPAllTime(parseInt(localStorage.getItem("cpAllTime")) || 0);
};

const updateScoreboard = () => {
  const p1AllTimeScore = document.getElementById("p1_all_time_score");
  p1AllTimeScore.textContent = Game.getP1AllTime();
  p1AllTimeScore.ariaLabel = `Player One All Time Score is ${Game.getP1AllTime()}`;

  const cpAllTimeScore = document.getElementById("cp_all_time_score");
  cpAllTimeScore.textContent = Game.getCPAllTime();
  cpAllTimeScore.ariaLabel = `Computer All Time Score is ${Game.getCPAllTime()}`;

  const p1SessionScore = document.getElementById("p1_session_score");
  p1SessionScore.textContent = Game.getP1Session();
  p1SessionScore.ariaLabel = `Player One Session Score is ${Game.getP1Session()}`;

  const cpSessionScore = document.getElementById("cp_session_score");
  cpSessionScore.textContent = Game.getCPSession();
  cpSessionScore.ariaLabel = `Computer Session Score is ${Game.getCPSession()}`;
};

const listenForPlayerChoice = () => {
  const p1Images = document.querySelectorAll(
    ".playerboard .gameboard__square img"
  );
  p1Images.forEach((img) => {
    img.addEventListener("click", (e) => {
      if (Game.getActiveStatus()) {
        console.log("Game in progress, wait for it to finish");
        return;
      }
      Game.startGame();
      console.log("Game started");
      const playerChoice = e.target.parentElement.id;
      updateP1Message(playerChoice);
      p1Images.forEach((img) => {
        if (img === e.target) {
          img.parentElement.classList.add("selected");
        } else {
          img.parentElement.classList.add("not-selected");
        }
      });

      computerAnimationSequence(playerChoice);
    });
  });
};

const listenForEnterKey = () => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "IMG") {
      e.target.click();
    }
  });
};

const listenForPlayAgain = () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    resetBoard(); // TODO: implement resetBoard function
  });
};

const lockComputerGameBoardHeight = () => {
  const cpGameBoard = document.querySelector(".computerboard .gameboard");
  const CpGBStyles = getComputedStyle(cpGameBoard);
  const height = CpGBStyles.getPropertyValue("height");
  cpGameBoard.style.minHeight = height;
};

const updateP1Message = (choice) => {
  let p1msg = document.getElementById("p1msg").textContent;
  p1msg += `${choice[0].toUpperCase()}${choice.slice(1)}`;
  document.getElementById("p1msg").textContent = p1msg;
  document.getElementById("p1msg").ariaLabel = p1msg;
};

const computerAnimationSequence = (playerChoice) => {
  let interval = 1000;
  setTimeout(() => computerChoiceAnimation("cp_rock", 1), interval);
  setTimeout(() => computerChoiceAnimation("cp_paper", 2), (interval += 500));
  setTimeout(
    () => computerChoiceAnimation("cp_scissors", 3),
    (interval += 500)
  );
  setTimeout(() => countdownFade(), (interval += 750));
  setTimeout(() => {
    deleteCountdown();
    finishGameFlow(playerChoice);
  }, (interval += 750));
  setTimeout(() => askUserToPlayAgain(), (interval += 1000));
};

const computerChoiceAnimation = (elementId, number) => {
  const element = document.getElementById(elementId);
  element.firstElementChild.remove();
  const p = document.createElement("p");
  p.textContent = number;
  element.appendChild(p);
};

const countdownFade = () => {
  const countdown = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countdown.forEach((num) => {
    num.className = "fadeOut";
  });
};

const deleteCountdown = () => {
  const countdown = document.querySelectorAll(
    ".computerboard .gameboard__square p"
  );
  countdown.forEach((num) => {
    num.remove();
  });
};

const askUserToPlayAgain = () => {
  const playAgain = document.getElementById("play_again");
  playAgain.classList.toggle("hidden");
  playAgain.focus();
};

const resetBoard = () => {
  const gameboardSquares = document.querySelectorAll(".gameboard div");
  gameboardSquares.forEach((square) => {
    square.classList.remove("selected", "not-selected", "winner", "loser");
  });
};
