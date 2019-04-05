const mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const routedb = "mongodb://127.0.0.1/Karma";
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


server.listen(4001, function () {
    console.log('Servidor corriendo en http://localhost:4001');
});

// Connect to mongo
mongo.connect(routedb, function (err, db) {
    if (err) {
        throw err;
    }
    console.log('MongoDB connected...');
    var onlineChanges = [];

    app.get('/get', function (req, res) {
        res.sendFile(__dirname + '/chat.html');
    });

    /*io.on('connection', function(socket) {
        console.log('Un cliente se ha conectado');
        let relays = db.collection('relays');

        // Get chats from mongo collection

        
        relays.find().limit(100).sort({_id:1})(function(err, res){
            if(err){
                throw err;
            }
            // Emit the messages
            console.log(res)
            socket.emit('changes', res);
        });
    });*/
});



app.put("/r/:relay", function (request, response, next) {
    const idNumber = request.params.relay
    const updateOps = request.body;
    
   
    //const status = req.params.status
    // Find one document in our collection
    mongo.connect(routedb, function (err, db) {
        if (err) {
            throw err;
        }
        // db.collection('relays').update({relay: idNumber},{$set: updateOps}, function (err, doc) {
        //     if (err) throw err;
        //     io.sockets.emit("changes", doc);
        //     response.status(200).json(doc);
        // });

        db.collection('relays').findOneAndUpdate({relay: idNumber}, {$set: updateOps}, {returnOriginal: false}, function (err, doc) {
            if (err) throw err;
            //res.render('changes', doc);
            response.status(200).json(doc.value);
            console.log(doc.value);
            io.sockets.emit("changes", doc.value);
            
        });
     
        
    });
});

app.get('/get/s/:status', function (req, res) {
    const status = req.params.status
    // Find one document in our collection
    mongo.connect(routedb, function (err, db) {
        if (err) {
            throw err;
        }
        /* db.collection('relays').findOne({}, function (err, doc) {
            if (err) throw err;
            console.log('/get activado!');
            io.sockets.emit("changes", status._id);
            res.status(200).json(doc);
        }); */

        
    });
});


io.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
    mongo.connect(routedb, function (err, db) {
        if (err) {
            throw err;
        }
        let relays = db.collection('relays');

        // Get chats from mongo collection
        db.collection('relays').findOne({relay: 'rele1'}, function (err, doc) {
            if (err) throw err;
            //res.render('changes', doc);
            io.sockets.emit("changes", doc);
            
        });


        /* relays.find().limit(100).sort({_id:1})(function(err, res){
            if(err){
                throw err;
            }
            // Emit the messages
            console.log(res)
            io.sockets.emit('changes', res);
        }); */


    });

});