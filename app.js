var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var webSocket = require('websocket').w3cwebsocket;
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');

var port = 8084;

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('resources/config/properties');

app.use(express.static(path.join(__dirname, 'resources')));

var upload = multer({
    dest: 'uploads/'
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) { // Send the response to index.html
    res.sendFile(__dirname + '/index.html');
});

var ws_server = properties.get('ws.server');

io.sockets.on('connection', function (socket) { // Wait for the incoming connection from the browser, the Socket.io client from index.html

    socket.on('run', function (data) { // Wait for the incoming data with the 'run' event and send data

        var client = new webSocket(ws_server); // connet to the ASPServerExecutor
        console.log(ws_server + " path"); // debug string

        client.onopen = function () { // Opens the connection and send data 
            client.send(data);
            console.log(data + " from gui"); // debug string
        };
        client.onerror = function () {
            socket.emit('problem', {
                reason: "Sorry the connection lost, please try again later!"
            });
        };
        client.onmessage = function (output) { // Wait for the incoming data from the ASPServerExecutor
            var model = JSON.parse(output.data);
            console.log(model + " from ASPServerExecutor"); // debug string
            socket.emit('output', model); // Socket.io calls emit() to send data to the browser.

        };

    });
});

app.post("/file-upload", upload.single('file'), function (req, res, next) {
    fs.readFile(req.file.path, 'utf8', function (err, data) { // read file from the request
        res.send(data); // send contents 
    });
    fs.unlinkSync(req.file.path);
    console.log("file deleted!");
});



server.listen(port, function () {
    console.log('App listening on port ' + port);
});