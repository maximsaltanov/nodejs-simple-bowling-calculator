var game = require('../src/game');
var gameServer = require('../src/server');
var expect = require('chai').expect;
var request = require('request');

var server = new gameServer(new game());
const port = 8005;
const url = `http://localhost:${port}/`;

describe('simple frame test', function() {
    before(function () {
        server.start(port);
    });    

    it('reset game test', function (done) {
        request.post({            
            url: url + 'game'            
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(204);                     
            expect(body).to.equal('');
            done();
        });        
    });

    it('add frame test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"1","second":"8"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('');
            done();
        });        
    });

    it('get score test', function (done) {
        request.get({            
            url: url + 'scores',            
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('{"total":9,"frames":[{"first":1,"second":8,"third":null}]}');
            done();
        });        
    });
});

describe('strike and spare frames test', function() {       

    it('reset game test', function (done) {
        request.post({            
            url: url + 'game'            
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(204);                     
            expect(body).to.equal('');
            done();
        });        
    });

    it('strike test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"10","second":"0"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('');
            done();
        });        
    });

    it('spare test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"8","second":"2"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('');
            done();
        });        
    });

    it('open test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"1","second":"8"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('');
            done();
        });        
    });

    it('get score test', function (done) {
        request.get({            
            url: url + 'scores',            
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('{"total":38,"frames":[{"first":10,"second":0,"third":null},{"first":8,"second":2,"third":null},{"first":1,"second":8,"third":null}]}');
            done();
        });        
    });
});

describe('incorrect request params tests', function() {

    after(function () {
        server.stop(port);
    });    

    it('reset game test', function (done) {
        request.post({            
            url: url + 'game'            
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(204);                     
            expect(body).to.equal('');
            done();
        });        
    });

    it('strike test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"10","second":"0"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(200);
            expect(body).to.equal('');
            done();
        });        
    });

    it('wrong sum test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"8","second":"3"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(400);
            expect(body).to.equal('{"error":"Total score in 2 pins can\'t be more than 10!"}');
            done();
        });        
    });

    it('extra third pull test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"1","second":"8", "third": "5"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(400);
            expect(body).to.equal('{"error":"You can not make a third roll in the current frame!"}');
            done();
        });        
    });

    it('incorrect score test', function (done) {
        request.put({            
            url: url + 'scores',
            body: '{"first":"-4","second":"1"}'
        }, function (err, res, body){         
            expect(res.statusCode).to.equal(400);
            expect(body).to.equal('{"error":"Pins must have a value from 0 to 10!"}');
            done();
        });        
    });       
});