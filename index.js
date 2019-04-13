const config = require('./config.json');
const gameServer = require('./src/server');
const storageManager = require('./src/storage');
const bowlingGame = require('./src/game');

let game = new bowlingGame();
let storage = new storageManager(config.storagePath);
let server = new gameServer(game, storage);

storage.read().then((data) => {  
    game.init(data);  
    server.start();
}).catch((err) => { 
    console.log(err.message); 
});