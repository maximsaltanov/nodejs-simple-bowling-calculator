var fs = require('fs');

class fileStorageManager {
    constructor(path) {
        this.path = path;
    }
    
    read(){        
        let _path = this.path;

        return new Promise(function(resolve, reject) {
            fs.readFile(_path, 'utf8', function(err, data){
                if (err) {                                             
                    reject(err); 
                }
                else {
                    var json = data ? JSON.parse(data) : null;                    
                    resolve(json);
                }
            });
        });        
    }

    write(json){
        fs.writeFile(this.path, JSON.stringify(json), 'utf8', function(){});
    }
}

module.exports = fileStorageManager;