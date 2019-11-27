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


function initalizeApp(){
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
  $(".modalStart").on("click", function(){
    $(".modalStart").addClass("closeModal")
  });
  //$('.choiceContainer').on('click', $('.choice'), playerSelect);
  gameStartSound.play();
  backgroundMusic.play();
}

function tieGame(){
  if(turnCounter >= 43){
    resetGameKeepStats();
    //insert a modal? Reset game?
  }
}

function clickConnect2(event) {
  if (gameboardLock){
    return;
  }
  var currentSquareCol = $(event.currentTarget).attr("col");
  for (var loopThroughCol = 6; loopThroughCol >= 1; loopThroughCol--) {

    var searchRow = "[row=" + loopThroughCol + "]";
    var searchCol = "[col=" + currentSquareCol + "]";
    var combined = searchCol + searchRow;
    var rowAndCol = $(combined);
    console.log(rowAndCol)
    if (!rowAndCol.hasClass('red') && !rowAndCol.hasClass('yellow')) {
      if (turnCounter % 2 === 1) {
        rowAndCol.addClass('red').addClass('fall');
      chipDropSoundRed.play()
      turnCounter += 1;
      checkConnect();

        console.log("red", turnCounter);

      tieGame();

      return;
      }else {
        //yellowDrop();
        rowAndCol.addClass('yellow').addClass('fall');
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



//check if there are consecutive 4 chips on the game board
//variables: 4 counters that goes up 1 individually when there are consecutive

//same color on their respective direction: vertical, horizontal, 2 diagnal
//directions; 4 variables that stores previous direction color
//do 1 loops for game board size
//in the loop, search for classes indicating each direction
//if the class shows up is the same as the previous one, counter goes up 1
//if the class is different from the previous class, counter reset to 0
//if counter goes to 4, call game winning function and exit the code block
function checkConnect() {
  // var rowColorCounter = null, colColorCoutner = null,
  //   topLeftDiaColorCounter = null, botLeftDiaColorCounter = null;
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
      //console.log("current square: ", $(square[j]));
      //console.log("current selector: ", selector );
      //console.log("current value: " + $(square[j]).attr(selector) + ", " + i);
      if (parseInt($(square[j]).attr(selector)) === i+1) {
        //console.log("matched! " + selector);
        if ($(square[j]).hasClass('red')) {
          currentColor = 'red';
        } else if ($(square[j]).hasClass('yellow')) {
          currentColor = 'yellow';
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

          //win condition
          console.log("you won the game!");
        }
        //console.log("currentColor: " + currentColor + ", " + colorCounter);
        prevColor = currentColor;
      }
    }
    //console.log("colorCounter: ", colorCounter);
    colorCounter = 0;
  }
}

//DOM Creation
//Create 42 space inside gamespace
//Each with at least 4 tags indicating their location
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

function resetGameKeepStats(){
  gameboardLock = true;
  addPlayerStats();
  gamesPlayed++;
  $('.player1Info').text(player1Wins);
  $('.player2Info').text(player2Wins);
  $('.gameInfo').text(gamesPlayed);

  setTimeout(function() {
  if ($('.square').hasClass('red') || $('.square').hasClass('yellow')){
    $('.square').removeClass('red');
    $('.square').removeClass('yellow');
  }
    gameboardLock = false;
  }, 1000);
  turnCounter = 1;
  gameStartSound.play()
}
var backgroundMusic = new Audio("assets/John Williams - The Battle of Crait (From _Star Wars_ The Last Jedi_-Audio Only).mp3");
var chipDropSoundRed = new Audio("assets/New Recording 7.m4a");
var chipDropSoundYellow = new Audio("assets/New Recording 7.m4a");
var gameStartSound= new Audio("assets/New Recording 10.m4a"); // buffers automatically when created
 // Use this sounds when the game starts over or resets

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
  console.log("no selector found");
  target.addClass('selected1');
  if (target.hasClass('iconSelectionImage')) {
    iconChoice[0] = target.attr('choice');
  } else {
    colorChoice[0] = target.attr('choice');
  }
}
function addPlayerStats(){
  if (turnCounter % 2 === 1) {
    player1Wins++;
  } else {
    player2Wins++;
  }
}

// function resetGameAndStats(){
//   setTimeout(function () {
//     if ($('.square').hasClass('red') || $('.square').hasClass('yellow')) {
//       $('.square').removeClass('red');
//       $('.square').removeClass('yellow');
//     }
//   }, 1000);
// }

//include a tied factor. if the game ties
