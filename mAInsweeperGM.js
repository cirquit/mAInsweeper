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
    layer_defs.push({type:'fc', num_neurons:100,  activation:'relu'});
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

        logWithP("######### Starting Game #########");

        newGame();

        while(!gameEnded()){

            updateFieldState();
            logWithP("state: " + currentState);

            var volume = new convnetjs.Vol(1,1,81,0,0);
            for(var i = 0; i < 9*9; i++){
                volume.w[i] = currentState[i];
            }

            var coords = convnet.forward(volume).w;

            var xCoord = Math.round(coords[0]);
            var yCoord = Math.round(coords[1]);

            if(xCoord < 1 || xCoord > 9 || yCoord < 1 || yCoord > 9){
                logWithP("tried to access x:" + xCoord + ", y: " + yCoord);
                break;
            } else {
                logWithP("Clicking Square x:" + xCoord + ", y: " + yCoord);
                clickSquare(xCoord, yCoord);

                updateFieldState();
                if (areEqual(currentState, oldState)){
                    logWithP("State didn't change - break")
                    break;
                }
                logWithP("State did change, going forward")
            }
        }

        convTrainer.train(volume, getAlternative());
    }

    function playMultipleGames(convnet, convTrainer, count){
        for(var myCounter = 0; myCounter < count; myCounter = myCounter + 1){
            playGame(convnet, convTrainer);
            logWithP("counter: " + myCounter);
        }
    }

    playMultipleGames(net, trainer, 3);
    console.log(JSON.stringify(net.toJSON()));
}


function logWithP(input){
    var tempVar = document.createElement("p");
    tempVar.innerHTML = input
    document.getElementsByTagName("body")[0].appendChild(tempVar);
}
