var fs = require("fs");
var http = require("http");
var url = require("url");

http.createServer(htmlRoute).listen(8080, function() {
	console.log("Server running");
});


function htmlRoute(req, res){
	var src = getPath(req.url);
	fs.readFile(src, function(err, data) {
		if(err){
			res.writeHead(404, {});
			res.end();
		}else{
			var headers = {};
				headers['Content-Type']=filterContentType(src);
			res.writeHead(200, headers);
			res.end(data);
		}
	});
}

function filterContentType(fileName_){
	var idx = fileName_.lastIndexOf('.');
	if(idx > 0){
		switch(fileName_.substr(idx+1).toLowerCase()){
			case 'js':
				return "text/javascript";
		}
	}
}

function getPath(reqUrl_){
	switch(url.parse(reqUrl_).pathname){
		case "/":
			return 'websocket_client.html';
		case "/webrtc":
			return 'webrtc_demo.html';
		default:
			if(reqUrl_.charAt(0) == '/'){
				return reqUrl_.substring(1);
			}else{
				return reqUrl_;
			}
	}
}