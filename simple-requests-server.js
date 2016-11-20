var express = require('express');
var url  = require("url");
const util = require('util');
var app = express();

var port = 8081;

var methods = ["get", "post", "head"];

var responseFunction = function(headers) {
    return function(req, res) {
        
        headers && res.writeHead(200, headers);
        
        res.end(JSON.stringify({
            "req" : util.inspect(req.headers, false),
            "res" : util.inspect(res._headers, false)
        }));
    }
}


/*For preflighed requests*/
app['options']('/allowed', responseFunction({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers' : 'X-PINGOTHER' //only allow a custom header 'X-PINGOTHER'
}));
/* allow credential request of prefilghted requests */
app['options']('/credentials', responseFunction({
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
    'Access-Control-Allow-Credentials': true
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers' : 'X-PINGOTHER' //only allow a custom header 'X-PINGOTHER'
}));

methods.forEach(function(method) {
    
    /*  https://developer.mozilla.org/en-US/docs/Web/HTTP/Server-Side_Access_Control#Simple_cross-site_requests */
    app[method]('/', responseFunction());
    
    app[method]('/allowed', responseFunction({
        'Access-Control-Allow-Origin': 'http://127.0.0.1:8080' //or '*' to allow wildcard origin
    }));
    
    /*For credential request*/
    app[method]('/credentials', responseFunction({
        /**
        * Note that in the case of credentialed requests, the Access-Control-Allow-Origin: header must not have a wildcard value of "*".  
        * It must mention a valid origin domain.
        */
        'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
        'Access-Control-Allow-Credentials': true
    }));
});

//router first
app.use(express.static('public'));

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
