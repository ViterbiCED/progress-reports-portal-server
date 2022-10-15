var express = require('express');
var app = express();

var pg = require('pg');

var conString = process.env.DATABASE_URL;
// var conString = "postgres://zxcvatghlmrxwm:f97710d59a7f20aa2ebaf2695a85b90ac8eece051f48edab0409eb497d983473@ec2-18-204-36-213.compute-1.amazonaws.com:5432/db9khoebffecb";
var client;

// Reset db back to initial state
async function create_db() {
  await client.query(`
DROP TABLE if EXISTS public.question_orders;
DROP TABLE if EXISTS public.report_content;
DROP TABLE if EXISTS public.questions;
DROP TABLE if EXISTS public.reports;
DROP TABLE if EXISTS public.mentors_mentees;
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

CREATE TABLE public.questions (
    id integer NOT NULL,
    question character varying NOT NULL,
    type character varying NOT NULL,
    description character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    required boolean DEFAULT true NOT NULL,
    options character varying[]
);

ALTER TABLE public.questions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.report_content (
    report_id integer NOT NULL,
    question_id integer NOT NULL,
    answer character varying NOT NULL
);

CREATE TABLE public.reports (
    id integer NOT NULL,
    mentor_id integer NOT NULL,
    mentee_id integer NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    feedback character varying,
    session_date date NOT NULL,
    name character varying NOT NULL,
    question_order_id integer NOT NULL
);

ALTER TABLE public.reports ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE public.question_orders (
  id integer NOT NULL,
  question_order integer[],
  current boolean DEFAULT true NOT NULL
);

ALTER TABLE public.question_orders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
  SEQUENCE NAME public.question_orders_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1
);

ALTER TABLE ONLY public.administrator_info ALTER COLUMN id SET DEFAULT nextval('public.administrator_info_id_seq'::regclass);

ALTER TABLE ONLY public.mentee_info ALTER COLUMN id SET DEFAULT nextval('public.mentee_info_id_seq'::regclass);

ALTER TABLE ONLY public.mentor_info ALTER COLUMN id SET DEFAULT nextval('public.mentor_info_id_seq'::regclass);

INSERT INTO public.administrator_info (id, name, email) VALUES (1, 'Katherine Munoz', 'kimunoz@usc.edu');
INSERT INTO public.administrator_info (id, name, email) VALUES (2, 'Chloe Kuo', 'cmkuo@usc.edu');
INSERT INTO public.administrator_info (id, name, email) VALUES (3, 'Uma Durairaj', 'cmkuo@usc.edu');

INSERT INTO public.mentee_info (name, usc_id, email, phone_number, major, freshman, semester_entered, meetings, id) VALUES ('Ayushi Mittal', 6894100517, 'ayushimi@usc.edu', 1234567890, 'Computer Engineering and Computer Science', false, 'Fall 2019', 0, 1);

INSERT INTO public.mentor_info (id, name, usc_id, email, phone_number, major) VALUES (1, 'Erica De Guzman', 1234567890, 'ed_139@usc.edu', 1234567890, 'Computer Science');

INSERT INTO public.mentors_mentees (mentee_id, mentor_id, active) VALUES (1, 1, true);

INSERT INTO public.questions (id, question, type, description, active, options) OVERRIDING SYSTEM VALUE VALUES (1, 'Summary', 'Short answer', 'Summary of the meeting', true, NULL);
INSERT INTO public.questions (id, question, type, description, active, options) OVERRIDING SYSTEM VALUE VALUES (2, 'Meeting length', 'Multiple choice', 'How long you met for', true, '{"30 minutes","1 hour"}');

INSERT INTO public.report_content (report_id, question_id, answer) VALUES (1, 1, 'This is our first meeting');
INSERT INTO public.report_content (report_id, question_id, answer) VALUES (1, 2, '1 hour');

INSERT INTO public.reports (id, mentor_id, mentee_id, approved, feedback, session_date, name, question_order_id) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, false, NULL, '2022-10-12', 'First meeting', 1);

INSERT INTO public.question_orders (id, question_order, current) OVERRIDING SYSTEM VALUE VALUES (1, '{2,1}', false);
INSERT INTO public.question_orders (id, question_order, current) OVERRIDING SYSTEM VALUE VALUES (2, '{1,2}', true);

SELECT pg_catalog.setval('public.administrator_info_id_seq', 6, true);

SELECT pg_catalog.setval('public.mentee_info_id_seq', 4, true);

SELECT pg_catalog.setval('public.mentor_info_id_seq', 2, true);

SELECT pg_catalog.setval('public.questions_id_seq', 2, true);

SELECT pg_catalog.setval('public.reports_id_seq', 1, true);

SELECT pg_catalog.setval('public.question_orders_id_seq', 2, true);

ALTER TABLE ONLY public.administrator_info
    ADD CONSTRAINT administrator_info_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.mentee_info
    ADD CONSTRAINT mentee_info_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.mentor_info
    ADD CONSTRAINT mentor_info_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.question_orders
    ADD CONSTRAINT question_orders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.mentors_mentees
    ADD CONSTRAINT fk_mentee FOREIGN KEY (mentee_id) REFERENCES public.mentee_info(id);

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_mentee FOREIGN KEY (mentee_id) REFERENCES public.mentee_info(id);

ALTER TABLE ONLY public.mentors_mentees
    ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES public.mentor_info(id);

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES public.mentor_info(id);

ALTER TABLE ONLY public.report_content
    ADD CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public.questions(id);

ALTER TABLE ONLY public.report_content
    ADD CONSTRAINT fk_report FOREIGN KEY (report_id) REFERENCES public.reports(id);

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_order FOREIGN KEY (question_order_id) REFERENCES public.question_orders(id);

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

async function get_question_order_by_id(id) {
  var result = await client.query(`SELECT question_order FROM question_orders WHERE id = '${id}';`);
  return result.rows;
}

async function get_current_question_order() {
  var result = await client.query(`SELECT id, question_order FROM question_orders WHERE current = TRUE;`);
  return result.rows[0];
}

async function add_progress_report(name, mentor_id, mentee_id, session_date) {
  await client.query(`INSERT INTO reports(name, mentor_id, mentee_id, session_date, question_order_id)
                      VALUES ('${name}', '${mentor_id}', '${mentee_id}', '${session_date}', '${(await get_current_question_order()).id}');`);
};

async function find_progress_reports_by_name(mentor_name, mentee_name) {
  var result = await client.query(`SELECT reports.name, reports.session_date, reports.approved FROM reports, mentor_info, mentee_info
                    WHERE mentor_info.name =  '${mentor_name}' AND reports.mentor_id = mentor_info.id AND mentee_info.name =  '${mentee_name}' AND reports.mentee_id = mentee_info.id;`);
  return result.rows;
};

async function find_progress_reports_by_id(mentor_id, mentee_id) {
  var result = await client.query(`SELECT reports.name, reports.session_date, reports.approved FROM reports
                    WHERE reports.mentor_id = ${mentor_id} AND reports.mentee_id = ${mentee_id};`);
  return result.rows;
};

async function approve_progress_report(id) {
  await client.query(`UPDATE reports SET approved = TRUE WHERE id = ${id};`);
}

async function add_feedback(id, feedback) {
  await client.query(`UPDATE reports SET feedback = '${feedback}' WHERE id = ${id};`);
}

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
  var result = await client.query(`SELECT id, name, email FROM ${role}_info
                    WHERE LOWER(${column_name}) LIKE '%${search_term.toLowerCase()}%';`);
  return result.rows;
}

async function search_users(column_name, search_term) {
  return {
    "mentor": await search_users_of_table("mentor", column_name, search_term),
    "mentee": await search_users_of_table("mentee", column_name, search_term),
    "administrator": await search_users_of_table("administrator", column_name, search_term)
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

async function add_question_mc(question, type, description, options) {
  var result = await client.query(`INSERT INTO questions(question, type, description, options)
                      VALUES ('${question}', '${type}', '${description}', '{${options}}') RETURNING id;`);
  return result.rows[0];
}

async function add_question_text(question, type, description) {
  var result = await client.query(`INSERT INTO questions(question, type, description)
                      VALUES ('${question}', '${type}', '${description}') RETURNING id;`);
  return result.rows[0];
}

async function deactivate_question(id) {
  await client.query(`UPDATE questions SET active = FALSE WHERE id = ${id};`);
}

async function question_not_required(id) {
  await client.query(`UPDATE questions SET required = FALSE WHERE id = ${id};`);
}

async function question_required(id) {
  await client.query(`UPDATE questions SET required = TRUE WHERE id = ${id};`);
}

async function add_report_content(report_id, question_id, answer) {
  await client.query(`INSERT INTO report_content(report_id, question_id, answer)
                      VALUES ('${report_id}', '${question_id}', '${answer}');`);
}

async function delete_question(id) {
  await client.query(`DELETE FROM questions WHERE id = ${id};`);
}

async function get_question_by_id(id) {
  var result = await client.query(`SELECT * FROM questions WHERE id = '${id}';`);
  return result.rows[0];
}

async function set_current_question_order(order) {
  await client.query(`UPDATE question_orders SET current = FALSE WHERE current = TRUE;`);
  if (await check_value_exists("question_orders", "question_order", `{${order}}`)) {
    await client.query(`UPDATE question_orders SET current = TRUE WHERE question_order = '{${order}}';`);
  } else {
    await client.query(`INSERT INTO question_orders(question_order) VALUES ('{${order}}');`);
  }
  // set active statuses accordingly
  await client.query(`UPDATE questions SET active = CASE WHEN id IN (${order}) THEN TRUE ELSE FALSE END;`);
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
    result = await select_table(req.query.table_name);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/add_admin?name=AdminTest&email=admin@usc.edu
*/
app.get('/add_admin', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "email"])) {
    var check = await get_user_roles(req.query.email);
    if (check.role == "invalid") {
      await add_admin(req.query.name, req.query.email);
      result = await select_table("administrator_info");
    }
  }
  send_res(res, result);
})

/*
  http://localhost:3000/add_mentor?name=Sushi&usc_id=123456&email=sushi@usc.edu&phone_number=1234567&major=Cooking
*/
app.get('/add_mentor', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "usc_id", "email", "phone_number", "major"])) {
    var check = await get_user_roles(req.query.email);
    if (check.role == "invalid") {
      await add_mentor(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major);
      result = await select_table("mentor_info");
    }
  }
  send_res(res, result);
});

/*
  http://localhost:3000/add_mentee?name=Test_Mentee&usc_id=543210&email=test@usc.edu&phone_number=98765432&major=Debugging&freshman=True&semester_entered=Fall_2022
*/
app.get('/add_mentee', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "usc_id", "email", "phone_number", "major", "freshman", "semester_entered"])) {
    var check = await get_user_roles(req.query.email);
    if (check.role == "invalid") {
      await add_mentee(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major, req.query.freshman, req.query.semester_entered);
      result = await select_table("mentee_info");
    }
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
  http://localhost:3000/add_progress_report?name=ProgReport&mentor_id=1&mentee_id=1&session_date=2012-08-01
*/
app.get('/add_progress_report', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["name", "mentor_id", "mentee_id", "session_date"])) {
    await add_progress_report(req.query.name, req.query.mentor_id, req.query.mentee_id, req.query.session_date);
    result = await select_table("reports");
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
  http://localhost:3000/approve_report?id=1
*/
app.get('/approve_report', async function (req,res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await approve_progress_report(req.query.id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/add_feedback?id=1&feedback=Approved!
*/
app.get('/add_feedback', async function (req,res) {
  var result = null;
  if (check_query_params(req.query, ["id", "feedback"])) {
    result = await add_feedback(req.query.id, req.query.feedback);
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

/*
  http://localhost:3000/add_question?question=Meeting number&type=Short answer
  http://localhost:3000/add_question?question=Test MC&type=Multiple choice&option=Option 1&option=Option 2&option=Option 3
*/
app.get('/add_question', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["question", "type", "description", "option"])) {
    var options = req.query.option;
    if (typeof req.query.option == 'object') {
      options = req.query.option.join('", "');
    }
    result = await add_question_mc(req.query.question, req.query.type, req.query.description, `"${options}"`);
  } else if (check_query_params(req.query, ["question", "type", "description"])) {
    result = await add_question_text(req.query.question, req.query.type, req.query.description);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/deactivate_question?id=1
*/
app.get('/deactivate_question', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await deactivate_question(req.query.id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/question_not_required?id=1
*/
app.get('/question_not_required', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await question_not_required(req.query.id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/question_required?id=1
*/
app.get('/question_required', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await question_required(req.query.id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/add_report_content?report_id=1&question_id=1&answer=1
*/
app.get('/add_report_content', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["report_id", "question_id", "answer"])) {
    result = await add_report_content(req.query.report_id, req.query.question_id, req.query.answer);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/delete_question?id=4
*/
app.get('/delete_question', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    await delete_question(req.query.id);
  }
  send_res(res, result);
})

/*
  http://localhost:3000/set_current_question_order?order=1,2
*/
app.get('/set_current_question_order', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["order"])) {
    await set_current_question_order(req.query.order);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_question_order_by_id?id=1
*/
app.get('/get_question_order_by_id', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await get_question_order_by_id(req.query.id);
  }
  send_res(res, result);
});

/*
  http://localhost:3000/get_current_question_order
*/
app.get('/get_current_question_order', async function (req, res) {
  var result = await get_current_question_order();
  send_res(res, result);
});

/*
  http://localhost:3000/get_question_by_id?id=1
*/
app.get('/get_question_by_id', async function (req, res) {
  var result = null;
  if (check_query_params(req.query, ["id"])) {
    result = await get_question_by_id(req.query.id);
  }
  send_res(res, result);
});
