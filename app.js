var express = require('express');
var app = express();

var pg = require('pg');

var conString = "postgres://postgres:401db@localhost:5432/401_db";
var client;

async function select_table(name) {
  const result = await client.query(`SELECT * from ${name};`);
  console.log(result.rows);
  return result.rows;
};

async function add_mentor(name, usc_id, email, phone_number, major) {
  await client.query(`INSERT INTO mentor_info (name, usc_id, email, phone_number, major)
                      VALUES ('${name}', '${usc_id}', '${email}', '${phone_number}', '${major}');`);
};

async function add_progress_report(name, mentor_id, mentee_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision) {
  await client.query(`INSERT INTO progress_reports(name, mentor_id, mentee_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision)
                      VALUES ('${name}', '${mentor_id}', '${mentee_id}', '${session_date}', '${summary}', '${smart_goal}', '${academic_development}', '${career_development}', '${personal_development}', '${additional_info}', '${session_length}', '${seeking_supervision}');`);
};

async function find_progress_reports_by_name(mentor_name, mentee_name) {
  var result = await client.query(`SELECT progress_reports.name, progress_reports.session_date, progress_reports.summary FROM progress_reports, mentor_info, mentee_info
                    WHERE mentor_info.name =  '${mentor_name}' AND progress_reports.mentor_id = mentor_info.id AND mentee_info.name =  '${mentee_name}' AND progress_reports.mentee_id = mentee_info.id;`);
  return result.rows;
};

async function find_progress_reports_by_id(mentor_id, mentee_id) {
  var result = await client.query(`SELECT progress_reports.name, progress_reports.session_date, progress_reports.summary FROM progress_reports
                    WHERE progress_reports.mentor_id = ${mentor_id} AND progress_reports.mentee_id = ${mentee_id};`);
  return result.rows;
};

async function check_value_exists(table_name, column_name, value) {
  var result = await client.query(`SELECT EXISTS(SELECT 1 FROM ${table_name} WHERE ${column_name} = '${value}');`);
  return result.rows[0].exists;
}

async function get_user_roles(email) {
  var role = [];
  if (await check_value_exists("administrator_info", "email", email)) {
    role.push("administrator");
  }
  if (await check_value_exists("mentor_info", "email", email)) {
    console.log("pushing mentor")
    role.push("mentor");
  }
  if (await check_value_exists("mentee_info", "email", email)) {
    role.push("mentee");
  }
  return role;
};




app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(process.env.PORT || 3000, async function () {
  console.log('Example app listening on port 3000!');
  client = new pg.Client(conString);
  await client.connect();
  console.log("client connected")
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
  await add_mentor(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major);
  var result = await select_table("mentor_info");
  res.send(result);
});

/*
  http://localhost:3000/add_progress_report?name=ProgReport&mentor_id=1&mentee_id=1&session_date=2012-08-01&summary=SUMMARY&smart_goal=SMART_GOAL&academic_development=ACADEMIC_DEVELOPMENT&career_development=CAREER_DEVELOPMENT&personal_development=PERSONAL_DEVELOPMENT&additional_info=ADDITIONAL_INFO&session_length=45&seeking_supervision=true
*/
app.get('/add_progress_report', async function (req, res) {
  await add_progress_report(req.query.name, req.query.mentor_id, req.query.mentee_id, req.query.session_date, req.query.summary, req.query.smart_goal, req.query.academic_development, req.query.career_development, req.query.personal_development, req.query.additional_info, req.query.session_length, req.query.seeking_supervision);
  var result = await select_table("progress_reports");
  res.send(result);
});

/*
  http://localhost:3000/find_progress_reports_by_name?mentor_name=Erica De Guzman&mentee_name=Ayushi Mittal
*/
app.get('/find_progress_reports_by_name', async function (req, res) {
  var result = await find_progress_reports_by_name(req.query.mentor_name, req.query.mentee_name)
  res.send(result);
});

/*
  http://localhost:3000/find_progress_reports_by_id?mentor_id=1&mentee_id=1
*/
app.get('/find_progress_reports_by_id', async function (req, res) {
  var result = await find_progress_reports_by_id(req.query.mentor_id, req.query.mentee_id)
  res.send(result);
});

/*
  http://localhost:3000/get_user_roles?email=ayushimi@usc.edu
*/
app.get('/get_user_roles', async function (req, res) {
  var result = await get_user_roles(req.query.email)
  res.send(result);
});
