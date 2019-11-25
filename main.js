$(document).ready(initalizeApp);

var player1Click = null;
var player2Click = null;

function initalizeApp(){
  $('.square').on('click', clickConnect);
}

//when you click on a square, you want to add a class of
function clickConnect (event){
  if (player1Click === null){
  $(event.currentTarget).addClass('red')
  } else {
    player2Click === null;
    $(event.currentTarget).addClass('yellow')
  }
}
