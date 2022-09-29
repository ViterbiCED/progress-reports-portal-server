var express = require('express');
var app = express();

var pg = require('pg');

// var conString = "postgres://postgres:401db@localhost:5432/401_db";
var conString = "postgres://qkklgeigacjbcj:bd8db1e0a83be9f41f48c12d0e38a3544f95ee839b851346f5af805c3f962085@ec2-44-207-253-50.compute-1.amazonaws.com:5432/d1comvqekc3lck";
var client;

async function select_table(name) {
  const result = await client.query(`SELECT * from ${name};`);
  console.log(result.rows);
  return result.rows;
};

async function add_admin(name, email) {
  await client.query(`INSERT INTO administrator_info (name, email)
                      VALUES ('${name}', '${email}');`);

};

async function add_mentor(name, usc_id, email, phone_number, major) {
  await client.query(`INSERT INTO mentor_info (name, usc_id, email, phone_number, major)
                      VALUES ('${name}', '${usc_id}', '${email}', '${phone_number}', '${major}');`);
};

async function add_mentee(name, usc_id, email, phone_number, major, freshman, semester_entered) {
  await client.query(`INSERT INTO mentee_info(name, usc_id, email, phone_number, major, freshman, semester_entered)
                      VALUES ('${name}', '${usc_id}', '${email}', '${phone_number}', '${major}', '${freshman}', '${semester_entered}');`);
};

async function get_mentees_of_mentor_name(name) {
  var result = await client.query(`SELECT mentee_info.name FROM mentee_info, mentors_mentees, mentor_info
                      WHERE mentor_info.name = '${name}' AND mentors_mentees.mentor_id = mentor_info.id AND mentors_mentees.mentee_id = mentee_info.id;`);
  return result.rows;
}

async function get_mentees_of_mentor_id(id) {
  var result = await client.query(`SELECT mentee_info.name FROM mentee_info, mentors_mentees, mentor_info
                      WHERE mentor_info.id = ${id} AND mentors_mentees.mentor_id = mentor_info.id AND mentors_mentees.mentee_id = mentee_info.id;`);
  return result.rows;
}

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
  http://localhost:3000/add_admin?name=AdminTest&email=admin@usc.edu
*/
app.get('/add_admin', async function (req, res) {
  await add_admin(req.query.name, req.query.email);
  var result = await select_table("administrator_info");
  res.send(result);
})

/*
  http://localhost:3000/add_mentor?name=Sushi&usc_id=123456&email=sushi@usc.edu&phone_number=1234567&major=Cooking
*/
app.get('/add_mentor', async function (req, res) {
  await add_mentor(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major);
  var result = await select_table("mentor_info");
  res.send(result);
});

/*
  http://localhost:3000/add_mentee?name=Test_Mentee&usc_id=543210&email=test@usc.edu&phone_number=98765432&major=Debugging&freshman=True&semester_entered=Fall_2022
*/
app.get('/add_mentee', async function (req, res) {
  await add_mentee(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major, req.query.freshman, req.query.semester_entered);
  var result = await select_table("mentee_info");
  res.send(result);
});

/*
  http://localhost:3000/get_mentees_of_mentor_name?name=Erica De Guzman
*/
app.get('/get_mentees_of_mentor_name', async function (req, res) {
  var result = await get_mentees_of_mentor_name(req.query.name);
  res.send(result);
});

/*
  http://localhost:3000/get_mentees_of_mentor_id?id=1
*/
app.get('/get_mentees_of_mentor_id', async function (req, res) {
  var result = await get_mentees_of_mentor_id(req.query.id);
  res.send(result);
})

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
