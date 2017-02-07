var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var server = app.listen(9000);
var options = { allow_discovery: true }
var PeerServer = ExpressPeerServer(server, options);

app.set("trust proxy", true);

app.use('/peerjs', PeerServer);

//Not necessary.
PeerServer.on('connection', function(id) {
    console.log(id)
});