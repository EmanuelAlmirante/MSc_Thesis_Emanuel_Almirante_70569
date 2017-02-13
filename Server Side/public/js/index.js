$(document).ready(function()  {
    var connections = {};

    //Get the ID from the server
    // PeerJS object
    var peer = new Peer({
        host: 'localhost',
        port: 9000,
        path: '/peerjs',
        debug: 3,
        config: {
            'iceServers': [{
                url: 'stun:stun1.l.google.com:19302'
            }, ]
        }
    });

    peer.on('open', function() {
        $('#id').text(peer.id);
    });

    //in case of error
    peer.on('error', function(e) {
        alert(e.message);
    })

    //Awaits for the connection
    peer.on('connection', function(friend) {
        console.log('Connected to ' + friend);
    });


    $('video source').each(function(i, video) {
        var videoData = $(video).attr('data-src');
        $(video).attr('src', videoData);
    });
});