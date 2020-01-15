window.onload = function() {watch()};
function watch() {
    var btn = document.getElementById("btnStop");
    btnDisabled(btn);
}




/*******************************************
 * When the game starts, see who goes first.
 *******************************************/
function rollForTurn() {
    var xArray = [];
    var ranNum = "";
    var minimum = 1;
    var maximum = 11;
    var first = "";
    var txt1 = "";

    //Roll the dice
    for (var i = 0; i < 2; i++) {
        ranNum = Math.floor(Math.random()*(maximum - minimum) + minimum);
        xArray.push(ranNum);
    }
    diceRoll();

    //Determine who is first.
    for (i = 0; i < xArray.length; i++) {
        var result = i + 1;     //This is not used
        var pOne = xArray[0];
        var pTwo = xArray[1];

        /****************************
         * Rigging the game to avoid tie.
         * You can just roll again...
         ***************************/
        if (pOne == pTwo) {
            pOne = 1;
            pTwo = 2;
        }
        txt1 = "Player 1 rolled [" + pOne + "]<br>";
        writeMsg(txt1);
        txt1 += "Player 2 rolled [" + pTwo + "]<br><br>";
        setTimeout(function() {writeMsg(txt1);}, 1000)
    }

    if (pOne > pTwo) {
        first = "Player 1";
        setTimeout(function() {txt1 += "Player 1 wins, please choose a square.";}, 2000);
        setTimeout(function() {writeMsg(txt1);}, 2000);
    } else {
        first = "Player 2";
        setTimeout(function() {txt1 += "Player 2 wins, please choose a square.";}, 2000);
        setTimeout(function() {writeMsg(txt1);}, 2000);
    }

    return first;
}


/******************************************
 * The game starts when the player hits the start button
 ******************************************/
function startGame() {
    var xTurn = 0;

    //This was never declared.
    activePlayer = rollForTurn();
    if (activePlayer == "") {
        activePlayer = rollForTurn();
    }
    setTimeout(function() {hideGameMsg();}, 4000);

    var btn = document.getElementById("btnStart");
    btnDisabled(btn);
    var btn = document.getElementById("btnStop");
    stopEnabled(btn);

    var showPlayer = document.getElementById("showPlayer");
    showPlayer.innerHTML = activePlayer;
    showPlayer.style.color = "green";
}


function btnDisabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(153, 153, 102)";
    btn.style.backgroundColor = "rgb(214, 214, 194)";
    btn.disabled = true;
}

function stopEnabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(204,0,0)";
    btn.style.backgroundColor = "rgb(205,51,51)";
    btn.disabled = false;
}

function startEnabled(btn) {
    btn.style.color = "#fff";
    btn.style.border = "2px solid rgb(0,153,0)";
    btn.style.backgroundColor = "rgb(57,230,0)";
    btn.disabled = false;
}



function stopGame() {
    hideGameMsg();
    var btn = document.getElementById("btnStart");
    startEnabled(btn);
    var btn = document.getElementById("btnStop");
    btnDisabled(btn);

    var showPlayer = document.getElementById("showPlayer");
    showPlayer.innerHTML = "Game Stopped";
    showPlayer.style.color = "red";

    var arrayO = document.getElementsByClassName("O");
    var arrayX = document.getElementsByClassName("X");
    for (var i = 0; i < arrayO.length; i++) {
        arrayO[i].style.transform = "translateY(-100%)";
        arrayX[i].style.transform = "translateY(100%)";
    }

    document.getElementById("boardState").innerHTML = "";
}



function showGameMsg() {
    document.getElementById("gameMsgBox").style.display = "block";
}
function hideGameMsg() {
    clearMsg();
    document.getElementById("gameMsgBox").style.display = "none";
}
function writeMsg(txt) {
    showGameMsg();
    document.getElementById("gameMsg").innerHTML = txt;
}
function clearMsg() {
    document.getElementById("gameMsg").innerHTML = "";
}



//Save Config button | Players pick O or X
function saveSettings() {
    var p1Index = document.getElementById("player1").selectedIndex;
    var p1Selected = document.getElementById("player1").options;
    var p2Index = document.getElementById("player2").selectedIndex;
    var p2Selected = document.getElementById("player2").options;

    if (p1Selected[p1Index].text == p2Selected[p2Index].text) {
        alert("Player 1 and Player 2 cannot be assigned " + p1Selected[p1Index].text);
    } else {
        document.getElementById("p1Display").innerHTML = p1Selected[p1Index].text;
        document.getElementById("p2Display").innerHTML = p2Selected[p2Index].text;
    }
}



function getAvatars() {
    var p1Avatar = document.getElementById("p1Display").innerHTML;
    var p2Avatar = document.getElementById("p2Display").innerHTML;
    var avatarArray = [p1Avatar,p2Avatar];
    return avatarArray;
}



function determineAvatar() {
    var avatarArray = getAvatars();
    var active = document.getElementById("showPlayer").innerHTML;
    var p1Avatar = avatarArray[0];
    var p2Avatar = avatarArray[1];

    if (active == "Player 1") {
        var paintAvatar = p1Avatar;
    } else {
        var paintAvatar = p2Avatar;
    }
    return paintAvatar;
}



function avatarPlaced() {
    var parseText = document.getElementById('gameMsg').innerHTML;
	var showPlayer = document.getElementById('showPlayer'); 
	
	if (parseText == "That's three in a row, Player 1 wins!" || parseText == "That's three in a row, Player 2 wins!"){
		showPlayer.innerHTML = "Game Stopped";
		showPlayer.style.color='red';
    }
    
    activePlayer = showPlayer.innerHTML; 
    
	if (activePlayer == "Player 1") { 
		showPlayer.innerHTML = "Player 2";
	} else {
		showPlayer.innerHTML = "Player 1";
    }
    
	check4Tie();
}



/*******************************************
 * 
 * 
 * Square Animation Sections
 * 
 * 
 *****************************************/
function square1Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    
    if (activePlayer != "Game Stopped") {
        var square = "0";

        var verdict = recordMoves(square);
        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[0];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square2Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "1";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[1];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square3Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "2";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[2];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square4Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "3";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[3];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square5Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "4";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[4];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square6Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "5";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[5];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square7Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "6";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[6];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square8Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "7";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[7];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
function square9Animate() {
    var activePlayer = document.getElementById("showPlayer").innerHTML;
    if (activePlayer != "Game Stopped") {
        var square = "8";

        var verdict = recordMoves(square);

        if (verdict == undefined) {
            var paintAvatar = determineAvatar();
            var selected = document.getElementsByClassName(paintAvatar)[8];

            if (paintAvatar == "O") {
                animateO(selected);
            } else if (paintAvatar == "X") {
                animateX(selected);
            }

            var currentMove = "," + square + paintAvatar;
            recordMove(currentMove);
            checkForWinCon();
            avatarPlaced(square,paintAvatar);
            squareSound();
        }
    }
}
/*******************************************
 * 
 * 
 * END Square Animation Sections
 * 
 * 
 *****************************************/







// O is initially offset by -100%
function animateO(selected) {
    //alert("O | " + selected.style.transform);
    selected.style.transform = (selected.style.transform == "translateY(-100%)" || null) ? "translateY(0%) " : "translateY(0%)";
}

// X is initially offset by 100%
function animateX(selected) {
    //alert("X | " + selected.style.transform);
    selected.style.transform = (selected.style.transform == "translateY(-100%)" || null) ? "translateY(0%) " : "translateY(0%)";
}




function check(info, square) {
    for (var i in info) {
        var tempInfo = info[i].charAt(0);
        if (tempInfo == square) {
            return tempInfo;
        }
    }
}

function recordMoves(square) {
    //This is not used
    var proposedMove = square;

    var boardState = document.getElementById("boardState").innerHTML;
    var info = boardState.split(",");
    verdict = check(info, square);
    return verdict
}

function recordMove(currentMove) {
    var target = document.getElementById("boardState");
    var previousMoves = target.innerHTML;
    target.innerHTML = previousMoves + currentMove;
}

function checkForWinCon() {
    var squareArray = [];
    var target = document.getElementById("boardState");
    var info = target.innerHTML;
    info = info.substring(1);
    info = info.split(",");
    info.sort();
    for (var i in info) {
        squareArray.push(info[i].charAt(0));
    }

    checkWinCon1(info,squareArray);
    checkWinCon2(info,squareArray);
    checkWinCon3(info,squareArray);
    checkWinCon4(info,squareArray);
    checkWinCon5(info,squareArray);
    checkWinCon6(info,squareArray);
    checkWinCon7(info,squareArray);
    checkWinCon8(info,squareArray);

    check4Tie();
}

function check4Tie() {
    var boardState = document.getElementById("boardState").innerHTML;
    boardState = boardState.substring(1);
    boardState = boardState.split(",");
    var check = document.getElementById("gameMsg").innerHTML;

    if (boardState.length >= 9 && check != "That's three in a row, Player 1 wins!" && check != "That's three in a row, Player 2 wins!") {
        var txt1 = "Oh No!  Nobody wins, it was a tie!"
        tieSound();
        writeMsg(txt1);
        setTimeout(function() {stopGame();}, 3000);
    }
}

function winner(winDetected, winCon) {
    if (winDetected == "win") {
        var showme = winDetected;
        var activePlayer = document.getElementById("showPlayer").innerHTML;
        var txt2 = "That's three in a row, " + activePlayer + " wins!"
        writeMsg(txt2);

        var btn = document.getElementById("btnStart");
        startEnabled(btn);
        var btn = document.getElementById("btnStop");
        btnDisabled(btn);

        document.getElementById("showPlayer").innerHTML = "Game Stopped";
        glowBoard(winCon);
    }
}

function glowBoard(pos) {
    var index0 = pos[0];
    var index1 = pos[1];
    var index2 = pos[2];
    //Instead of squares class, i'm using the photo-container class
    var squares = document.getElementsByClassName("photo-container");
    for (var i = 0; i < squares.length; i++) {
        if (i == index0) {
            var bg1 = squares[i];
            blink();
            winSound();
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244,179,66)";}, 100);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(0,179,66)";}, 200);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(0,0,66)";}, 300);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244,0,66)";}, 400);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244,0,0)";}, 500);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244,179,0)";}, 600);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(0,0,0)";}, 700);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244,179,66)";}, 800);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(0,179,100)";}, 900);
            setTimeout(function() {bg1.style.backgroundColor = "rgb(244,0,66)";}, 1000);
            setTimeout(function() {bg1.style.backgroundColor = "transparent";}, 1100);
        } else if (i == index1) {
            var bg2 = squares[i];
            blink();
            winSound();
            setTimeout(function() {bg2.style.backgroundColor = "rgb(214,179,66)";}, 100);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244,129,66)";}, 200);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244,179,66)";}, 300);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244,179,255)";}, 400);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(122,179,66)";}, 500);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244,10,66)";}, 600);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244,179,66)";}, 700);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(1,179,0)";}, 800);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(244,0,66)";}, 900);
            setTimeout(function() {bg2.style.backgroundColor = "rgb(10,11,14)";}, 1000);
            setTimeout(function() {bg2.style.backgroundColor = "transparent";}, 1100);
        } else if (i == index2) {
            var bg3 = squares[i];
            blink();
            winSound();
            setTimeout(function() {bg3.style.backgroundColor = "rgb(0,100,100)";}, 100);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(0,100,200)";}, 200);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(0,200,100)";}, 300);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(244,200,200)";}, 400);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(0,0,100)";}, 500);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(0,0,200)";}, 600);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(0,200,0)";}, 700);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(100,100,0)";}, 800);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(200,200,66)";}, 900);
            setTimeout(function() {bg3.style.backgroundColor = "rgb(100,101,104)";}, 1000);
            setTimeout(function() {bg3.style.backgroundColor = "transparent";}, 1100);
        }
    }
    setTimeout(function() {stopGame();}, 1200);
}

function blink() {
    var body = document.getElementById("body");
    setTimeout(function() {body.style.backgroundColor = "rgb(255,0,0)";}, 100);
    setTimeout(function() {body.style.backgroundColor = "rgb(255,255,255)";}, 200);
    setTimeout(function() {body.style.backgroundColor = "rgb(0,0,255)";}, 300);
    setTimeout(function() {body.style.backgroundColor = "rgb(255,0,0)";}, 400);
    setTimeout(function() {body.style.backgroundColor = "rgb(255,255,255)";}, 500);
    setTimeout(function() {body.style.backgroundColor = "rgb(0,0,255)";}, 600);
    setTimeout(function() {body.style.backgroundColor = "rgb(255,0,0)";}, 700);
    setTimeout(function() {body.style.backgroundColor = "rgb(255,255,255)";}, 800);
    setTimeout(function() {body.style.backgroundColor = "rgb(0,0,255)";}, 900);
    setTimeout(function() {body.style.backgroundColor = "rgb(255,0,0)";}, 1000);
    setTimeout(function() {body.style.backgroundColor = "#fff";}, 1100);
}


/*********************
 * 
 * Sounds
 * 
 *********************/
function squareSound() {
    var sound = document.getElementById("placeAvatar");
    sound.play();
    setTimeout(function() {sound.pause();}, 400);
    setTimeout(function() {sound.currentTime = 0;}, 500);
}

function tieSound() {
    var sound = document.getElementById("tieGame");

    //This is not used
    var check = document.getElementById("gameMsg").innerHTML;

    setTimeout(function() {sound.play();}, 500);
}

function winSound() {
    var sound = document.getElementById("winGame");
    setTimeout(function() {sound.play();}, 400);
    setTimeout(function() {sound.pause();}, 2670);
    setTimeout(function() {sound.currentTime = 0;}, 2800);
}

function diceRoll() {
    var sound = document.getElementById("diceRoll");
    sound.play();
}





/**********************************************
 * 
 * 
 * Checking for win conditions section
 * 
 * 
 *********************************************/
function checkWinCon1(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [0,1,2];

    for (var i in info) {
        if (info[i].charAt(0) == "0") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "1") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "2") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon2(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [3,4,5];

    for (var i in info) {
        if (info[i].charAt(0) == "3") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "4") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "5") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon3(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [6,7,8];

    for (var i in info) {
        if (info[i].charAt(0) == "6") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "7") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "8") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon4(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [0,3,6];

    for (var i in info) {
        if (info[i].charAt(0) == "0") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "3") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "6") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon5(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [1,4,7];

    for (var i in info) {
        if (info[i].charAt(0) == "1") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "4") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "7") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon6(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [2,5,8];

    for (var i in info) {
        if (info[i].charAt(0) == "2") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "5") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "8") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon7(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [0,4,8];

    for (var i in info) {
        if (info[i].charAt(0) == "0") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "4") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "8") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
function checkWinCon8(info,squareArray) {
    var winDetected = "on";
    var winCon1 = [2,4,6];

    for (var i in info) {
        if (info[i].charAt(0) == "2") {
            var match0Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "4") {
            var match1Avatar = info[i].charAt(1);
        }
        if (info[i].charAt(0) == "6") {
            var match2Avatar = info[i].charAt(1);
        }
    }

    if (match0Avatar != undefined && match1Avatar != undefined && match2Avatar != undefined) {
        if (match0Avatar == match1Avatar && match0Avatar == match2Avatar) {
            winDetected = "win";
            winner(winDetected, winCon1);
            return;
        }
    }
    winner(winDetected, winCon1);
}
/**********************************************
 * 
 * 
 * END Checking for win conditions section
 * 
 * 
 *********************************************/




