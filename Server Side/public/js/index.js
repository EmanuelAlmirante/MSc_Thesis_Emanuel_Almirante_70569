$(document).ready(function()  {
    var connections = {};
    var runned = false;
    var interval;

    //Gets the ID from the server and creates a PeerJS object.
    var peer = new Peer({
        // host: '52.18.51.141', servidor online
        // port: 80, servidor online
        host: 'localhost',
        port: 8000,
        path: '/peerjs',
        debug: 3,
    });

    // To show the ID of the peer.
    peer.on('open', function() {
        $('#id').text(peer.id);
    });

    /*Beginning of the collaboration part of the project.*/

    //Compatibility shim.
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    //Receiving a call.
    peer.on('call', function(call) {
        //Answer the call automatically.
        call.answer(window.localStream);
        step3(call);
    });

    function startStream() {
        document.getElementById('myVideoStreamHidden').style.display = "block";
        //Get audio/video stream.
        navigator.getUserMedia({ audio: true, video: true }, function(stream) {
            //Set your video displays.
            $('#my-video').prop('src', URL.createObjectURL(stream));

            window.localStream = stream;

            console.log(peer.id);
            reset();
        }, function() { $('#startStream-error').show(); });
    }

    //Stops the stream.
    function stopStream() {
        document.getElementById('myVideoStreamHidden').style.display = "none";
        localStream.stop();
    }

    function reset() {
        $('#startStream, #displayStreamOfId').hide();
        $('#reset').show();
    }

    function displayStreamOfId(call) {
        //Hang up on an existing call if present.
        if (window.existingCall) {
            window.existingCall.close();
        }

        //Wait for stream on the call, then set peer video display.
        call.on('stream', function(stream) {
            $('#their-video').prop('src', URL.createObjectURL(stream));
        });

        //UI stuff.
        window.existingCall = call;
        $('#their-id').text(call.peer);
        call.on('close', step2);
        $('#step1, #step2').hide();
        $('#step3').show();
    }

    $(function() {
        //Begins the stream of the user. Basically, gets its video and audio and displays.
        $('#start-stream').click(function() {
            //Initiate stream.
            startStream();
        });

        $('#stop-stream').click(function() {
            stopStream();
        });
    });

    /*End of the collaboration part of the project. */






    /*Beginning of the video peerCDN part of the project.*/

    //Mudar/apagar.
    //To play the video.
    /*$('video source').each(function(i, video) {
        var videoData = $(video).attr('data-src');
        $(video).attr('src', videoData);
    });*/


    //Transform the name of the video in base 64, to improve delivery of files. getBase64FromVideoURL
    function getBase64FromVideoURL(url, done) {
        //var video = document.getElementById("video");
        var video = document.createElement("video");
        //video.setAttribute("src", url);
        console.log(video);
        //var video = document.createElement("video");
        //video.setAttribute("src", "nameOfFile.ogg");

        video.onload = function() {
            console.log('1');
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext('2d');
            ctx.drawVideo(this, 0, 0);
            var dataURL = canvas.toDataURL("video/mp4");
            done(dataURL);
        }

        video.src = url;
        console.log(video);
        console.log(url);
    };

    //To do the hash of the video.
    String.prototype.hashCode = function() {
        var hash = null;
        if (this.length == 0) return hash;
        hash = window.btoa(this);
        console.log(hash);
        return hash;
    };

    //Get the video from the server. 
    function getVideoFromServer(opts) {
        var video = document.querySelector('[data-id= "' + opts.id + '"]');
        console.log(video);

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
        //Debug, apagar depois.
        console.log(currentcount);
        if (currentcount.length > 0) currentcount = parseInt(currentcount);
        //Debug, apagar depois.
        console.log(currentcount);
        currentcount++;
        //Debug, apagar depois.
        console.log(currentcount);
        document.getElementById(type + '-count').textContent = currentcount.toString();
        //Debug, apagar depois.
        console.log(document.getElementById(type + '-count').textContent);

        var currentsize = document.getElementById(type + '-size').textContent;
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

    //Configure connection between peers and server and peers and peers.
    function configureConnection(conn, done) {
        conn.on('data', function(data) {
            if (data && !data.request && data.hash && window.localStorage) {
                //Debug, apagar depois.
                console.log('got data');
                console.log(data);
                console.log('************************');
                document.querySelector('data-id="' + data.id + '"]').src = data.content;
                loggerz('peer', data.content, conn.peer);
                storeContent(data, true);
            } else if (data && data.request && data.hash && window.localStorage) {
                if (window.localStorage[data.hash] != undefined) {
                    //Debug, apagar depois.
                    console.log('got request data');
                    console.log(window.localStorage[data.hash]);
                    var toSend = JSON.parse(window.localStorage[data.hash]);
                    //Debug, apagar depois.
                    console.log(toSend);
                    conn.send(toSend);
                }
            } else {
                //Debug, apagar depois.
                console.log('alternative');
                console.log(data);
            }
        });

        if (done !== undefined) {
            done();
        } else {
            //Debug, apagar depois.
            console.log('no done : ' + conn);
        }
    }

    //Store the hash of the content and announce it.
    function storeContent(opts, announce) {
        window.localStorage[opts.hash] = JSON.stringify(opts);
        if (announce) peer.announceContent(opts.hash);
    }

    //Connect to a peer and request the content.
    function connectAndRequest(opts, list) {
        var chosenOne = list[Math.floor(Math.random() * list.length)];
        var conn = connections[chosenOne];

        if (conn == undefined) {
            conn = peer.connect(chosenOne);
            connections[chosenOne] = conn;
            conn.on('open', function() {
                configureConnection(conn, function() {
                    console.log('REQ _ ' + opts.fullurl);
                    conn.send({ request: true, hash: opts.hash });
                })
            });
            conn.on('error', function(err) { alert(err); });
        } else {
            var timesTried = 0;
            var random = Math.random();
            var intv = setInterval(function() {
                if (conn.open) {
                    clearTimeout(intv);
                    console.log('REQ _ ' + opts.fullurl);
                    conn.send({ request: true, hash: opts.hash });
                } else {
                    timesTried++;
                    console.log('closed');
                    if (timesTried == 3) {
                        clearTimeout(intv);
                        console.log('REQ _ ' + opts.fullurl);
                        getVideoFromServer(opts);
                    }
                }
            }, 500);
        }
    }

    peer.on('connection', configureConnection);

    window.onload = function() {
        interval = setInterval(function() {
            if (peer.open && !runned) {
                //Debug, apagar depois.
                console.log('runnerz');
                runned = true;
                window.clearTimeout(interval);
                var video = document.querySelectorAll("video");
                var index;
                //Debug, apagar depois.
                console.log("video " + video.length);
                for (index = 0; index < video.length; index++) {
                    (function(idx) {
                        var currentVideo = video[idx];
                        var videoOptions = {};

                        //Debug, apagar depois.
                        console.log(currentVideo.getAttribute('data-src'));
                        var datasrc = currentVideo.getAttribute('data-src');
                        var hashens = datasrc.hashCode();
                        var fullurl = datasrc;

                        currentVideo.setAttribute('data-id', hashens);

                        videoOptions.id = currentVideo.getAttribute('data-id');
                        videoOptions.datasrc = datasrc;
                        videoOptions.hash = hashens;
                        videoOptions.fullurl = fullurl;

                        if (false) {
                            //Debug, apagar depois.
                            console.log('truedom');
                            video[index].setAttribute('src', videoOptions.datasrc);
                        } else {
                            peer.listAllPeersWithContent(videoOptions.hash, function(list) {
                                if (list && list.length == 0) {
                                    //Debug, apagar depois.
                                    console.log('servs');
                                    getVideoFromServer(videoOptions);
                                } else {
                                    //Debug, apagar depois.
                                    console.log('peerz');
                                    connectAndRequest(videoOptions, list);
                                }
                            });
                        }
                    })(index);
                }
            }
        }, 500);
    };
    /*End of the video peerCDN part of the project.*/

});