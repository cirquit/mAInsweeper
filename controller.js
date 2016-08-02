var oldState = [];
var currentState = [];

function getFieldState() {
    var newsState   = document.getElementsByClassName('square');
    var newStateIDs = [];
    for (var i = 0; i < newsState.length; i++) {
        if(newsState[i].style.display != "none") newStateIDs.push(newsState[i]);
    }
    oldState = currentState.slice();

    for (var i = 0; i < newStateIDs.length; i++) {
        switch(newStateIDs[i].className.substring(7)){
            case "blank": currentState[i] = -1; break;
            case "bombrevealed": currentState[i] = -2; break;
            case "bombdeath": currentState[i] = -3; break;
            default: currentState[i] = parseInt(newStateIDs[i].className.substring(11,12));
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
    var newStateIDs = document.getElementsByClassName('square');

    for (var i = 0; i < newStateIDs.length; i++) {
        if(newStateIDs[i].className.substring(7) == "blank"){
            var x = parseInt(newStateIDs[i].id.split("_")[0]);
            var y = parseInt(newStateIDs[i].id.split("_")[1]);
            return [x,y];
        }
    }
}

function clickSquare(x, y) {
    simulate(document.getElementById(x + "_" + y), "mouseup");  
}

function newGame(){
    simulate(document.getElementById('face'), "mousedown");  
    simulate(document.getElementById('face'), "mouseup");  
}

function randomPlay(i) {
    var sq = document.getElementsByClassName('square');
    var squares = [];
    for (var i = 0; i < sq.length; i++) {
        if(sq[i].style.display != "none") squares.push(sq[i]);
    }
    var rand;
    var count = 0;

    while(i>0){
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
        i--;
    }
    console.log("Clicked: " + i);

}

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

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
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