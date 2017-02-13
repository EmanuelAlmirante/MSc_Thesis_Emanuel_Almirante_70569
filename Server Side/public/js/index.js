$(document).ready(function()  {
    var connections = {};

    //Get the ID from the server
    // PeerJS object
    var peer = new Peer({
        // host: '52.18.51.141', servidor online
        // port: 80, servidor online
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

    //Mudar esta coisa.
    // To show the ID of the peer.
    peer.on('open', function() {
        $('#id').text(peer.id);
    });

    //Mudar esta coisa.
    //In case of error.
    peer.on('error', function(e) {
        alert(e.message);
    })

    //Mudar esta coisa.
    //Awaits for the connection. Maybe not necessary.
    peer.on('connection', function(friend) {
        console.log('Connected to ' + friend);
    });

    //To play the video.
    /*$('video source').each(function(i, video) {
        var videoData = $(video).attr('data-src');
        $(video).attr('src', videoData);
    });*/

    var runned = false;
    var interval;

    //Transform the name of the video in base 64, to improve delivery of files.
    function getBase64FromVideoURL(url, done) {
        var video = new Video();

        video.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext('2d');
            ctx.drawVideo(this, 0, 0);
            var dataURL = canvas.toDataURL("video/mp4");
            done(dataURL);
        }

        video.src = url;
    };

    //To do the hash of the video.
    String.prototype.hashCode = function() {
        var hash = null;
        if (this.length == 0) return hash;
        hash = window.btoa(this);
        return hash;
    };

    //Get the video from the server. 
    function getVideoFromServer(opts) {
        var video = document.querySelector('[data-id= "' + opts.id + '"]')

        //Debug, delete.
        var first = new Date();
        //Debug, delete.
        video.onload = function() {
            var last = new Date();
            console.log(opts.fullurl + ' : server video loading : ' + (last - first) + ' ms');
        };

        video.setAttribute('src', opts.datasrc);

        getBase64FromVideoURL(opts.fullurl, function(content) {
            opts.content = content;
            loggerz('server', content);
            storeContent(opts, true);
        });
    }

    //To show the stats in 'Server:' and 'Peer:'.
    function loggerz(type, content, peer) {
        var currentcount = document.getElementById(type + '-count').textContent;
        if (currentcount.length > 0) currentcount = parseInt(currentcount);
        currentcount++;
        document.getElementById(type + '-count').textContent = currentcount.toString();

        var currentsize = document.getElementById(type + 'size').textContent;
        if (currentsize.length > 0) currentsize = parseInt(currentsize);
        currentsize += content.length;
        document.getElementById(type + '-size').textContent = currentsize.toString();

        if (peer) {
            var p = document.getElementById(peer);
            if (p == null) {
                var peerlist = document.getElementById('peerlist');
                var el = document.createElement('li');
                el.setAttribute('id', peer);
                el.textContent = peer + ' ';
                var c = document.createElement('span');
                c.setAttribute('id', peer + '-count');
                var s = document.createElement('span');
                s.setAttribute('id', peer + '-size');
                var spacer1 = document.createElement('span');
                spacer1.textContent = ' file(s) /';
                var spacer2 = document.createElement('span');
                spacer2.textContent = ' bytes';
                peerlist.appendChild(el);
                peerlist.appendChild(c);
                peerlist.appendChild(spacer1);
                peerlist.appendChild(s);
                peerlist.appendChild(spacer2);
            }

            var currentcount = document.getElementById(type + '-count').textContent;
            if (currentcount.length > 0) currentcount = parseInt(currentcount);
            currentcount++;
            document.getElementById(type + '-count').textContent = currentcount.toString();

            var currentsize = document.getElementById(type + 'size').textContent;
            if (currentsize.length > 0) currentsize = parseInt(currentsize);
            currentsize += content.length;
            document.getElementById(type + '-size').textContent = currentsize.toString();
        }
    }



});