#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var wsPort = 8000;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(wsPort, function() {
    console.log((new Date()) + ' Server is listening on port '+wsPort);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var clients = {};
var clientID = 0;

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
	var closureForClientID = 'ID'+(++clientID);
	clients[closureForClientID] = connection;
    console.log((new Date()) + ' Connection accepted. : '+closureForClientID);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message from ['+closureForClientID+']: ' + message.utf8Data);
	        for(var client in clients){
		        if(client != closureForClientID){
			        clients[client].sendUTF(message.utf8Data);
		        }
	        }

        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer['+closureForClientID+'] ' + connection.remoteAddress + ' disconnected.');
	    delete clients[closureForClientID];
    });


});


