"use strict";

// ------------------------------------------------
// HTTP server
// ------------------------------------------------

var nodeStatic = require('node-static');

var file = new(nodeStatic.Server)('./app/public'),
    port = process.env.PORT || 8080;

var server = require('http').createServer(function(request, response) {
  file.serve(request, response, function(err, res) {
    if (err) {
      response.writeHead(err.status, err.headers);
      response.end();
    }
  });
}).listen(port);

// ------------------------------------------------
// Primus
// ------------------------------------------------

var Primus = require('primus'),
    primus = new Primus(server, {
      transformer: 'sockjs'
    });

primus.on('connection', function(spark) {
  console.log('connection:\t', spark.id);

  spark.on('data', function(data) {
    spark.write("Server says '" + data + "'");
  });
});

primus.on('disconnection', function(spark) {
  console.log('disconnection:\t', spark.id);
});