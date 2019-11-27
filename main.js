$(document).ready(initalizeApp);

var turnCounter = 1;
var gamesPlayed = 0;

function initalizeApp(){
  createSquare();
  $('.square').on('click', clickConnect2);
  gameStartSound.play();
  backgroundMusic.play();

}

function tieGame(){
  if(turnCounter >= 43){
    resetStats();
    //insert a modal? Reset game?
  }
}

function clickConnect2(event) {
  var currentSquareCol = $(event.currentTarget).attr("col");
  for (var loopThroughCol = 6; loopThroughCol >= 1; loopThroughCol--) {
    var searchRow = "[row=" + loopThroughCol + "]";
    var searchCol = "[col=" + currentSquareCol + "]";
    var combined = searchCol + searchRow;
   var rowAndCol = $(combined);
   console.log(rowAndCol)
    if (!rowAndCol.hasClass('red') && !rowAndCol.hasClass('yellow')){
      if (turnCounter % 2 === 1) {
        rowAndCol.addClass('red').addClass('fall');
      chipDropSoundRed.play()
      turnCounter += 1;
      checkConnect();
      tieGame();
      return;
      }else {
        //yellowDrop();
        rowAndCol.addClass('yellow').addClass('fall');
      chipDropSoundYellow.play()
      turnCounter += 1;
      checkConnect();
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
  //debugger;
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
          resetStats();
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


function resetStats(){
  gamesPlayed++;
  $('.gameInfo').text(gamesPlayed);
  setTimeout(function() {
  if ($('.square').hasClass('red') || $('.square').hasClass('yellow')){
    $('.square').removeClass('red');
    $('.square').removeClass('yellow');
  }}, 1000);
  turnCounter = 1;
  gameStartSound.play()
}
var backgroundMusic = new Audio("assets/John Williams - The Battle of Crait (From _Star Wars_ The Last Jedi_-Audio Only).mp3");
var chipDropSoundRed = new Audio("assets/New Recording 7.m4a");
var chipDropSoundYellow = new Audio("assets/New Recording 7.m4a");
var gameStartSound= new Audio("assets/New Recording 10.m4a"); // buffers automatically when created
 // Use this sounds when the game starts over or resets


//include a tied factor. if the game ties
