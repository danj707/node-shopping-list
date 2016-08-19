//require express module
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//create the storage object using constructor function, contains empty array of items and an id to track
var Storage = function() {
    this.items = [];
    this.id = 0;
};

//add method, adds items to the storage object array, adds the ID # and increments
Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

//delete method, takes the ID and splices it from the items array, using ID
Storage.prototype.delete = function(id) {
    
    if(!this.items[id]) {
        //Id doesn't exist, return an error
    } else {
        //delete this.items[id];
        return this.items.splice(id,1);
    }
    return this.items;
};

//update method, changes the name of object item
Storage.prototype.update = function(id,name) {
    
    var msg;
    if(this.items[id]) {
        //item already exists, update it
        this.items[id].name = name;
    } else {
        //no such item # exists, create it
        storage.add(name);
    }
    return this.items;
};

//creates a new storage object, adds a list of 3 items
var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

//creates an express object called 'app'
var app = express();

//look for static content in the 'public' folder
app.use(express.static('public'));

//single route listening to /items, responds with a list of the storage object items as json
//listening to GET requests for /items
app.get('/items', function(request, response) {
    response.json(storage.items);
});

////////////////////////////////////////////////////////////////////
//adds a POST route listening to /items - POST /items ADDS an item
////////////////////////////////////////////////////////////////////
app.post('/items', jsonParser, function(request, response) {
    //if there is a POST, but no body, send a 400 error
    if (!request.body) {
        return response.sendStatus(400);
    }

    //gets the item request name, creates a new object, calls add method, sends response 201 'added'
    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

/////////////////////////////////////////////////////////////////////////////
//adds a DELETE route listening to /items - DELETE /items/id DELETES an item
/////////////////////////////////////////////////////////////////////////////
app.delete('/items/:id', jsonParser, function(request, response) {
    //if there is a DELETE, but no body, send a 400 error
    if (!request.body) {
        return response.sendStatus(400);
    }

    var item = storage.delete(request.params.id);

    response.status(200).json(item);

    });

/////////////////////////////////////////////////////////////////////////////
//adds a PUT route listening to /items - PUT /items/id updates OBJ info
/////////////////////////////////////////////////////////////////////////////
app.put('/items/:id/:name', jsonParser, function(request, response) {
    //if there is a PUT, but no body, send a 400 error
    if (!request.body) {
        return response.sendStatus(400);
    }
    var id = request.params.id;
    var name = request.params.name;

    //gets the item request name, creates a new object, calls add method, sends response 200 'ok'
    var item=storage.update(id,name);
    
    response.status(200).json(item);
    });

//server listener
app.listen(process.env.PORT, process.env.IP);

//export objects for chai/mocha
exports.app = app;
exports.storage = storage;