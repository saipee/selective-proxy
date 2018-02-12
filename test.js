var app = require('express')();
var request = require('request');
var http = require('http');
var https = require('https');

var SocksProxyAgent = require('socks-proxy-agent');

require('./index.js')({
    hosts: ["maps.googleapis.com"],
    proxy: 'socks5://192.168.1.43:9999'
});

app.get('/', function (req, res) {
    var req_pipe = request({
        method: 'GET',
        uri: 'http://www.google.com/'
    });
    req_pipe.pipe(res)
    req_pipe.on("error", function (err, data) {
        console.log(err, data);
    });
});




app.listen(3991);