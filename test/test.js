var assert = require('assert');
var persistIt = require('../app');
var fs = require('fs');
var Chance = require('chance');
var chance = new Chance();
var _ = require('lodash');

describe('PersistIt', function () {

    var filename = "test/db.json";
    after(function(){
       fsrm(filename);
    });
    describe("initializating " + filename, function () {
        describe("without the file existing", function () {
            beforeEach(function () {
                fsrm(filename);
            });
            it("should create a file", function () {
                var db = persistIt(filename);

                db.save();

                assert(fs.existsSync(filename));
            });
            it("should only contain one key", function () {
                assert.equal(false,fs.existsSync(filename));
                var db = persistIt(filename);
                assert.equal(0,Object.keys(db).length);
            });

        });
        describe("when saving files", function () {
            describe("save()", function () {
                beforeEach("remove old db if it exists and create a persist an empty one.", function () {
                    fsrm(filename);
                    var db = persistIt(filename);
                    db.save();
                });
                it("should persist data", function () {
                    var db = persistIt(filename);
                    var expected = Math.random();
                    db.hello = expected;

                    db.save();

                    var db1 = persistIt(filename);
                    var actual = db1.hello;
                    assert.equal(expected, actual);
                });
                describe("saving different data types", function () {
                    var testCases = [chance.paragraph(), chance.integer(), chance.bool(), chance.floating()];
                    testCases.forEach(function(expected){
                        it("should be able to store values of type: "+typeof expected,function(){
                            var key = chance.word({length:50}); // create identifier for property with length 50
                            var db = persistIt(filename);
                            db[key] = expected;

                            db.save();

                            var db1 = persistIt(filename);
                            var actual = db1[key];

                            assert(_.isEqual(expected, actual));
                        });
                    });
                    it("should be able to store dates in ISO format",function(){
                        var db = persistIt(filename);
                        var expectedDate = chance.date();
                        db.someDate = expectedDate;
                        db.save();

                        var db1 =  persistIt(filename);
                        var actualDate = db1.someDate;
                        assert.equal(expectedDate.toISOString(),actualDate);
                    });
                    it("should be able to store objects",function(){
                        var db = persistIt(filename);
                        var expectedObject = createRandomObject(4,true);
                        db.someObject = expectedObject;

                        db.save();

                        var db1=persistIt(filename);
                        var actualObject = db1.someObject;
                        assert(_.isEqual(expectedObject,actualObject));
                    })
                })
            });
        });
        describe("when changing files", function () {
            describe("save()", function () {
                var expectedNumber = Math.random();
                beforeEach(function () {
                    var db = persistIt(filename);
                    db.hello = expectedNumber;
                    db.save();
                });
                it("should persist changes", function () {
                    var db = persistIt(filename);
                    var actualNumber = db.hello;
                    assert.equal( "number",typeof actualNumber);
                    assert.equal(expectedNumber,actualNumber);

                    var expectedString = "hello";
                    db.hello = expectedString;

                    db.save();

                    var db1 = persistIt(filename);
                    var actualString = db1.hello;
                    assert.equal("string",typeof actualString);
                    assert.equal(actualString,expectedString);
                })
            })
        })
    });
});
function fsrm(filename) {
    try {
        //remove if file exists
        fs.unlinkSync(filename);
    } catch (e) {

    }
    assert(false == fs.existsSync(filename));
}
function createRandomObject(fieldCount) {
    var generatedObject = {};

    for(var i = 0; i < fieldCount; i++) {
        var generatedObjectField;
        var caseType = chance.integer({min: 0, max:5});
        switch(caseType) {
            case 0:
                generatedObjectField = chance.integer();
                break;
            case 1:
                generatedObjectField = chance.floating();
                break;
            case 2:
                generatedObjectField = chance.bool();
                break;

            case 3:
                generatedObjectField = chance.paragraph();
                break;
            case 4:
                generatedObjectField = null;
                break;

            case 5:
                generatedObjectField = createRandomObject(fieldCount-1);
                break;
        }
        generatedObject[chance.word({length:50})] = generatedObjectField;
    }
    return generatedObject;
}
