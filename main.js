$(document).ready(initalizeApp);

var player1Click = null;
var player2Click = null;

function initalizeApp(){
  $('.square').on('click', clickConnect);
  createSquare();
}

//when you click on a square, you want to add a class of
function clickConnect (event){
  if (player1Click === null){
  $(event.currentTarget).addClass('red')
  } else {
    player2Click === null;
    $(event.currentTarget).addClass('yellow')


//check if there are consecutive 4 chips on the game board
//variables: 4 counters that goes up 1 individually when there are consecutive
//same color on their respective direction: vertical, horizontal, 2 diagnal
//directions; 4 variables that stores previous direction color
//do 1 loops for game board size
//in the loop, search for classes indicating each direction
//if the class shows up is the same as the previous one, counter goes up 1
//if the class is different from the previous class, counter reset to 0
//if counter goes to 4, call game winning function and exit the code block
// function checkConnect() {
//   var rowColorCounter = null, colColorCoutner = null,
//     topLeftDiaColorCounter = null, botLeftDiaColorCounter = null;
//   for (var index = 0; index < 42; index++) {
//     if ()
//   }
// }

//DOM Creation
//Create 42 space inside gamespace
//Each with at least 4 tags indicating their location
function createSquare() {
  var gameSpace = $('.gamespace');
  var topLeftDiaCalc = 6;
  var botLeftDiaCalc = 1;
  for (var col = 0; col < 7; col++) {
    var colCount = 'col' + (col+1);
    var newCol = $('<div>').addClass('col').addClass(colCount);
    for (var row = 0; row < 6; row++) {
      var rowCount = 'row' + (row+1);
      var topLeftDiaCount = 'topLeftDia' + topLeftDiaCalc;
      var botLeftDiaCount = 'botLeftDia' + botLeftDiaCalc;
      var newSquare = $('<div>').addClass('square').addClass(rowCount)
        .addClass(colCount).addClass(topLeftDiaCount).addClass(botLeftDiaCount);
      newCol.append(newSquare);
      topLeftDiaCalc--;
      botLeftDiaCalc++;
    }
    topLeftDiaCalc += 7;
    botLeftDiaCalc -= 5;
    gameSpace.append(newCol);
  }
}
