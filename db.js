var pg = require('pg');

var conString = "postgres://postgres:401db@localhost:5432/401_db";


function select_table(name) {
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
      client.query('SELECT * from ' + name, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    // console.log(result.rows[0]);
    client.end();
  });
}