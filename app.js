var express = require('express');
var app = express();

var pg = require('pg');

// var conString = "postgres://nixuzeblmabtrz:73c7332581b166a9d5428507c45b2bb8631b9306f70cda332a7261e96f9cafce@ec2-44-195-132-31.compute-1.amazonaws.com:5432/d712mgqm0188ks";
var conString = process.env.DATABASE_URL;
var client;

async function create_db() {
  await client.query(`
  --
  
  CREATE TABLE public.administrator_info (
      id integer NOT NULL,
      name character varying NOT NULL,
      email character varying NOT NULL
  );
  
  --
  -- TOC entry 210 (class 1259 OID 16399)
  -- Name: administrator_info_id_seq; Type: SEQUENCE; Schema: public; Owner: user
  --
  
  CREATE SEQUENCE public.administrator_info_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;
  
  --
  -- TOC entry 3355 (class 0 OID 0)
  -- Dependencies: 210
  -- Name: administrator_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
  --
  
  ALTER SEQUENCE public.administrator_info_id_seq OWNED BY public.administrator_info.id;
  
  
  --
  -- TOC entry 215 (class 1259 OID 16443)
  -- Name: mentee_info; Type: TABLE; Schema: public; Owner: postgres
  --
  
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
  
  --
  -- TOC entry 217 (class 1259 OID 16469)
  -- Name: mentee_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
  --
  
  CREATE SEQUENCE public.mentee_info_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;
  
  --
  -- TOC entry 3356 (class 0 OID 0)
  -- Dependencies: 217
  -- Name: mentee_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
  --
  
  ALTER SEQUENCE public.mentee_info_id_seq OWNED BY public.mentee_info.id;
  
  
  --
  -- TOC entry 212 (class 1259 OID 16410)
  -- Name: mentor_info; Type: TABLE; Schema: public; Owner: postgres
  --
  
  CREATE TABLE public.mentor_info (
      id integer NOT NULL,
      name character varying NOT NULL,
      usc_id bigint NOT NULL,
      email character varying NOT NULL,
      phone_number bigint NOT NULL,
      major character varying NOT NULL
  );
  
  --
  -- TOC entry 211 (class 1259 OID 16409)
  -- Name: mentor_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
  --
  
  CREATE SEQUENCE public.mentor_info_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;
  
  --
  -- TOC entry 3357 (class 0 OID 0)
  -- Dependencies: 211
  -- Name: mentor_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
  --
  
  ALTER SEQUENCE public.mentor_info_id_seq OWNED BY public.mentor_info.id;
  
  
  --
  -- TOC entry 216 (class 1259 OID 16456)
  -- Name: mentors_mentees; Type: TABLE; Schema: public; Owner: postgres
  --
  
  CREATE TABLE public.mentors_mentees (
      mentee_id integer,
      mentor_id integer
  );
  
  --
  -- TOC entry 214 (class 1259 OID 16429)
  -- Name: progress_reports; Type: TABLE; Schema: public; Owner: postgres
  --
  
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
  
  --
  -- TOC entry 213 (class 1259 OID 16428)
  -- Name: progress_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
  --
  
  CREATE SEQUENCE public.progress_reports_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  
  --
  -- TOC entry 3358 (class 0 OID 0)
  -- Dependencies: 213
  -- Name: progress_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
  --
  
  ALTER SEQUENCE public.progress_reports_id_seq OWNED BY public.progress_reports.id;
  
  
  --
  -- TOC entry 3183 (class 2604 OID 16400)
  -- Name: administrator_info id; Type: DEFAULT; Schema: public; Owner: user
  --
  
  ALTER TABLE ONLY public.administrator_info ALTER COLUMN id SET DEFAULT nextval('public.administrator_info_id_seq'::regclass);
  
  
  --
  -- TOC entry 3188 (class 2604 OID 16470)
  -- Name: mentee_info id; Type: DEFAULT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.mentee_info ALTER COLUMN id SET DEFAULT nextval('public.mentee_info_id_seq'::regclass);
  
  
  --
  -- TOC entry 3184 (class 2604 OID 16413)
  -- Name: mentor_info id; Type: DEFAULT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.mentor_info ALTER COLUMN id SET DEFAULT nextval('public.mentor_info_id_seq'::regclass);
  
  
  --
  -- TOC entry 3185 (class 2604 OID 16432)
  -- Name: progress_reports id; Type: DEFAULT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.progress_reports ALTER COLUMN id SET DEFAULT nextval('public.progress_reports_id_seq'::regclass);
  
  
  --
  -- TOC entry 3340 (class 0 OID 16396)
  -- Dependencies: 209
  -- Data for Name: administrator_info; Type: TABLE DATA; Schema: public; Owner: user
  --
  
  INSERT INTO public.administrator_info (id, name, email) VALUES (4, 'Katherine Munoz', 'kimunoz@usc.edu');
  
  
  --
  -- TOC entry 3346 (class 0 OID 16443)
  -- Dependencies: 215
  -- Data for Name: mentee_info; Type: TABLE DATA; Schema: public; Owner: postgres
  --
  
  INSERT INTO public.mentee_info (name, usc_id, email, phone_number, major, freshman, semester_entered, meetings, id) VALUES ('Ayushi Mittal', 6894100517, 'ayushimi@usc.edu', 1234567890, 'Computer Engineering and Computer Science', false, 'Fall 2019', 0, 1);
  
  
  --
  -- TOC entry 3343 (class 0 OID 16410)
  -- Dependencies: 212
  -- Data for Name: mentor_info; Type: TABLE DATA; Schema: public; Owner: postgres
  --
  
  INSERT INTO public.mentor_info (id, name, usc_id, email, phone_number, major) VALUES (1, 'Erica De Guzman', 1234567890, 'ed_139@usc.edu', 1234567890, 'Computer Science');
  
  
  --
  -- TOC entry 3347 (class 0 OID 16456)
  -- Dependencies: 216
  -- Data for Name: mentors_mentees; Type: TABLE DATA; Schema: public; Owner: postgres
  --
  
  INSERT INTO public.mentors_mentees (mentee_id, mentor_id) VALUES (1, 1);
  
  
  --
  -- TOC entry 3345 (class 0 OID 16429)
  -- Dependencies: 214
  -- Data for Name: progress_reports; Type: TABLE DATA; Schema: public; Owner: postgres
  --
  
  INSERT INTO public.progress_reports (id, name, mentor_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision, approved, feedback, mentee_id) VALUES (1, 'Progress Report #1', 1, '2022-05-06', 'This session went well.', 'The SMART Goal was achieved.', 'There is significant academic development', 'The career development isn''t progressing.', 'The personal development is alright.', 'N/A', 60, true, false, NULL, 1);
  INSERT INTO public.progress_reports (id, name, mentor_id, session_date, summary, smart_goal, academic_development, career_development, personal_development, additional_info, session_length, seeking_supervision, approved, feedback, mentee_id) VALUES (2, 'Progress Report #2', 1, '2022-09-13', 'We had our second meeting!', 'The SMART goal is to sleep more.', 'Ayushi is skipping class.', 'Ayushi has a job!', 'Ayushi is not sleeping.', 'Please advise', 60, true, false, NULL, 1);
  
  
  --
  -- TOC entry 3359 (class 0 OID 0)
  -- Dependencies: 210
  -- Name: administrator_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
  --
  
  SELECT pg_catalog.setval('public.administrator_info_id_seq', 4, true);
  
  
  --
  -- TOC entry 3360 (class 0 OID 0)
  -- Dependencies: 217
  -- Name: mentee_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
  --
  
  SELECT pg_catalog.setval('public.mentee_info_id_seq', 1, true);
  
  
  --
  -- TOC entry 3361 (class 0 OID 0)
  -- Dependencies: 211
  -- Name: mentor_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
  --
  
  SELECT pg_catalog.setval('public.mentor_info_id_seq', 1, true);
  
  
  --
  -- TOC entry 3362 (class 0 OID 0)
  -- Dependencies: 213
  -- Name: progress_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
  --
  
  SELECT pg_catalog.setval('public.progress_reports_id_seq', 4, true);
  
  
  --
  -- TOC entry 3190 (class 2606 OID 16402)
  -- Name: administrator_info administrator_info_pkey; Type: CONSTRAINT; Schema: public; Owner: user
  --
  
  ALTER TABLE ONLY public.administrator_info
      ADD CONSTRAINT administrator_info_pkey PRIMARY KEY (id);
  
  
  --
  -- TOC entry 3196 (class 2606 OID 16472)
  -- Name: mentee_info mentee_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.mentee_info
      ADD CONSTRAINT mentee_info_pkey PRIMARY KEY (id);
  
  
  --
  -- TOC entry 3192 (class 2606 OID 16417)
  -- Name: mentor_info mentor_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.mentor_info
      ADD CONSTRAINT mentor_info_pkey PRIMARY KEY (id);
  
  
  --
  -- TOC entry 3194 (class 2606 OID 16437)
  -- Name: progress_reports progress_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.progress_reports
      ADD CONSTRAINT progress_reports_pkey PRIMARY KEY (id);
  
  
  --
  -- TOC entry 3200 (class 2606 OID 16479)
  -- Name: mentors_mentees fk_mentee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.mentors_mentees
      ADD CONSTRAINT fk_mentee FOREIGN KEY (mentee_id) REFERENCES public.mentee_info(id);
  
  
  --
  -- TOC entry 3198 (class 2606 OID 16484)
  -- Name: progress_reports fk_mentee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.progress_reports
      ADD CONSTRAINT fk_mentee FOREIGN KEY (mentee_id) REFERENCES public.mentee_info(id);
  
  
  --
  -- TOC entry 3197 (class 2606 OID 16438)
  -- Name: progress_reports fk_mentor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.progress_reports
      ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES public.mentor_info(id);
  
  
  --
  -- TOC entry 3199 (class 2606 OID 16464)
  -- Name: mentors_mentees fk_mentor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
  --
  
  ALTER TABLE ONLY public.mentors_mentees
      ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES public.mentor_info(id);
  
  
  -- Completed on 2022-09-13 22:58:34
  
  --
  -- PostgreSQL database dump complete
  --
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

function send_res(res, result) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.send(JSON.stringify(result))
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
  var table_name = req.query.table_name;
  var result = await select_table(table_name);
  send_res(res, result);
});

/*
  http://localhost:3000/add_admin?name=AdminTest&email=admin@usc.edu
*/
app.get('/add_admin', async function (req, res) {
  await add_admin(req.query.name, req.query.email);
  var result = await select_table("administrator_info");
  send_res(res, result);
})

/*
  http://localhost:3000/add_mentor?name=Sushi&usc_id=123456&email=sushi@usc.edu&phone_number=1234567&major=Cooking
*/
app.get('/add_mentor', async function (req, res) {
  await add_mentor(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major);
  var result = await select_table("mentor_info");
  send_res(res, result);
});

/*
  http://localhost:3000/add_mentee?name=Test_Mentee&usc_id=543210&email=test@usc.edu&phone_number=98765432&major=Debugging&freshman=True&semester_entered=Fall_2022
*/
app.get('/add_mentee', async function (req, res) {
  await add_mentee(req.query.name, req.query.usc_id, req.query.email, req.query.phone_number, req.query.major, req.query.freshman, req.query.semester_entered);
  var result = await select_table("mentee_info");
  send_res(res, result);
});

/*
  http://localhost:3000/get_mentees_of_mentor_name?name=Erica De Guzman
*/
app.get('/get_mentees_of_mentor_name', async function (req, res) {
  var result = await get_mentees_of_mentor_name(req.query.name);
  send_res(res, result);
});

/*
  http://localhost:3000/get_mentees_of_mentor_id?id=1
*/
app.get('/get_mentees_of_mentor_id', async function (req, res) {
  var result = await get_mentees_of_mentor_id(req.query.id);
  send_res(res, result);
})

/*
  http://localhost:3000/add_progress_report?name=ProgReport&mentor_id=1&mentee_id=1&session_date=2012-08-01&summary=SUMMARY&smart_goal=SMART_GOAL&academic_development=ACADEMIC_DEVELOPMENT&career_development=CAREER_DEVELOPMENT&personal_development=PERSONAL_DEVELOPMENT&additional_info=ADDITIONAL_INFO&session_length=45&seeking_supervision=true
*/
app.get('/add_progress_report', async function (req, res) {
  await add_progress_report(req.query.name, req.query.mentor_id, req.query.mentee_id, req.query.session_date, req.query.summary, req.query.smart_goal, req.query.academic_development, req.query.career_development, req.query.personal_development, req.query.additional_info, req.query.session_length, req.query.seeking_supervision);
  var result = await select_table("progress_reports");
  send_res(res, result);
});

/*
  http://localhost:3000/find_progress_reports_by_name?mentor_name=Erica De Guzman&mentee_name=Ayushi Mittal
*/
app.get('/find_progress_reports_by_name', async function (req, res) {
  var result = await find_progress_reports_by_name(req.query.mentor_name, req.query.mentee_name)
  send_res(res, result);
});

/*
  http://localhost:3000/find_progress_reports_by_id?mentor_id=1&mentee_id=1
*/
app.get('/find_progress_reports_by_id', async function (req, res) {
  var result = await find_progress_reports_by_id(req.query.mentor_id, req.query.mentee_id)
  send_res(res, result);
});


/*
  http://localhost:3000/get_user_roles?email=ayushimi@usc.edu
*/
app.get('/get_user_roles', async function (req, res) {
  var result = await get_user_roles(req.query.email)
  send_res(res, result);
});


/*
  http://localhost:3000/get_user_info?id=1&role=mentor
*/
app.get('/get_user_info', async function (req, res) {
  var result = await get_user_info(req.query.id, req.query.role)
  send_res(res, result);
});
