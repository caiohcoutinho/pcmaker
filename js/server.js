var http = require("http");
var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs')
var mongojs = require("mongojs");

var uri = "mongodb://pcmaker:a36141af7b34b31e45eb769238bc1c17@ds055690.mongolab.com:55690/pcmaker";
var db = mongojs.connect(uri, ["catalog"]);

var app = connect();

app.use("/css",serveStatic("css", {"index": false}));
app.use("/js", serveStatic("js", {"index": false}));
app.use("/fonts", serveStatic("fonts", {"index": false}));

app.use("/catalog", function(req, res, next){
	db.catalog.find().toArray(function(err, items){
		res.writeHead(200, {'Content-Type': 'text/json'});
		res.write(JSON.stringify(items));
		res.end();
	});
});

app.use("/favicon.ico",function(req, res, next){
	res.end();
});
app.use("/pcmaker.html",function(req, res, next){
	fs.readFile('pcmaker.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});
app.use("/", function(req, res, next){
	res.writeHead(302, {
	  'Location': '/pcmaker.html'
	});
	res.end();
});

http.createServer(app).listen(8888);

console.log("Server up!");


// login no banco
//pcmaker
//a36141af7b34b31e45eb769238bc1c17
//
// uri: mongodb://pcmaker:a36141af7b34b31e45eb769238bc1c17@ds055690.mongolab.com:55690/pcmaker