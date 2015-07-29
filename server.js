
var express = require('express');
var url  = require("url");
var app = express();

var port = 8081;

app.get('/cors_not_work', function (req, res) {

    console.log("Got a cors_not_work");

    var callback = url.parse(req.url, true).query.callback || "myCallback";
    console.log(url.parse(req.url, true).query.callback);

    var data = {
        'name': "Gianpiero",
        'last': "Fiorelli",
        'age': 37
    };

    data = callback + '(' + JSON.stringify(data) + ');';
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(data);
});

app['head']('/', function (req, res) {
    console.log("Got a HEAD request for the homepage");
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end('Hello CORS HEAD');
});

app['options']('/', function (req, res) {
    console.log("Got a OPTIONS request for the homepage");
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers' : 'X-PINGOTHER'
    });
    res.end("Hello CORS OPTIONS");
});

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers' : 'X-PINGOTHER'
    });
    res.end('Hello CORS GET');
});

// This responds a POST request for the homepage
app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1:' + port,
        'Access-Control-Allow-Credentials' : true
    });
    res.end('Hello CORS POST');
});

//router first
app.use(express.static('public'));
var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});
