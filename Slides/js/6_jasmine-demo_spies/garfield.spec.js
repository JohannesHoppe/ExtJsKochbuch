/// <reference path="garfield.js" />

describe('Garfield', function () {

    it('should tell his name', function () {
        expect(new Garfield().getName()).toEqual("Garfield");
    });

    describe('when told to be nice', function() {

        var garfield;
        beforeEach(function() {

            garfield = new Garfield();
            spyOn(garfield, 'goToFridgeAndEatPizza').andCallThrough();
        });

        it('should answer with ok', function() {
            var answer = garfield.beNice();
            expect(answer).toEqual("ok");
        });

        it('should steal pizza', function () {
            garfield.beNice();
            expect(garfield.goToFridgeAndEatPizza).toHaveBeenCalled();
        });
    });
});


describe('Prince', function () {
                                                         
    it('should tell a wrong name', function () {
        expect(new Garfield().getName()).toEqual("Garfield");
    });

    describe('when told to be nice', function() {

        var prince;
        beforeEach(function() {
            prince = new Prince();
            spyOn(prince, 'goToFridgeAndEatPizza').andCallThrough();
        });

        it('should answer with ok', function() {
            var answer = prince.beNice();
            expect(answer).toEqual("ok");
        });

        it('should NOT steal pizza', function() {
            prince.beNice();
            expect(prince.goToFridgeAndEatPizza).not.toHaveBeenCalled();
        });
    });
});
