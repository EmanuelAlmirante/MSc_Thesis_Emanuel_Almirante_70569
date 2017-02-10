var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var server = app.listen(9000, '127.0.0.1');
var options = { allow_discovery: true }
var PeerServer = ExpressPeerServer(server, options);
var ip;

app.enable('trust proxy');

app.use('/', PeerServer);

PeerServer.on('connection', function(id) {
    console.log(id)
});

app.use(express.static(__dirname + '/public'));