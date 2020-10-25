const colors = [
    {color: 'red', rgb: 'rgb(250, 45, 45)'},
    {color: 'orange', rgb: 'rgb(250, 161, 37)'},
    {color: 'yellow', rgb: 'rgb(251, 255, 43)'},
    {color: 'green', rgb: 'rgb(125, 235, 52)'},
    {color: 'blue', rgb: 'rgb(37, 198, 247)'},
    {color: 'purple', rgb: 'rgb(180, 95, 250)'},
    {color: 'pink', rgb: 'rgb(255, 120, 228)'},
    {color: 'black', rgb: 'rgb(0, 0, 0)'}
];

let board = [];

//Generates 12x14 board
function generateBoard() {
    for(var i=0; i<=11; i++) {
        var board_row = $("<div>", {"class": "row board_row"});
        $('.board').append(board_row);
        board.push([]);
        for(var j=0; j<=13; j++) {
            var board_cell = $("<div>", {"class":"col cell", "y":i, "x": j});
            $(board_row).append(board_cell);
            $(board_cell).css("background-color", "white");
            board[i].push('[y='+i+'][x='+j+']')
        }
    }
}

//Selects random color from array
function randomColor() {
    var random_val = Math.floor(Math.random() * colors.length)
    var random_color = colors[random_val].rgb;
    return random_color;
}

//Fills board with random colors, making sure that no two adjacent cells are of the same color, 
//and the player's starting cells are not of the same color.
function generateColors() {
    $(board[11][0]).css("background-color", randomColor());
    var match = true;

    while(match) {
        $(board[0][13]).css("background-color", randomColor());
        if($(board[11][0]).css("background-color") != $(board[0][13]).css("background-color"))
            match = false;
    }

    for (var i=0; i<=11; i++){
		for (var j=0; j<=13.; j++){
			if ((i === 0 && j === 13) || (i === 11 && j === 0)){}
			else {
				match = true;
				while (match){
                    $(board[i][j]).css("background-color", randomColor());
					match = false;
					if (i >= 1){
						if ($(board[i-1][j]).css("background-color") === $(board[i][j]).css("background-color"))
							match = true;
					}
					if (i <= 10){
						if ($(board[i+1][j]).css("background-color") === $(board[i][j]).css("background-color"))
							match = true;
					}
					if (j >= 1){
						if ($(board[i][j-1]).css("background-color") === $(board[i][j]).css("background-color"))
							match = true;
					}
					if (j <= 12){
						if ($(board[i][j+1]).css("background-color") === $(board[i][j]).css("background-color"))
							match = true;
					}
				}
			}
		}
    }
}

//Generates buttons that player can click on to pick their next color
function generateButtons() {
    for(var i=0; i<colors.length; i++) {
        var button = $("<button>", {"class": "col active"});
        $(button).css("background-color", colors[i].rgb);
        $(button).attr("id", colors[i].color);
        $('.buttons').append(button);
    }
}

//Handles what buttons are active or inactive depending on what the player's current colors are
function handleButtons(color1, color2) {
    for(var i=0; i<colors.length; i++) {
        if($('#'+colors[i].color).css("background-color") === color1 || $('#'+colors[i].color).css("background-color") === color2) {
            $('#'+colors[i].color).addClass("inactive");
            $('#'+colors[i].color).removeClass("active");
        } else {
            $('#'+colors[i].color).removeClass("inactive");
            $('#'+colors[i].color).addClass("active");
        }
    }
}

//Returns a list of all the adjacent cells that match the color of a given cell
function adjacentCells(i,j,color) {
    let adjcells = []
    if (i >= 1){
        if ($(board[i-1][j]).css("background-color") === color)
            adjcells.push(board[i-1][j]);
    }
    if (i <= 10){
        if ($(board[i+1][j]).css("background-color") === color)
            adjcells.push(board[i+1][j]);
    }
    if (j >= 1){
        if ($(board[i][j-1]).css("background-color") === color)
            adjcells.push(board[i][j-1]);
    }
    if (j <= 12){
        if ($(board[i][j+1]).css("background-color") === color)
            adjcells.push(board[i][j+1]);
    }
    return adjcells;
}

//Prints out winner and play again button, stops blinking cells and removes turn pointers
function handleGameOver(arr1, arr2, score1, score2) {
    for(var x=0; x < arr1.length; x++) {
        $(arr1[x]).removeClass('blink-bg');
    }
    for(var x=0; x < arr2.length; x++) {
        $(arr2[x]).removeClass('blink-bg');
    }
    $(".p2_turn").removeClass("arrow2");
    $(".p1_turn").removeClass("arrow1");

    $(".buttons").empty()
    var winner_msg = $("<div>", {"class": "col-7 winner"});
    $(".buttons").append(winner_msg);
    if(score1 > score2) {
        $(winner_msg).text("Player 1 wins!"); 
    } else if(score1 < score2) {
        $(winner_msg).text("Player 2 wins!"); 
    } else { 
        $(winner_msg).text("Tie!");
    }
    var button_col = $("<div>", {"class": "col-5"});
    $(".buttons").append(button_col);
    var replay_button = $("<button>", {"class": "playagain", "onClick": "window.location.reload();"});
    $(replay_button).text("Play again");
    $(button_col).append(replay_button);
}

$(document).ready(function(){
    generateBoard();
    generateColors();
    generateButtons();

    //Handles help button to read game rules
    $(".help").hover(
        function() {
            $(".helptext").fadeIn();
        },
        function() {
            $(".helptext").fadeOut();
        }
    )

    //Initializing variables
    let player_cells = [[board[11][0]], [board[0][13]]];
    
    var player_color = [$(board[11][0]).css("background-color"), $(board[0][13]).css("background-color")];
    handleButtons(player_color[0], player_color[1]);

    var turn = 0;
    var player_score = [1, 1];
    $('#p1_score').text(player_score[0]);
    $('#p2_score').text(player_score[1]);

    $(board[11][0]).addClass('blink-bg'); //Player 1's starting cell blinks on their first turn

    //Buttons that are inactive have no pointer-events, so they can't be clicked on
    $("button").click(function() {
        var newcells = [];
        player_color[turn]= $(this).css("background-color"); //Player color becomes color of button clicked
        handleButtons(player_color[0], player_color[1]);

        //Every cell owned by the player changes color and is searched for adjacent cells of the same color
        for(var x=0; x < player_cells[turn].length; x++) {
            var cell = player_cells[turn][x]
            var color = player_color[turn]
            $(cell).css("background-color", color);
            var i = parseInt($(cell).attr("y"));
            var j = parseInt($(cell).attr("x"));
            if(adjacentCells(i,j,color) !== [])
                newcells = newcells.concat(adjacentCells(i,j,color));
        }
        
        //Adjacent cells of the same color are now owned by the player
        for(var k=0; k<newcells.length; k++){
            if(player_cells[0].indexOf(newcells[k]) === -1 && player_cells[1].indexOf(newcells[k]) === -1){
                player_cells[turn].push(newcells[k]);
            }
        }
        player_score[turn] = player_cells[turn].length; //Updating player's score
        
        if(player_score[0] + player_score[1] > 167) { //Game over
            handleGameOver(player_cells[0], player_cells[1], player_score[0], player_score[1]);
        } else if(turn === 0) { //Now it's the other player's turn
            $('#p1_score').text(player_score[0]);
            $(':root').css('--cellColor', player_color[1]);
            for(var x=0; x < player_cells[0].length; x++) {
                $(player_cells[0][x]).removeClass('blink-bg');
            }
            for(var x=0; x < player_cells[1].length; x++) {
                $(player_cells[1][x]).addClass('blink-bg');
            }
            turn = 1;
            $(".p1_turn").removeClass("arrow1");
            $(".p2_turn").addClass("arrow2");
        } else {
            $('#p2_score').text(player_score[1]);
            for(var x=0; x < player_cells[1].length; x++) {
                $(player_cells[1][x]).removeClass('blink-bg');
            }
            for(var x=0; x < player_cells[0].length; x++) {
                $(player_cells[0][x]).addClass('blink-bg');
            }
            turn = 0;
            $(".p2_turn").removeClass("arrow2");
            $(".p1_turn").addClass("arrow1");
        }
    })
});