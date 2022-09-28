var express = require('express');
var app = express();

var pg = require('pg');

var conString = "postgres://postgres:401db@localhost:5432/401_db";

async function select_table(name) {
  var client = new pg.Client(conString);
  await client.connect();
  const result = await client.query('SELECT * from ' + name);
  console.log(result.rows[0]);
  client.end();
  return result.rows[0];
};

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/select', async function (req, res) {
  var table_name = req.query.table_name;
  var result = await select_table("administrator_info");
  res.send(result);
});


