$(document).ready(initalizeApp);

var turnCounter = 1;
var gamesPlayed = 0;
var colorAmount = 7, iconAmount = 27;
var colorOption = ["red", "yellow", "green", "blue", "chartreuse", "hotPink", "rebeccaPurple"];
var iconOption = [];
var colorChoice = ["red", "yellow"];
var iconChoice = ["icon3", "icon4"];
var player1Wins = 0;
var player2Wins = 0;
var gameboardLock = false;

function initalizeApp() {
  var modal = $('.optionModal');
  createSquare();
  $('.square').on('click', clickConnect2);
  $('.option.button').click(function() {
    modal.addClass('show').removeClass('hide');
    modalCreation(colorAmount, iconAmount);
  });
  $('.close').click(function() {
    modal.removeClass('show').addClass('hide');
    modalRemove();
  });
  $(".modalStart").on("click", function() {
    $(".modalStart").addClass("closeModal")
    gameStartSound.play();
    backgroundMusic.play();
  });
  $('.resetGameBoardOnly').on('click', resetGame);
  $('.resetStatsAndGame').on('click', startGameOverNoStats);
}


function tieGame() {
  if(turnCounter >= 43) {
    resetGameKeepStats();
  }
}

function clickConnect2(event) {
  $('.option.button').off();
  if (gameboardLock) {
    return;
  }
  var currentSquareCol = $(event.currentTarget).attr("col");
    for (var loopThroughCol = 6; loopThroughCol >= 1; loopThroughCol--) {
      var searchRow = "[row=" + loopThroughCol + "]";
      var searchCol = "[col=" + currentSquareCol + "]";
      var combined = searchCol + searchRow;
      var rowAndCol = $(combined);
      console.log(rowAndCol)
    if (!rowAndCol.hasClass(colorChoice[0]) && !rowAndCol.hasClass(colorChoice[1])) {
      if (turnCounter % 2 === 1) {
        rowAndCol.addClass(colorChoice[0]).addClass(colorChoice[0] + 'Icon')
          .addClass(iconChoice[0]).addClass('fall');
        chipDropSoundRed.play()
        turnCounter += 1;
        checkConnect();
        console.log("red", turnCounter);
        tieGame();
        return;
      } else {
        //yellowDrop();
        rowAndCol.addClass(colorChoice[1]).addClass(colorChoice[1] + 'Icon')
          .addClass(iconChoice[1]).addClass('fall');
        chipDropSoundYellow.play()
        turnCounter += 1;
        checkConnect();
        console.log("yellow", turnCounter);
        tieGame();
        return;
       }
    }
    }
}


function checkConnect() {
  var gameSpace = $('.gamespace'), square = gameSpace.find('.square');
  checkLoop(square, 'row');
  checkLoop(square, 'col');
  checkLoop(square, 'topLeftDia');
  checkLoop(square, 'botLeftDia');
}

function checkLoop(square, selector) {

  var colorCounter = null, loopCount = null, currentColor = null, prevColor = null;
  if (selector === 'row') {
    loopCount = 6;
  } else if (selector === 'col') {
    loopCount = 7;
  } else {
    loopCount = 12;
  }
  for (var i = 0; i < loopCount; i++) {
    for (var j = 0; j < 42; j++) {
      if (parseInt($(square[j]).attr(selector)) === i+1) {
        if ($(square[j]).hasClass(colorChoice[0])) {
          currentColor = colorChoice[0];
        } else if ($(square[j]).hasClass(colorChoice[1])) {
          currentColor = colorChoice[1];
        } else {
          currentColor = 'empty';
        }
        if (currentColor === 'empty') {
          colorCounter = 0;
        } else if (currentColor !== prevColor) {
          colorCounter = 1;
        } else if (currentColor === prevColor) {
          colorCounter++;
        }
        if (colorCounter === 4) {
          resetGameKeepStats();
          console.log("you won the game!");
        }
        prevColor = currentColor;
      }
    }
    colorCounter = 0;
  }
}


function createSquare() {
  var gameSpace = $('.gamespace');
  var topLeftDiaCalc = 6;
  var botLeftDiaCalc = 1;
  for (var col = 0; col < 7; col++) {
    var colCount = col + 1;
    var newCol = $('<div>').addClass('col').addClass(colCount);
    for (var row = 0; row < 6; row++) {
      var rowCount = row + 1;
      var topLeftDiaCount = topLeftDiaCalc;
      var botLeftDiaCount = botLeftDiaCalc;
      var newSquare = $('<div>').addClass('square').attr('row', rowCount)
        .attr('col', colCount).attr('topLeftDia', topLeftDiaCount)
        .attr('botLeftDia', botLeftDiaCount);
      newCol.append(newSquare);
      topLeftDiaCalc--;
      botLeftDiaCalc++;
    }
    topLeftDiaCalc += 7;
    botLeftDiaCalc -= 5;
    gameSpace.append(newCol);
  }
}

function resetGameKeepStats() {
  gameboardLock = true;
  addPlayerStats();
  gamesPlayed++;
  $('.player1Info').text(player1Wins);
  $('.player2Info').text(player2Wins);
  $('.gameInfo').text(gamesPlayed);

  setTimeout(function () {
    if ($('.square').hasClass(colorChoice[0]) || $('.square').hasClass(colorChoice[1])) {
      $('.square').removeClass(colorChoice[0]).removeClass(colorChoice[0] + 'Icon')
        .removeClass(iconChoice[0]);
      $('.square').removeClass(colorChoice[1]).removeClass(colorChoice[1] + 'Icon')
        .removeClass(iconChoice[1]);
    }
    $('.square').removeClass('fall')
    gameboardLock = false;
  }, 1000);
  turnCounter = 1;
  $('.option.button').click(function () {
    $('.optionModal').addClass('show').removeClass('hide');
    modalCreation(colorAmount, iconAmount);
  });
  gameStartSound.play();
}

var backgroundMusic = new Audio("assets/John Williams - The Battle of Crait (From _Star Wars_ The Last Jedi_-Audio Only).mp3");
var chipDropSoundRed = new Audio("assets/New Recording 7.m4a");
var chipDropSoundYellow = new Audio("assets/New Recording 7.m4a");
var gameStartSound= new Audio("assets/New Recording 10.m4a");

function modalCreation(colorNum, iconNum) {
  var colorContainer = $('.color.choiceContainer');
  var iconContainer = $('.icon.choiceContainer');
  for (var i = 0; i < colorNum; i++) {
    var newDiv = $('<div>').addClass('choice').addClass(colorOption[i])
      .attr('choice', colorOption[i]);
    colorContainer.append(newDiv);
  }
  for (var i = 0; i < iconNum; i++) {
    iconOption.push("icon" + i);
    var newDiv2 = $('<div>').addClass('choice').addClass('iconSelectionImage')
      .addClass(iconOption[i]).attr('choice', iconOption[i]);
    iconContainer.append(newDiv2);
  }
  $('.choice').click(playerSelect);
}

function modalRemove() {
  $('.choiceContainer > *').remove();
  $('.choice').off(playerSelect);
}

function playerSelect(event) {
  console.log("running playerSelect");
  var colorDiv = $('.color > .choice');
  var iconDiv = $('.icon > .choice');
  var target = $(event.currentTarget);
  if (target.hasClass('iconSelectionImage')) {
    iconCheck(iconDiv, iconAmount, target);
  } else {
    iconCheck(colorDiv, colorAmount, target);
    }
  console.log(target);
}

function iconCheck(targetDiv, targetAmount, target) {
  console.log("iconCheck works!");
  for (var i = 0; i < targetAmount; i++) {
    console.log("first for loop");
    if ($(targetDiv[i]).hasClass('selected2')) {
      for (var j = 0; j < targetAmount; j++) {
        if ($(targetDiv[j]).hasClass('selected1')) {
          if (target.hasClass('selected1')) {
            target.removeClass('selected1');
            if (target.hasClass('iconSelectionImage')) {
              iconChoice[0] = "";
            } else {
              colorChoice[0] = "";
            }
          } else {
            target.removeClass('selected2');
            if (target.hasClass('iconSelectionImage')) {
              iconChoice[1] = "";
            } else {
              colorChoice[1] = "";
            }
          }
          return;
        }
      }
      if (target.hasClass('selected2')) {
        target.removeClass('selected2');
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[1] = target.attr('choice');
        } else {
          colorChoice[1] = target.attr('choice');
        }
      } else {
        target.addClass('selected1');
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[0] = target.attr('choice');
        } else {
          colorChoice[0] = target.attr('choice');
        }
      }
      return;
    }
  }
  for (var i = 0; i < targetAmount; i++) {
    console.log("second for loop");
    if ($(targetDiv[i]).hasClass('selected1')) {
      if (target.hasClass('selected1')) {
        target.removeClass('selected1');
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[0] = "";
        } else {
          colorChoice[0] = "";
        }
      } else {
        target.addClass('selected2');
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[1] = target.attr('choice');
        } else {
          colorChoice[1] = target.attr('choice');
        }
      }
      return;
    }
  }

  target.addClass('selected1');
  if (target.hasClass('iconSelectionImage')) {
    iconChoice[0] = target.attr('choice');
  } else {
    colorChoice[0] = target.attr('choice');
    }
}

function addPlayerStats(){
  if (turnCounter % 2 === 0) {
    player1Wins++;
  } else {
    player2Wins++;
  }
}

function resetGame() {
  if ($('.square').hasClass(colorChoice[0]) || $('.square').hasClass(colorChoice[1])) {
    $('.square').removeClass(colorChoice[0]).removeClass(colorChoice[0] + 'Icon')
      .removeClass(iconChoice[0]);
    $('.square').removeClass(colorChoice[1]).removeClass(colorChoice[1] + 'Icon')
      .removeClass(iconChoice[1]);
  }
}


function startGameOverNoStats() {
  resetGame();
  player1Wins=0;
  player2Wins=0;
  gamesPlayed=0;
  $('.player1Info').text(player1Wins);
  $('.player2Info').text(player2Wins);
  $('.gameInfo').text(gamesPlayed);
}
