// species a 2-layer neural network with one hidden layer of 20 neurons
var layer_defs = [];

// ConvNetJS works on 3-Dimensional volumes (sx, sy, depth), but if you're not dealing with images
// then the first two dimensions (sx, sy) will always be kept at size 1
layer_defs.push({type:'input', out_sx:9, out_sy:9, out_depth:1});

layer_defs.push({type:'conv', sx:3, filters:8, stride:1, activation:'relu'});

layer_defs.push({type:'pool', sx:2, stride:2});

layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});

layer_defs.push({type:'regression', num_classes:2});

// define our net
var net = new convnetjs.Net();

// create our net with layers as defined above
net.makeLayers(layer_defs);

// define trainer
var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, l2_decay:0.001});

function playGame(convnet, convTrainer){
    newGame();

    while(!gameEnded()){

        updateFieldState();

        var volume = new convnetjs.Vol(9,9,1,0,0);
        for(var i = 0; i < 9*9; i++){
            volume.w[i] = currentState[i];
        }
        var coords = convnet.forward(volume);

        var xCoord = Math.round(coords[0]);
        var yCoord = Math.round(coords[1]);

        if(x < 1 || x > 9 || y < 1 || y > 9){
            console.log("tried to access x:" + xCoord + ", y: " + yCoord);
            break;
        } else {
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