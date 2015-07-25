# PersistableObject [![Build Status](https://travis-ci.org/AleksandarFaraj/PersistableObject.svg?branch=master)](https://travis-ci.org/AleksandarFaraj/PersistableObject)
A JS object which you can persist easily.

## Installation:

PersistableObject is available through npm

    npm install persistable-object

## Usage:

PersistableObject provides you an object which can be persisted.

#### Example:

    var persistableObject = require('persistable-object');

    // load yourpo.json
    var po = persistableObject("yourpo.json");

    // use po as any other object.
    po.hello = "world";
    po.obj   = {a:{b:1},c:{d:{e:5}}};
    po.int   = 5;

    //persists the object to yourpo.json
    po.save();
