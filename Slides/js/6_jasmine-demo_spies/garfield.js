var Garfield = function () {
    
    this.getName = function () {
        return "Garfield";
    };
    
    this.goToFridgeAndEatPizza = function () {
        console.log("Yum!");
    };

    this.beNice = function() {
        this.goToFridgeAndEatPizza();
        return "ok";
    };
};


var Prince = function() {

    this.getName = function () {
        return "Garfield"; // he is lying!
    };

    this.goToFridgeAndEatPizza = function() {
        console.log("Nope!");
    };
    
    this.beNice = function () {
        return "ok";
    };
};