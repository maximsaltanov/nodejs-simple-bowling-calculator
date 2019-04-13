const maxFrames = 10;      

/// bowling game class
class game {    

    constructor() {                                  
        this.resetFrames();                   
    }            
    
    init(items){        
        if (items){
            for(let i = 0; i < items.length; i++){
                this.addFrame(items[i].first, items[i].second, items[i].third);
            }    
        }
    }

    get frames() {        
        return this._frames;
    }
    
    resetFrames() {
        this._frames = [];
    }
        
    addFrame(first, second, third){                
        this._validateAddingFrame(first, second, third);
        this._frames.push(new frame(first, second, third));
    }    
    
    getScores(){
        return JSON.stringify({ 'total': this._getScore(), 'frames': this._frames });        
    }    

    _validateAddingFrame(first, second, third){
        //// check on game is over
        if (this._frames.length == maxFrames){
            throw new Error('Game over!');
        }        

        //// validate pin values
        if (first < 0 || first > 10 || second < 0 || second > 10 || (third != null && (third < 0 || third > 10))) {
            throw new Error('Pins must have a value from 0 to 10!');        
        } 

        //// check on total score for 2 pins
        if (first + second > 10){
            throw new Error("Total score in 2 pins can't be more than 10!");
        } 

        //// validate ability of make rolls
        if (this._frames.length < 9){
            if (third != null) {                
                throw new Error("You can not make a third roll in the current frame!");
            }
            if (first == 10 && second != 0) {
                throw new Error("You beat a strike! You can not make a secord roll in the current frame!");
            }
        }
        else {
            if ((first != 10 || (first + second != 10)) && third != null){
                throw new Error("You can not make a third roll in the current frame!");
            }
        }
    }    
    
    _strikeBonus(index, length) {
        if (index + 1 >= length) return 0;

        if(this._frames[index + 1].isStrike){
            return (this._frames[index + 1].score + (index + 2 < length ? this._frames[index + 2].first : 0));
        }else{
            return this._frames[index + 1].score;
        }
    };

    _getScore(){
        let total = 0;
        
        for(let i = 0, length = this._frames.length; i < length; i++){
            let frame = this._frames[i];            
            if (frame.isSpare && (i + 1 < length)){
                total += this._frames[i + 1].first;
            }
            else if (frame.isStrike){
                total += this._strikeBonus(i, length);
            }
            total += frame.score;
        }

        return total;
    }            
}

//// frame class
class frame {
    constructor(first, second, third) {
        this.first = first || 0;
        this.second = second || 0;
        this.third = third || null;        
    }

    get score() {
        return this.first + this.second + (this.third || 0);
    }

    get isStrike(){
        return this.first === 10;
    }

    get isSpare(){
        return (this.first + this.second) === 10;
    }
}

module.exports = game;