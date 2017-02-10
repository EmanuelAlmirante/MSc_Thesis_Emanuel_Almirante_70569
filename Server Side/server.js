var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

//

app.use(express.static(__dirname + '/public', { etag: false, lastModified: false }));

var server = app.listen(9000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);

});

var PeerServer = ExpressPeerServer(server, options);
var options = {
    debug: true,
    allowDiscovery: true,
    allow_discovery: true
}

app.use('/peerjs', PeerServer);

//Not necessary.
PeerServer.on('connection', function(id) {
    console.log(id)
});