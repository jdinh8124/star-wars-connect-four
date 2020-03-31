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

//connect the event handlers and create game board
function initalizeApp(){
  var modal = $('.optionModal');
  createSquare();
  $('.square').on('click', clickConnect2);

  $('.square').mouseover(colorHover);
  $('.square').mouseout(function () {
     $(this).css("box-shadow", "0 0 0 0")
  })
  // $('.square').mouseover(function(){
  //   $(this).css("box-shadow", "0 0 40px 30px " + colorChoice[0] + ""),
  //   $('.square').mouseout(function(){
  //       $(this).css("box-shadow", "0 0 0 0");
  //     })
  // });

  $('.option.button').click(function() {
    modal.addClass('show').removeClass('hide');
    modalCreation(colorAmount, iconAmount);
    $('.option.button').off();
  });
  $('.close').click(function() {
    modal.removeClass('show').addClass('hide');
    modalRemove();
    $('.option.button').click(function () {
      modal.addClass('show').removeClass('hide');
      modalCreation(colorAmount, iconAmount);
      $('.option.button').off();
    });
  });
  $(".modalStart").on("click", function() {
    $(".modalStart").addClass("closeModal")
  });
  $('.resetGameBoardOnly').on('click', resetGame);
  $('.resetStatsAndGame').on('click', startGameOverNoStats);
}

//color hover
function colorHover(event){
  var player1color = "0 0 40px 30px #fff" + "," + "0 0 40px 30px " + colorChoice[1] +
   "," + "0 0 100px 60px #0ff";
  var player2color ="0 0 40px 30px #fff" + "," + "0 0 40px 30px " + colorChoice[0] +
    "," + "0 0 100px 60px #0ff";
  if(turnCounter % 2 == 0){
    $(event.currentTarget).css( "box-shadow", player1color );
  }else{
    $(event.currentTarget).css(
      "box-shadow", player2color
    )
  }
}


//if the game board is filled, reset the game
function tieGame(){
  if(turnCounter >= 43){
    player2Wins--;
    resetGameKeepStats();
  }
}

function clickConnect2(event) {
  //when the game start, disable the option button
  $('.option.button').off();
  if (gameboardLock) {
    return;
  }
  var currentSquareCol = $(event.currentTarget).attr("col");
  if (turnCounter % 2 === 0) {
    $('.player1').addClass('addBorder');
    $('.player2').removeClass('addBorder');
  } else {
    $('.player2').addClass('addBorder');
    $('.player1').removeClass('addBorder');
  }
  for (var loopThroughCol = 6; loopThroughCol >= 1; loopThroughCol--) {
    var searchRow = "[row=" + loopThroughCol + "]";
    var searchCol = "[col=" + currentSquareCol + "]";
    var combined = searchCol + searchRow;
    var rowAndCol = $(combined);

    if (!rowAndCol.hasClass(colorChoice[0]) && !rowAndCol.hasClass(colorChoice[1])) {
      if (turnCounter % 2 === 1) {
        rowAndCol.addClass(colorChoice[0]).addClass(colorChoice[0] + 'Icon')
          .addClass(iconChoice[0]).addClass('fall');
        chipDropSoundRed.play();
        turnCounter += 1;
        checkConnect();
        tieGame();
        return;
      } else {
        rowAndCol.addClass(colorChoice[1]).addClass(colorChoice[1] + 'Icon')
          .addClass(iconChoice[1]).addClass('fall');
        chipDropSoundYellow.play();
        turnCounter += 1;
        checkConnect();
        tieGame();
        return;
       }
    }
    }
}


//run checkLoop 4 times on all possible directions 4 chips can connect

function checkConnect() {
  var gameSpace = $('.gamespace'), square = gameSpace.find('.square');
  checkLoop(square, 'row');
  checkLoop(square, 'col');
  checkLoop(square, 'topLeftDia');
  checkLoop(square, 'botLeftDia');
}

//check on the provided direction if there are 4 connected chips with the same
//color
function checkLoop(square, selector) {
  var colorCounter = null, loopCount = null, currentColor = null, prevColor = null;
  //set appropriate loop number for different direction
  if (selector === 'row') {
    loopCount = 6;
  } else if (selector === 'col') {
    loopCount = 7;
  } else {
    loopCount = 12;
  }
  //loop through the provided groups, then loop through all the squares
  // check if the squares on actually on the current group
  // if yes, check if there's any color existing
  // if also yes, check if the color match the previous checked color
  // counter goes up 1 if there's matched color that's connected
  // reset counter if colors are different or if the square is empty
  // if counter goes to 4, player wins the game
  // save current color as previous checked color
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

var chipDropSoundRed = new Audio("assets/New Recording 7.m4a");
var chipDropSoundYellow = new Audio("assets/New Recording 7.m4a");
var gameStartSound= new Audio("assets/New Recording 10.m4a");

 //Use DOM creation to create spots for the modal
function modalCreation(colorNum, iconNum) {
  var colorContainer = $('.color.choiceContainer');
  var iconContainer = $('.icon.choiceContainer');
  for (var i = 0; i < colorNum; i++) {
    var newDiv = $('<div>').addClass('choice').addClass(colorOption[i])
      .attr('choice', colorOption[i]);
    colorContainer.append(newDiv);
  }
  for (let i = 0; i < iconNum; i++) {
    iconOption.push("icon" + i);
    var newDiv2 = $('<div>').addClass('choice').addClass('iconSelectionImage')
      .addClass(iconOption[i]).attr('choice', iconOption[i]);
    iconContainer.append(newDiv2);
  }
  $('.choice').click(playerSelect);
}

//Remove modal when closed
function modalRemove() {
  $('.choiceContainer > *').remove();
  $('.choice').off(playerSelect);
}

//Link iconCheck to save user's selection on color and icon
function playerSelect(event) {
  var colorDiv = $('.color > .choice');
  var iconDiv = $('.icon > .choice');
  var target = $(event.currentTarget);
  if (target.hasClass('iconSelectionImage')) {
    iconCheck(iconDiv, iconAmount, target);
  } else {
    iconCheck(colorDiv, colorAmount, target);
    }
  }


//Save player's selection on the modal
// first click is set to be player1, second for player2
// both can be cancelled and reselect
function iconCheck(targetDiv, targetAmount, target) {
  for (var i = 0; i < targetAmount; i++) {
    //if any of the icon is selected by player2
    if ($(targetDiv[i]).hasClass('selected2')) {
      for (var j = 0; j < targetAmount; j++) {
        //if any of the icon is also selected by player1
        if ($(targetDiv[j]).hasClass('selected1')) {
          //if the user is currently clicking player1's selection
          // remove the selection
          if (target.hasClass('selected1')) {
            target.removeClass('selected1').text("");
            //remove the selection from iconChoice and colorChoice
            if (target.hasClass('iconSelectionImage')) {
              iconChoice[0] = "";
            } else {
              colorChoice[0] = "";
            }
          } else {
            //cancel player2's selection if that's the target instead
            target.removeClass('selected2').text("");
            if (target.hasClass('iconSelectionImage')) {
              iconChoice[1] = "";
            } else {
              colorChoice[1] = "";
            }
          }
          return;
        }
      }
      //if player1 hasn't selected anything, only player2 has
      if (target.hasClass('selected2')) {
        //remove player2's selection if that's the target
        target.removeClass('selected2').text("");
        //probably should be remove instead of add, but the code is currently
        //working and I don't have time to further test it
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[1] = target.attr('choice');
        } else {
          colorChoice[1] = target.attr('choice');
        }
      } else {
        //if player selected an unselected icon, save it as player1's selection
        target.addClass('selected1').text("P1");
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[0] = target.attr('choice');
        } else {
          colorChoice[0] = target.attr('choice');
        }
      }
      return;
    }
  }
  //if player1 has already made a selection but player2 hasn't
  for (let i = 0; i < targetAmount; i++) {
    if ($(targetDiv[i]).hasClass('selected1')) {
      //if the user is clicking at player1's selection
      if (target.hasClass('selected1')) {
        target.removeClass('selected1').text("");
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[0] = "";
        } else {
          colorChoice[0] = "";
        }
      } else {
        //if user is clicking at an unselected icon
        target.addClass('selected2').text("P2");
        if (target.hasClass('iconSelectionImage')) {
          iconChoice[1] = target.attr('choice');
        } else {
          colorChoice[1] = target.attr('choice');
        }
      }
      return;
    }
  }


  //if both player1 and player2 hasn't selceted anything
  // add the selection as player1's selection

  target.addClass('selected1').text("P1");
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
  var modal = $('.optionModal');
  if ($('.square').hasClass(colorChoice[0]) || $('.square').hasClass(colorChoice[1])) {
    $('.square').removeClass(colorChoice[0]).removeClass(colorChoice[0] + 'Icon')
      .removeClass(iconChoice[0]);
    $('.square').removeClass(colorChoice[1]).removeClass(colorChoice[1] + 'Icon')
      .removeClass(iconChoice[1]);
  }
  $('.option.button').click(function () {
    modal.addClass('show').removeClass('hide');
    modalCreation(colorAmount, iconAmount);
  });
  $(".square").removeClass("fall")
}


function startGameOverNoStats(){
  resetGame();
  player1Wins = 0;
  player2Wins = 0;
  gamesPlayed = 0;
  $('.player1Info').text(player1Wins);
  $('.player2Info').text(player2Wins);
  $('.gameInfo').text(gamesPlayed);
}
