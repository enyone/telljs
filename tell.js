/** telljs
* @author Juho Tykkälä, http://www.enymind.fi/
* @copyright 2013 Juho Tykkälä
* @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
* @license http://www.gnu.org/licenses/gpl-2.0.html GNU General Public License, version 2 (one or other)
* @version 0.0.1
*/

var express = require('express');
var exec = require('child_process').exec;
var fs = require('fs');

var app = express();
var devices = [];
var sensors = [];

var pageData = fs.readFileSync('page.html','utf8');
var jsData = fs.readFileSync('jquery+mobile.js','utf8');
var cssData = fs.readFileSync('jquery.css','utf8');

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', pageData.length);
  res.end(pageData);
});

app.get('/js', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', jsData.length);
  res.end(jsData);
});

app.get('/css', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', cssData.length);
  res.end(cssData);
});

app.get('/device/on/:id', function(req, res) {
  exec('tdtool --on ' + parseInt(req.params.id), function(error, stdout, stderr) {} );
  var body = '{error: false}';
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/device/off/:id', function(req, res) {
  exec('tdtool --off ' + parseInt(req.params.id), function(error, stdout, stderr) {} );
  var body = '{error: false}';
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/devices', function(req, res) {
  var body = JSON.stringify(devices);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/sensors', function(req, res) {
  var body = JSON.stringify(sensors);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

var timer = setInterval(function() {
  exec('tdtool --list-devices', function(error, stdout, stderr) {
    devices = [];
    var devicesString = stdout.replace('\r', '').split('\n');
    
    for(indexX in devicesString) {
      var deviceParams = devicesString[indexX].split('\t');
      var params = {};
      
      if(deviceParams.length < 4)
        continue;
      
      for(indexY in deviceParams) {
         var param = deviceParams[indexY].split('=');
         if(param[0] == 'type') params.type = param[1];
         else if(param[0] == 'id') params.id = param[1];
         else if(param[0] == 'name') params.name = param[1];
         else if(param[0] == 'lastsentcommand') params.lastsentcommand = param[1];
         else continue;
      }
      devices.push(params);
    }
  });
  
  exec('tdtool --list-sensors', function(error, stdout, stderr) {
    sensors = [];
    var sensorsString = stdout.replace('\r', '').split('\n');
    
    for(indexX in sensorsString) {
      var sensorParams = sensorsString[indexX].split('\t');
      var params = {};
      
      if(sensorParams.length < 4)
        continue;
      
      for(indexY in sensorParams) {
         var param = sensorParams[indexY].split('=');
         if(param[0] == 'type') params.type = param[1];
         else if(param[0] == 'protocol') params.protocol = param[1];
         else if(param[0] == 'model') params.model = param[1];
         else if(param[0] == 'id') params.id = param[1];
         else if(param[0] == 'temperature') params.temperature = param[1];
         else if(param[0] == 'humidity') params.humidity = param[1];
         else if(param[0] == 'age') params.age = param[1];
         else continue;
      }
      sensors.push(params);
    }
  });
}, 10000);

// Check tdtool installation
exec('tdtool', function(error, stdout, stderr) {
  if(error != null) {
    if(error.code != 8)
    {
      console.log('Error initializing tdtool: ' + stderr);
      process.exit(1);
    }
  }
});

// Set listening tcp port and start server
var listenPort = process.env.PORT || 8080;
app.listen(listenPort);
console.log('Listening at tcp port ' + listenPort);
