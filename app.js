var express = require('express');
var app = express();

var pg = require('pg');

var conString = process.env.DATABASE_URL;
// var conString = "postgres://zxcvatghlmrxwm:f97710d59a7f20aa2ebaf2695a85b90ac8eece051f48edab0409eb497d983473@ec2-18-204-36-213.compute-1.amazonaws.com:5432/db9khoebffecb";
var client;

// Reset db back to initial state
async function create_db() {
  await client.query(`
  DROP TABLE if EXISTS public.mentors_mentees;
  DROP TABLE if EXISTS public.progress_reports;
  DROP TABLE if EXISTS public.mentee_info;
  DROP TABLE if EXISTS public.mentor_info;
  DROP TABLE if EXISTS public.administrator_info;

  CREATE TABLE public.administrator_info (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL
  );

  CREATE SEQUENCE public.administrator_info_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  ALTER SEQUENCE public.administrator_info_id_seq OWNED BY public.administrator_info.id;

  CREATE TABLE public.mentee_info (
    name character varying NOT NULL,
    usc_id bigint NOT NULL,
    email character varying NOT NULL,
    phone_number bigint NOT NULL,
    major character varying NOT NULL,
    freshman boolean NOT NULL,
    semester_entered character varying NOT NULL,
    meetings integer DEFAULT 0 NOT NULL,
    id integer NOT NULL
  );

  CREATE SEQUENCE public.mentee_info_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  ALTER SEQUENCE public.mentee_info_id_seq OWNED BY public.mentee_info.id;

  CREATE TABLE public.mentor_info (
      id integer NOT NULL,
      name character varying NOT NULL,
      usc_id bigint NOT NULL,
      email character varying NOT NULL,
      phone_number bigint NOT NULL,
      major character varying NOT NULL
  );

  CREATE SEQUENCE public.mentor_info_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  ALTER SEQUENCE public.mentor_info_id_seq OWNED BY public.mentor_info.id;

  CREATE TABLE public.mentors_mentees (
      mentee_id integer,
      mentor_id integer,
      active boolean DEFAULT true
  );

  CREATE TABLE public.progress_reports (
      id integer NOT NULL,
      name character varying NOT NULL,
      mentor_id integer,
      session_date date NOT NULL,
      summary text NOT NULL,
      smart_goal text NOT NULL,
      academic_development text NOT NULL,
      career_development text NOT NULL,
      personal_development text NOT NULL,
      additional_info text NOT NULL,
      session_length integer NOT NULL,
      seeking_supervision boolean NOT NULL,
      approved boolean DEFAULT false NOT NULL,
      feedback text,
      mentee_id integer
  );

  CREATE SEQUENCE public.progress_reports_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  ALTER SEQUENCE public.progress_reports_id_seq OWNED BY public.progress_reports.id;

  ALTER TABLE ONLY public.administrator_info ALTER COLUMN id SET DEFAULT nextval('public.administrator_info_id_seq'::regclass);

  ALTER TABLE ONLY public.mentee_info ALTER COLUMN id SET DEFAULT nextval('public.mentee_info_id_seq'::regclass);

  ALTER TABLE ONLY public.mentor_info ALTER COLUMN id SET DEFAULT nextval('public.mentor_info_id_seq'::regclass);

  ALTER TABLE ONLY public.progress_reports ALTER COLUMN id SET DEFAULT nextval('public.progress_reports_id_seq'::regclass);

  INSERT INTO public.administrator_info (id, name, email) VALUES (4, 'Katherine Munoz', 'kimunoz@usc.edu');
  INSERT INTO public.administrator_info (id, name, email) VALUES (5, 'Miguel Anzelmetti', 'anzelmet@usc.edu');
  INSERT INTO public.administrator_info (id, name, email) VALUES (6, 'AdminTest', 'admin@usc.edu');

  INSERT INTO public.mentee_info (name, usc_id, email, phone_number, major, freshman, semester_entered, meetings, id) VALUES ('Ayushi Mittal', 6894100517, 'ayushimi@usc.edu', 1234567890, 'Computer Engineering and Computer Science', false, 'Fall 2019', 0, 1);
  INSERT INTO public.mentee_info (name, usc_id, email, phone_number, major, freshman, semester_entered, meetings, id) VALUES ('Tommy Trojan', 1234567890, 'ttrojan@usc.edu', 1234567890, 'Mechanical Engineering', true, 'Fall 2022', 0, 2);
  INSERT INTO public.mentee_info (name, usc_id, email, phone_number, major, freshman, semester_entered, meetings, id) VALUES ('Uma Durairaj', 1234567890, 'uduraira@usc.edu', 1234567890, 'Computer Science', false, 'Fall 2019', 0, 3);
  INSERT INTO public.mentee_info (name, usc_id, email, phone_number, major, freshman, semester_entered, meetings, id) VALUES ('Test_Mentee', 543210, 'test@usc.edu', 98765432, 'Debugging', true, 'Fall_2022', 0, 4);

  INSERT INTO public.mentor_info (id, name, usc_id, email, phone_number, major) VALUES (1, 'Erica De Guzman', 1234567890, 'ed_139@usc.edu', 1234567890, 'Computer Science');
  INSERT INTO public.mentor_info (id, name, usc_id, email, phone_number, major) VALUES (2, 'Chloe Kuo', 123456789, 'cmkuo@usc.edu', 123456789, 'Computer Science');

  INSERT INTO public.mentors_mentees (mentee_id, mentor_id, active) VALUES (1, 1, true);
  INSERT INTO public.mentors_mentees (mentee_id, mentor_id, active) VALUES (2, 1, true);
  INSERT INTO public.mentors_mentees (mentee_id, mentor_id, active) VALUES (3, 2, true);

  INSERT INTO public.progress_reports (id, name, mentor_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision, approved, feedback, mentee_id) VALUES (1, 'Progress Report #1', 1, '2022-05-06', 'This session went well.', 'The SMART Goal was achieved.', 'There is significant academic development', 'The career development isn''t progressing.', 'The personal development is alright.', 'N/A', 60, true, false, NULL, 1);
  INSERT INTO public.progress_reports (id, name, mentor_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision, approved, feedback, mentee_id) VALUES (2, 'Progress Report #2', 1, '2022-09-13', 'We had our second meeting!', 'The SMART goal is to sleep more.', 'Ayushi is skipping class.', 'Ayushi has a job!', 'Ayushi is not sleeping.', 'Please advise', 60, true, false, NULL, 1);
  INSERT INTO public.progress_reports (id, name, mentor_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision, approved, feedback, mentee_id) VALUES (5, 'Initial Progress Report', 1, '2022-09-15', 'We met to figure out a plan for the semester.', 'The SMART Goal is to apply to one job by next Thursday.', 'The student is doing well.', 'The student is working on applying to jobs.', 'Good personal development.', 'N/A', 60, false, false, NULL, 2);

  SELECT pg_catalog.setval('public.administrator_info_id_seq', 6, true);

  SELECT pg_catalog.setval('public.mentee_info_id_seq', 4, true);

  SELECT pg_catalog.setval('public.mentor_info_id_seq', 2, true);

  SELECT pg_catalog.setval('public.progress_reports_id_seq', 5, true);

  ALTER TABLE ONLY public.administrator_info
      ADD CONSTRAINT administrator_info_pkey PRIMARY KEY (id);

  ALTER TABLE ONLY public.mentee_info
      ADD CONSTRAINT mentee_info_pkey PRIMARY KEY (id);

  ALTER TABLE ONLY public.mentor_info
      ADD CONSTRAINT mentor_info_pkey PRIMARY KEY (id);

  ALTER TABLE ONLY public.progress_reports
      ADD CONSTRAINT progress_reports_pkey PRIMARY KEY (id);

  ALTER TABLE ONLY public.mentors_mentees
      ADD CONSTRAINT fk_mentee FOREIGN KEY (mentee_id) REFERENCES public.mentee_info(id);

  ALTER TABLE ONLY public.progress_reports
      ADD CONSTRAINT fk_mentee FOREIGN KEY (mentee_id) REFERENCES public.mentee_info(id);

  ALTER TABLE ONLY public.progress_reports
      ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES public.mentor_info(id);

  ALTER TABLE ONLY public.mentors_mentees
      ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES public.mentor_info(id);

  `);
};

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
                      WHERE mentor_info.name = '${name}' AND mentors_mentees.mentor_id = mentor_info.id AND mentors_mentees.mentee_id = mentee_info.id AND mentors_mentees.active = true;`);
  return result.rows;
}

async function get_mentees_of_mentor_id(id) {
  var result = await client.query(`SELECT mentee_info.name FROM mentee_info, mentors_mentees, mentor_info
                      WHERE mentor_info.id = ${id} AND mentors_mentees.mentor_id = mentor_info.id AND mentors_mentees.mentee_id = mentee_info.id AND mentors_mentees.active = true;`);
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
  var role = "invalid";
  if (await check_value_exists("administrator_info", "email", email)) {
    role = "administrator";
  } else if (await check_value_exists("mentor_info", "email", email)) {
    role = "mentor";
  } else if (await check_value_exists("mentee_info", "email", email)) {
    role = "mentee";
  }
  return {"role": role};
};

async function get_user_info(id, role) {
  var result = await client.query(`SELECT * FROM ${role}_info WHERE id = ${id};`);
  return result.rows[0];
}

async function search_users_of_table(role, column_name, search_term) {
  var result = await client.query(`SELECT id, name FROM ${role}_info
                    WHERE LOWER(${column_name}) LIKE '%${search_term.toLowerCase()}%';`);
  return result.rows;
}

async function search_users(column_name, search_term) {
  return {
    "mentors": await search_users_of_table("mentor", column_name, search_term),
    "mentees": await search_users_of_table("mentee", column_name, search_term),
    "administrators": await search_users_of_table("administrator", column_name, search_term)
  };
};

async function remove_admin(id) {
  await client.query(`DELETE FROM administrator_info WHERE id = ${id};`);
}

async function deactivate_mentorship(mentor_id, mentee_id) {
  await client.query(`UPDATE mentors_mentees SET active = FALSE WHERE mentor_id = ${mentor_id} AND mentee_id = ${mentee_id};`);
}

async function deactivate_mentorship_by_mentor(mentor_id) {
  await client.query(`UPDATE mentors_mentees SET active = FALSE WHERE mentor_id = ${mentor_id};`);
}

async function activate_mentorship(mentor_id, mentee_id) {
  await client.query(`UPDATE mentors_mentees SET active = TRUE WHERE mentor_id = ${mentor_id} AND mentee_id = ${mentee_id};`);
}

async function activate_mentorship_by_mentor(mentor_id) {
  await client.query(`UPDATE mentors_mentees SET active = TRUE WHERE mentor_id = ${mentor_id};`);
}

async function get_active_mentee_ids() {
  var result = await client.query(`SELECT mentee_id FROM mentors_mentees WHERE active = true;`);
  return result.rows;
}

async function get_active_mentorships() {
  var result = await client.query(`SELECT mentee_id, mentor_id FROM mentors_mentees WHERE active = true;`);
  return result.rows;
}

async function get_mentor_of_mentee_id(id) {
  var result = await client.query(`SELECT mentor_id FROM mentors_mentees WHERE mentee_id = ${id};`);
  return result.rows[0];
}



// ===== API CALLS ======

function send_res(res, result) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.send(JSON.stringify(result))
}

function check_query_params(query, params) {
  return params.every(function (element) {
    return Object.keys(query).includes(element);
  });
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(process.env.PORT || 3000, async function () {
  console.log('Example app listening on port 3000!');
  client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  await client.connect();
  console.log("client connected")
});

/*
  http://localhost:3000/create_db
*/
app.get('/create_db', async function (req, res) {
  await create_db();
  var result = await select_table("administrator_info");
  send_res(res, result);
})

app.get('/select_table', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["table_name"])) {
    result = await select_table(table_name);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/add_admin?name=AdminTest&email=admin@usc.edu
*/
app.get('/add_admin', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "email"])) {
    await add_admin(req.query.name, req.query.email);
    result = await select_table("administrator_info");
  }
  send_res(res, result);
})

/*
  http://localhost:3000/add_mentor?name=Sushi&usc_id=123456&email=sushi@usc.edu&phone_number=1234567&major=Cooking
*/
app.get('/add_mentor', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "usc_id", "email", "phone_number", "major"])) {
    await add_mentor(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major);
    result = await select_table("mentor_info");
  }
  send_res(res, result);
});

/*
  http://localhost:3000/add_mentee?name=Test_Mentee&usc_id=543210&email=test@usc.edu&phone_number=98765432&major=Debugging&freshman=True&semester_entered=Fall_2022
*/
app.get('/add_mentee', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "usc_id", "email", "phone_number", "major", "freshman", "semester_entered"])) {
    await add_mentee(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major, req.query.freshman, req.query.semester_entered);
    result = await select_table("mentee_info");
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_mentees_of_mentor_name?name=Erica De Guzman
*/
app.get('/get_mentees_of_mentor_name', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name"])) {
    result = await get_mentees_of_mentor_name(req.query.name);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_mentees_of_mentor_id?id=1
*/
app.get('/get_mentees_of_mentor_id', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await get_mentees_of_mentor_id(req.query.id);
  }
  send_res(res, result);
})

/*
  http://localhost:3000/add_progress_report?name=ProgReport&mentor_id=1&mentee_id=1&session_date=2012-08-01&summary=SUMMARY&smart_goal=SMART_GOAL&academic_development=ACADEMIC_DEVELOPMENT&career_development=CAREER_DEVELOPMENT&personal_development=PERSONAL_DEVELOPMENT&additional_info=ADDITIONAL_INFO&session_length=45&seeking_supervision=true
*/
app.get('/add_progress_report', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "mentor_id", "mentee_id", "session_date", "summary", "smart_goal", "academic_development", "career_development", "personal_development", "additional_info", "session_length", "seeking_supervision"])) {
    await add_progress_report(req.query.name, req.query.mentor_id, req.query.mentee_id, req.query.session_date, req.query.summary, req.query.smart_goal, req.query.academic_development, req.query.career_development, req.query.personal_development, req.query.additional_info, req.query.session_length, req.query.seeking_supervision);
    result = await select_table("progress_reports");
  }
  send_res(res, result);
});

/*
  http://localhost:3000/find_progress_reports_by_name?mentor_name=Erica De Guzman&mentee_name=Ayushi Mittal
*/
app.get('/find_progress_reports_by_name', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["mentor_name", "mentee_name"])) {
    result = await find_progress_reports_by_name(req.query.mentor_name, req.query.mentee_name);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/find_progress_reports_by_id?mentor_id=1&mentee_id=1
*/
app.get('/find_progress_reports_by_id', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["mentor_id", "mentee_id"])) {
    result = await find_progress_reports_by_id(req.query.mentor_id, req.query.mentee_id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_user_roles?email=ayushimi@usc.edu
*/
app.get('/get_user_roles', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["email"])) {
    result = await get_user_roles(req.query.email);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_user_info?id=1&role=mentor
*/
app.get('/get_user_info', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id", "role"])) {
    result = await get_user_info(req.query.id, req.query.role);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/search_users_by_name?name=Eric
*/
app.get('/search_users_by_name', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name"])) {
    result = await search_users("name", req.query.name);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/search_users_by_email?email=yus
*/
app.get('/search_users_by_email', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["email"])) {
    result = await search_users("email", req.query.email);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/remove_admin?id=5
*/
app.get('/remove_admin', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    await remove_admin(req.query.id);
    result = await select_table("administrator_info");
  }
  send_res(res, result);
})

/*
  http://localhost:3000/deactivate_mentor_mentee?mentor_id=1&mentee_id=1
*/
app.get('/deactivate_mentor_mentee', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["mentor_id",, "mentee_id"])) {
    result = await deactivate_mentorship(req.query.mentor_id, req.query.mentee_id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/deactivate_mentor_mentee?mentor_id=1
*/
app.get('/deactivate_mentorship_mentor', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["mentor_id"])) {
    result = await deactivate_mentorship_by_mentor(req.query.mentor_id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/activate_mentor_mentee?mentor_id=1&mentee_id=1
*/
app.get('/activate_mentor_mentee', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["mentor_id", "mentee_id"])) {
    result = await activate_mentorship(req.query.mentor_id, req.query.mentee_id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/activate_mentor_mentee?mentor_id=1
*/
app.get('/activate_mentorship_mentor', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["mentor_id"])) {
    result = await activate_mentorship_by_mentor(req.query.mentor_id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_active_mentee_ids
*/
app.get('/get_active_mentee_ids', async function (req, res) {
  var result = await get_active_mentee_ids();
  send_res(res, result);
});

/*
  http://localhost:3000/get_active_mentorships
*/
app.get('/get_active_mentorships', async function (req, res) {
  var result = await get_active_mentorships();
  send_res(res, result);
});

/*
  http://localhost:3000/get_mentor_of_mentee_id?id=1
*/
app.get('/get_mentor_of_mentee_id', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await get_mentor_of_mentee_id(req.query.id);
  }
  send_res(res, result);
});