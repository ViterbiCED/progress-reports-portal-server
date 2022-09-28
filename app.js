var express = require('express');
var app = express();

var pg = require('pg');

var conString = "postgres://postgres:401db@localhost:5432/401_db";

async function select_table(name) {
  var client = new pg.Client(conString);
  await client.connect();
  const result = await client.query(`SELECT * from ${name};`);
  console.log(result.rows);
  client.end();
  return result.rows;
};

async function add_mentor(name, usc_id, email, phone_number, major) {
  var client = new pg.Client(conString);
  await client.connect();
  await client.query(`INSERT INTO mentor_info (name, usc_id, email, phone_number, major)
                      VALUES ('${name}', '${usc_id}', '${email}', '${phone_number}', '${major}');`);
  client.end();
};


app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/select', async function (req, res) {
  var table_name = req.query.table_name;
  var result = await select_table(table_name);
  res.send(result);
});

/*
  http://localhost:3000/add_mentor?name=Sushi&usc_id=123456&email=sushi@usc.edu&phone_number=1234567&major=Cooking
*/
app.get('/add_mentor', async function (req, res) {
  await add_mentor(req.query.name, req.query.usc_id, 
    req.query.email, req.query.phone_number, 
    req.query.major);
  var result = await select_table("mentor_info");
  res.send(result);
});


