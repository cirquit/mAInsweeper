var maxX = 16;
var maxY = 31
var maxMines = 99;

// oldState ist used to check if the state has changed after a "move" 
var oldState     = [];

// holds the current state of the minesweeper game
var currentState = [];

function getRealSquares(){
    // get all div elements with class name 'square'
    var squareDivs = document.getElementsByClassName('square');

    // container for clickable divs
    var squares = [];

    // filter out the real squares
    for (var i = 0; i < squareDivs.length; i++) {
        if(squareDivs[i].style.display != "none") squares.push(squareDivs[i]);
    }

    return squares;
}

// fills currentState with the current state of the minesweeper game
function updateFieldState() {

    var squares = getRealSquares();

    // copy the state to compare later
    oldState = currentState.slice();

    // parse the state
    // "blank"        <=> -1 --> clickable field
    // "bombrevealed" <=> -2 --> a bomb is revealed and the game is over
    // "bombdeath"    <=> -3 --> this is the bomb that blew the game
    // else parse the value of the square because it's open that ranges between 0 and 8.
    for (var i = 0; i < squares.length; i++) {
        switch(squares[i].className.substring(7)){
            case "blank":        currentState[i] = -1; break;
            case "bombrevealed": currentState[i] = -2; break;
            case "bombdeath":    currentState[i] = -3; break;
            default:             currentState[i] = parseInt(squares[i].className.substring(11,12));
        }
    }
}

function areEqual(arr1, arr2) {
    if(arr2.length != arr1.length) return false;

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
    }

    return true;
}


function hasLost() {
    return (document.getElementById('face').className == "facedead");
}

function hasWon() {
    return (document.getElementById('face').className == "facewin");
}

function gameEnded() {
    return (hasWon() || hasLost());
}

function getAlternative(){

    // container for clickable divs
    var squares = getRealSquares();
    
    var newIndex = Math.round(Math.random() * (squares.length-1));

    var x = parseInt(squares[newIndex].id.split("_")[0]);
    var y = parseInt(squares[newIndex].id.split("_")[1]);
    return [x,y];
}

function clickSquare(x, y) {
    simulate(document.getElementById(x + "_" + y), "mouseup");  
}

function newGame(){
    simulate(document.getElementById('face'), "mousedown");  
    simulate(document.getElementById('face'), "mouseup");  
}

function randomPlay(gameCount) {

    var squares = getRealSquares();

    var rand;
    var count = 0;

    while(gameCount>0){
        newGame();
        console.log("New Game created#######################################");
        while(!gameEnded()){
            rand = parseInt(Math.random() * (squares.length - 1));
            console.log("Getting coordinates...");
            var x = parseInt(squares[rand].id.split("_")[0]);
            var y = parseInt(squares[rand].id.split("_")[1]);
            //console.log("Got x = " + x + " and y = " + y );
            //console.log("Now clicking");
            clickSquare(x,y);
            console.log("Square clicked");
        }
        gameCount--;
    }
    console.log("Clicked: " + gameCount);

}

function hasOpenNeighbor(id){
    var neighbors = findNeighborIDs(id);

    for (var i = 0; i < neighbors.length; i++) {
        if(document.getElementById(neighbors[i]).className.substring(7,11) == "open")
            return true;
    }
    return false;
}

function getAlternativeState() {
    var state = [];

    var squares = getRealSquares();

    var blankCount = countBlanks();

    for (var i = 0; i < squares.length; i++) {
        switch(squares[i].className.substring(7)){
            case "bombrevealed": {
                console.log("revealed");
                if (!hasOpenNeighbor(squares[i].id)) {
                    state[i] = Math.round(100 * maxMines / blankCount);
                } else {
                    state[i] = 100;
                }
            }
            break;
            case "bombdeath": {
                console.log("death");

                if (!hasOpenNeighbor(squares[i].id)) {
                    state[i] = Math.round(100 * maxMines / blankCount);
                } else {
                    state[i] = 100;
                }
            }
            break;
            case "blank": {
                console.log("blank");

                if (!hasOpenNeighbor(squares[i].id)) {
                    state[i] = Math.round(100 * maxMines / blankCount);
                } else {
                    state[i] = 0;
                }
            }
            break;
            default: 
                console.log("default");

                state[i] = -1;
        }
    }
    return state;
}

function countBlanks() {
    var tempSquares = document.getElementsByClassName('square blank');
    var squares = [];

    for (var i = 0; i < tempSquares.length; i++) {
        if(tempSquares[i].style.display != "none"){
            squares.push(tempSquares[i]);
        }
    }

    return squares.length;
}

function fillFieldWithState(state) {
    var squares = getRealSquares();
    var value = "";

    for (var i = 0; i < squares.length; i++) {
        value = "<p style:\"font-size:5px;text-align:center;\">" + state[i] + "</p>";
        squares[i].innerHTML = value;
    }

}

function findBlankNeighborIDs(id) {
    var x = parseInt(id.split('_')[0]);
    var y = parseInt(id.split('_')[1]);

    var newX;
    var newY;
    var newID;

    var newXWithinBounds;
    var newYWithinBounds;

    var neighborsIDs = [];

    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0)) {
                newX = x + i;
                newY = y + j;

                newID = newX + '_' + newY;

                newXWithinBounds = (newX > 0) && (newX <= maxX);
                newYWithinBounds = (newY > 0) && (newY <= maxY);

                if (newXWithinBounds && newYWithinBounds) {
                    if(document.getElementById(newID).className == "square blank"){
                        neighborsIDs.push(newID);
                    }
                }
            }
        }
    }

    return neighborsIDs;
}

function findNeighborIDs(id) {
    var x = parseInt(id.split('_')[0]);
    var y = parseInt(id.split('_')[1]);

    var newX;
    var newY;
    var newID;

    var newXWithinBounds;
    var newYWithinBounds;

    var neighborsIDs = [];

    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (!(i == 0 && j == 0)) {
                newX = x + i;
                newY = y + j;

                newID = newX + '_' + newY;

                newXWithinBounds = (newX > 0) && (newX <= maxX);
                newYWithinBounds = (newY > 0) && (newY <= maxY);

                if (newXWithinBounds && newYWithinBounds) {
                    neighborsIDs.push(newID);
                }
            }
        }
    }

    return neighborsIDs;
}


function findBlankNeighbors(id) {
    var neighborsIDs = findBlankNeighborIDs(id);

    var neighbors = []

    for (var i = 0; i < neighborsIDs.length; i++) {
        neighbors.push(document.getElementById(neighborsIDs[i]));
    }

    return neighbors;
}



// utilities ##########################################################

// simulate clicks on divs (some SO answer)
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}


// used by 'simulate'
function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

// used by 'simulate'
var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}

// used by 'simulate'
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

// chunksOf operator for creating sublists with chunkSize from a big list
// chunksOf ([1,2,3,4,5], 2)
// => [[1,2], [3,4], [5]]
function chunksOf(arr, chunkSize){
    var r = [];
    for (var i = 0; i < arr.length; i+=chunkSize) {
        r.push(arr.slice(i, i+chunkSize));
    };
    return r;
}