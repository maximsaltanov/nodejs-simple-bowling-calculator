const http = require('http');

class gameServer{

  constructor(game, storage){    
    this.game = game;
    this.storage = storage;
    this.server = null;
  }

  start(){
    if (this.server) return;

    let self = this;
    //// creating of a very simple http web server
    this.server = new http.Server(function(req, res) {
      
      res.setHeader('Content-Type', 'application/json');

      //// get scores
      if (req.method === 'GET' && req.url === '/scores') {   
        self._getScore(res);
      } 
      //// reset game
      else if (req.method === 'POST' && req.url === '/game') {    
        self._resetGame(res);
      }
      //// add a frame
      else if (req.method === 'PUT' && req.url === '/scores') {            
        self._addFrame(req, res);
      }
      else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('http server is started.... please see <a target="_blank" href="https://github.com/maximsaltanov/nodejs-simple-bowling-calculator/blob/master/README.md">docs</a>');
      }
    });

    this.server.listen(process.env.PORT || "8000", process.env.HOST || "localhost");
  }  

  _getScore(res){
    res.end(this.game.getScores());             
  }

  _resetGame(res){    
    this.game.resetFrames();        
    // save frames
    this.storage.write(this.game.frames);
    // set response
    res.statusCode = 204;
    res.end('');    
  }

  _addFrame(req, res){
    let body = '';
    let self = this;

    req.on("data", function (item) {      
      body += item;
    });

    req.on("end", function(){                       
      var json = JSON.parse(body);      
      try {   
        //// adding a frame        
        self.game.addFrame(+json['first'], +json['second'], json['third'] != null ? +json['third'] : null);
        
        // save frames
        self.storage.write(self.game.frames);
        res.end('');
      }
      catch (err) { 
        res.statusCode = 400;
        res.end(JSON.stringify({ 'error': err.message }));            
      }             
    });
  }
}

module.exports = gameServer;