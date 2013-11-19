var express = require('express');
var asyncblock = require('asyncblock');
var exec = require('child_process').exec;

var app = express();

app.get('/devices', function(req, res) {
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.listen(process.env.PORT || 8080);
