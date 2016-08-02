// ==UserScript==
// @name        mineAI
// @namespace   minesAI
// @include     http://minesweeperonline.com/#*
// @version     1
// @grant       none
// ==/UserScript==

// Load the libraries ########################################################
var D              = document;
var appTarg        = D.getElementsByTagName ('head')[0]  ||  D.body  ||  D.documentElement;
var convNetNode    = D.createElement ('script');
var controllerNode = D.createElement ('script');

convNetNode.src    = 'http://localhost:8000/convnetjs.js';
controllerNode.src = 'http://localhost:8000/controller.js';
convNetNode.addEventListener ("load", initConvNetJsOnDelay, false);

appTarg.appendChild (convNetNode);
appTarg.appendChild (controllerNode);

// Main script ###############################################################

// Allow some time for the library to initialize after loading.
function initConvNetJsOnDelay () {
    setTimeout (initConvNetJs, 666);
}

// Call the library's start-up function, if any. Note needed use of unsafeWindow.
function initConvNetJs () {


    // species a 2-layer neural network with one hidden layer of 20 neurons
    var layer_defs = [];

    // ConvNetJS works on 3-Dimensional volumes (sx, sy, depth), but if you're not dealing with images
    // then the first two dimensions (sx, sy) will always be kept at size 1
    // layer_defs.push({type:'input', out_sx:9, out_sy:9, out_depth:1});
    // layer_defs.push({type:'conv', sx:3, filters:8, stride:1, activation:'relu'});
    // layer_defs.push({type:'pool', sx:2, stride:2});
    // layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});

    layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:81});
    layer_defs.push({type:'fc', num_neurons:50,  activation:'relu'});
    layer_defs.push({type:'fc', num_neurons:20,  activation:'relu'});
    layer_defs.push({type:'fc', num_neurons:10,  activation:'relu'});
    layer_defs.push({type:'regression', num_neurons:2});

    // define our net
    var net = new convnetjs.Net();

    // create our net with layers as defined above
    net.makeLayers(layer_defs);

    // define trainer
    var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, l2_decay:0.001});

    function playGame(convnet, convTrainer){

        console.log("Starting game");
        newGame();

        while(!gameEnded()){

            console.log("Updating state");
            updateFieldState();
            console.log("state: " + currentState);

            var volume = new convnetjs.Vol(1,1,81,0,0);
            for(var i = 0; i < 9*9; i++){
                volume.w[i] = currentState[i];
            }

            console.log("Starting net")
            var coords = convnet.forward(volume).w;
            console.log("Ended net")

            var xCoord = Math.round(coords[0]);
            var yCoord = Math.round(coords[1]);

            console.log("coord[0]:" + coords[0] + ", coord[1]: " + coords[1]);

            if(xCoord < 1 || xCoord > 9 || yCoord < 1 || yCoord > 9){
                console.log("tried to access x:" + xCoord + ", y: " + yCoord);
                break;
            } else {
                console.log("Clicking Square x:" + xCoord + ", y: " + yCoord);
                clickSquare(xCoord, yCoord);
            }
        }

        convTrainer.train(volume, getAlternative());
    }

    function playGames(convnet, convTrainer, count){
        for(var i = 0; i < count; i++){
            playGame(convnet, convTrainer);
        }
    }

    playGames(net, trainer, 10);
    document.cookie = JSON.stringify(net.toJSON());
}

alert("Done");