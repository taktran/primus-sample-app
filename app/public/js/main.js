/*global Primus:true */
(function (){
  'use strict';

  var PRIMUS_URL = 'http://localhost:9999/',
      primus = Primus.connect(PRIMUS_URL);

  primus.on('open', function open() {
    console.log('Connection open');
  });

  primus.on('error', function error(err) {
    console.error('Error:', err, err.message);
  });

  primus.on('reconnect', function () {
    console.log('Reconnect attempt started');
  });

  primus.on('reconnecting', function (opts) {
    console.log('Reconnecting in %d ms', opts.timeout);
    console.log('This is attempt %d out of %d', opts.attempt, opts.retries);
  });

  primus.on('end', function () {
    console.log('Connection closed');
  });

  primus.on('data', function message(data) {
    $(".data").append("<p>" + data + "</p>");
  });

  $("button[type=submit]").click(function(event) {
    var msg = $(".msg").val();
    primus.write(msg);

    // Clear text box
    $(".msg").val("");

    event.preventDefault();
  });
})();