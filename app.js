var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

var pg = require('pg');

var conString = "postgres://postgres:401db@localhost:5432/401_db";

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT * from administrator_info', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0]);
    client.end();
  });
}); 