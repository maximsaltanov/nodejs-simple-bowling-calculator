const http = require('http');
const app = require('./app');
const config = require('./config.json');
const storageManager = require('./app/fileStorageManager');

let game = new app();

let storage = new storageManager(config.storagePath);
storage.read().then((data) => {  
  game.init(data);
}).catch((err) => { console.log(err.message); });

//// creating of a very simple http web server
let server = new http.Server(function(req, res) {

  res.setHeader('Content-Type', 'application/json'); 

  //// get current scores
  if (req.method === 'GET' && req.url === '/scores') {   
    res.end(game.getScores());        
  } 
  //// reset game
  else if (req.method === 'POST' && req.url === '/game') {    

    game.resetFrames();
    
    // save frames
    storage.write(game.frames);
    
    res.statusCode = 204;
    res.end('');    
  }
  //// add a frame
  else if (req.method === 'PUT' && req.url === '/scores') {
        
    let body = '';

    req.on("data", function (item) {      
      body += item;
    });

    req.on("end", function(){                       
      var json = JSON.parse(body);      
      try {   
        //// adding a frame        
        game.addFrame(+json['first'], +json['second'], json['third'] != null ? +json['third'] : null);
        
        // save frames
        storage.write(game.frames);
        res.end('');
      }
      catch (err) { 
        res.statusCode = 400;
        res.end(JSON.stringify({ 'error': err.message }));            
      }             
    });
  }
  else {
    res.end('unsupported method or route');
  }
});

//// start listening 8000 port
server.listen(process.env.PORT || "8000", process.env.HOST || "localhost");