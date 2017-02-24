var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

//Not necessary, only for debugging.
app.use(function(req, res, next) {

    if (req.path.indexOf('video') != -1) {
        console.log('Streaming video: ' + req.path);

    }

    next();

});

/*app.get('/streamer/' + peer.id, function(req, res) {

    res.send('Streamer');

});*/


app.use(express.static(__dirname + '/public', { etag: false, lastModified: false }));

var server = app.listen(8000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);

});

var options = {

    debug: true,
    allowDiscovery: true,
    allow_discovery: true,

};

app.use('/peerjs', ExpressPeerServer(server, options));