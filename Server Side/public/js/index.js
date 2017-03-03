$(document).ready(function() {

    //Gets the ID from the server and creates a PeerJS object.
    var peer = new Peer({

        // host: '52.18.51.141', servidor online
        // port: 80, servidor online
        host: 'localhost',
        port: 8000,
        path: '/peerjs',
        debug: 3,

    });

    /*Beginning of the collaboration part of the project. NEED TO DO THE announceStream() AND SEE IF */
    /*I CAN NOT ASK FOR THE WEBCAM OF THE PEER THAT WANTS TO CONNECT TO A PEER STREAMING */

    // Compatibility shim
    /*navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // To show the ID of the peer.
    peer.on('open', function() {

        $('#id').text(peer.id);

    });

    //List to save all incoming calls that a peer receives.
    var inCalls = [];

    //When the peer receives a request to connect to it's stream.
    peer.on('call', function(call) {

        //Answer the call automatically (instead of prompting user) for demo purposes.
        call.answer(window.localStream);

        //Adds a new incoming call to the incoming calls list.
        inCalls.push(call);

    });

    //If there is an error.
    peer.on('error', function(err) {

        alert(err.message);

    });*/

    /*function storeContent(opts, announce) {
        window.localStorage[opts.hash] = JSON.stringify(opts);
        if (announce) peer.announceContent(opts.hash);
    }*/

    //Begins the stream of the user. Basically, gets its video and audio and displays to the user.
    /*function startStream() {

        var constraints = { audio: true, video: true };

        navigator.getUserMedia(constraints, function(stream) {

            $('#myvideo').prop('src', URL.createObjectURL(stream));
            window.localStream = stream;
            document.getElementById('myVideoStreamHidden').style.display = "block";

            streamId = btoa(peer.id);
            streamId = JSON.stringify(streamId);
            peer.announceStream(streamId);

        }, function(err) { console.log(err.name + ": " + err.message); });

    };*/

    //Stops users own stream. 
    /*function stopOwnStream(inCalls) {

        //Hide the div where the video is.
        document.getElementById('myVideoStreamHidden').style.display = "none";

        //Stops the video and audio tracks.
        localStream.stop();

        //Closes all the incoming calls.
        for (var i = 0; i < inCalls.length; i++) {

            inCalls[i].close();

        };

        //Resets the list to save all incoming calls that a peer receives.
        var inCalls = [];

    };

    //It connects and shows the stream we want. Is it possible to not ask for permissions?
    function showTheirStream() {

        //List to save all outgoing calls that a peer does.
        var outCalls = [];

        var constraints = { audio: false, video: true };

        navigator.getUserMedia(constraints, function(NULL) {

            $('#mytheirvideo').prop('src', URL.createObjectURL(NULL));

            window.localStreamVideo = NULL;

            var call = peer.call(document.getElementById('calltoid').value, NULL);

            document.getElementById('theirVideoStreamHidden').style.display = "block";

            call.on('stream', function(stream) {

                $('#theirvideo').prop('src', URL.createObjectURL(stream));
                window.remoteTheirStream = stream;

            });

            localStreamVideo.stop();

            window.existingCall = call;

            //Adds a new outgoing call to the outgoing calls list.
            outCalls.push(call);

        }, function(err) { console.log(err.name + ": " + err.message); });

    };


    //It stops the stream that we are watching.
    function stopTheirStream(outCalls) {

        //Hide the div where the video is.
        document.getElementById('theirVideoStreamHidden').style.display = "none";

        //Closes all the incoming calls.
        for (var i = 0; i < outCalls.length; i++) {

            outCalls[i].close();

        };

        //Resets the list to save all outgoing calls that a peer does.
        var outCalls = [];

    };

    //Initiate stream.
    $('#startstream').click(function() {

        startStream();

    });

    //Terminate stream.
    $('#stopownstream').click(function() {

        stopOwnStream(inCalls);

    });

    //Connects to a third party stream.
    $('#submitcalltoid').click(function() {

        showTheirStream();

    });

    //Terminate stream we are watching.
    $('#stoptheirstream').click(function() {

        stopTheirStream(outCalls);

    });*/

    /*End of the collaboration part of the project. */

    /*Beginning of the video peerCDN part of the project.*/

    var connections = {};
    var runned = false;
    var interval;

    //To play the video.
    $('video source').each(function(i, video) {
        var videoData = $(video).attr('data-src');
        $(video).attr('src', videoData);
        console.log(video);
    });


    //Transform the name of the video in base 64, to improve delivery of files. 
    function getBase64FromVideoURL(url, done) {
        var video = document.createElement("video");

        video.onloadstart = function() {
            console.log('1');
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext('2d');
            drawVideo(ctx, video, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL("video/mp4");
            console.log(dataURL);
            done(dataURL);
        }

        video.src = url;
        console.log(video);
        console.log(url);
    };

    function drawVideo(context, video, width, height) {

        context.drawImage(video, 0, 0, width, height);
        var delay = 100;
        setTimeout(drawVideo, delay, context, video, width, height);

    }

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
        console.log(first);
        //Debug, delete.
        video.onloadstart = function() {
            console.log(first);
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
                var video = document.querySelectorAll("#mainvideo");
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