--
-- PostgreSQL database dump
--

\restrict EhaLNqbwpYpUHAhk5OUqEhkfWBk5FCDBdKn3uxlFWHTsTXt8UbQxLDF57kyQobb

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ReportReason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReportReason" AS ENUM (
    'SPAM',
    'HARASSMENT',
    'INAPPROPRIATE_CONTENT',
    'FALSE_INFORMATION',
    'OTHER'
);


ALTER TYPE public."ReportReason" OWNER TO postgres;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'PENDING',
    'REVIEWED',
    'RESOLVED',
    'DISMISSED'
);


ALTER TYPE public."ReportStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'STUDENT',
    'PROFESSOR',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id text NOT NULL,
    "userId" text NOT NULL,
    permissions text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id text NOT NULL,
    "reviewId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: course_professors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_professors (
    id text NOT NULL,
    "courseId" text NOT NULL,
    "professorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.course_professors OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    department text NOT NULL,
    credits integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id text NOT NULL,
    "reviewId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- Name: professors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professors (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text,
    department text NOT NULL,
    bio text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.professors OWNER TO postgres;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id text NOT NULL,
    "reviewId" text NOT NULL,
    "userId" text NOT NULL,
    reason public."ReportReason" NOT NULL,
    description text,
    status public."ReportStatus" DEFAULT 'PENDING'::public."ReportStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resolvedAt" timestamp(3) without time zone,
    "resolvedBy" text
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text,
    "professorId" text,
    rating integer NOT NULL,
    difficulty integer,
    workload integer,
    content text NOT NULL,
    "isAnonymous" boolean DEFAULT false NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL,
    "helpfulCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, "userId", permissions, "createdAt", "updatedAt") FROM stdin;
cmiurfhh60000r6q5uuuw4nkz	cmiuft3wm0000bf21cvv2kshv	{ALL}	2025-12-06 20:42:29.561	2025-12-08 17:52:18.983
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, "reviewId", "userId", content, "createdAt", "updatedAt") FROM stdin;
cmj4j0j4f0001jp7wou3ea0zi	cmiuqww8v0001yqcjzz80hsyd	cmiugfqxn0003bf21cl03y0nf	definetely agree with you my friend	2025-12-13 16:44:36.687	2025-12-13 16:44:36.687
cmj4ji02n0005jp7w204krbdk	cmiy5lr640001zxoqndvyycgd	cmiugfqxn0003bf21cl03y0nf	agree with you	2025-12-13 16:58:11.807	2025-12-13 16:58:11.807
cmj4ji6jw0007jp7wqphs3qsq	cmiy5lr640001zxoqndvyycgd	cmiugfqxn0003bf21cl03y0nf	you are right	2025-12-13 16:58:20.205	2025-12-13 16:58:20.205
cmj4jimhm0009jp7wveyxx1fx	cmiuqww8v0001yqcjzz80hsyd	cmiugfqxn0003bf21cl03y0nf	your right	2025-12-13 16:58:40.859	2025-12-13 16:58:40.859
cmj4jl11j000bjp7wbu453etr	cmixfuqe40007ukrrzer3xffk	cmiuft3wm0000bf21cvv2kshv	I think it was mid	2025-12-13 17:00:33.032	2025-12-13 17:00:33.032
cmj5oljhd000110w4hxhxakb8	cmj4gj4np0001njgvf4g67mm2	cmiuft3wm0000bf21cvv2kshv	agree	2025-12-14 12:08:41.181	2025-12-14 12:08:41.181
\.


--
-- Data for Name: course_professors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_professors (id, "courseId", "professorId", "createdAt") FROM stdin;
cmiugd2yp000213jj1vx2m09d	cmiugb6ed000013jjf2k19jbw	cmiugckrs000113jjvj3wsvjx	2025-12-06 15:32:41.665
cmix33i1700061niy86x566zn	cmix1ssip000027517gbgb8u2	cmiugckrs000113jjvj3wsvjx	2025-12-08 11:44:38.156
cmix32vxl00051niye9fxd4kp	cmix2qdca00031niyaaxdbzst	cmj67j8ij001612b8vquc4g1h	2025-12-08 11:44:09.513
cmj67ltsf001712b8rji7296q	cmj66pa62000j12b8cnt960z6	cmj67ic6q001512b8mcnfspsi	2025-12-14 21:00:47.248
cmj67mcde001812b8tc1p9ozv	cmj66ppc7000k12b819lets5a	cmj67ic6q001512b8mcnfspsi	2025-12-14 21:01:11.33
cmj67nrb5001912b8p94ulp9l	cmiugb6ed000013jjf2k19jbw	cmix2s68p00041niy2ceysheq	2025-12-14 21:02:17.344
cmj67nrb5001a12b8lv1zakdp	cmj66nlpo000g12b8sb5xzx9s	cmix2s68p00041niy2ceysheq	2025-12-14 21:02:17.344
cmj67q670001c12b8fu9g0j5s	cmj66o17m000h12b8tkugid23	cmj67pjnf001b12b84vj8s4zj	2025-12-14 21:04:09.948
cmj67sv7a001f12b8njjy1g8v	cmj66hka7000a12b8enxxow4y	cmj67rhfx001d12b8g17hxobc	2025-12-14 21:06:15.669
cmj67sv7a001g12b894glr0ga	cmj66hka7000a12b8enxxow4y	cmj67s3w8001e12b8xl04cmon	2025-12-14 21:06:15.669
cmj67tn9s001h12b8dii6jeja	cmj66i2ak000b12b8a189o3ed	cmj67rhfx001d12b8g17hxobc	2025-12-14 21:06:52.048
cmj67tn9s001i12b8mktoz6pe	cmj66i2ak000b12b8a189o3ed	cmj67s3w8001e12b8xl04cmon	2025-12-14 21:06:52.048
cmj687g2m001t12b84dmr6sqt	cmj66g87z000912b8ai4n846v	cmj67wa8u001l12b8vdwqyv0s	2025-12-14 21:17:35.902
cmj687g2m001u12b803wg68bl	cmj66g87z000912b8ai4n846v	cmj67utni001j12b8bmlbln86	2025-12-14 21:17:35.902
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, code, name, description, department, credits, "createdAt", "updatedAt") FROM stdin;
cmiugb6ed000013jjf2k19jbw	CSCI 1101	Programming Principles I 	Introduction to programming fundamentals using variables, control flow, functions, and basic problem solving.	SITE	6	2025-12-06 15:31:12.806	2025-12-06 15:30:35.858
cmix1ssip000027517gbgb8u2	CSCI 2304	Data Structures & Algorithms	Implementation of core data structures and efficient algorithms.	SITE	6	2025-12-08 11:08:18.911	2025-12-08 11:07:52.145
cmix1tou200012751ccqovsok	CSCI 1202	 Programming Principles II	 Intermediate programming including OOP, recursion, and data handling.	SITE	6	2025-12-08 11:09:00.794	2025-12-08 11:12:47.139
cmj66nlpo000g12b8sb5xzx9s	CSCI 3613	Artificial Intelligence	\N	SITE	6	2025-12-14 20:34:10.476	2025-12-14 20:33:53.707
cmix2pllo00021niydjhrdzae	MATH 2406	Probability & Statistics	Probability theory, distributions, and data analysis.	SITE	6	2025-12-08 11:33:49.597	2025-12-08 11:34:25.544
cmj66o17m000h12b8tkugid23	CSCI 3615	Database Systems 	\N	SITE	6	2025-12-14 20:34:30.563	2025-12-14 20:34:16.418
cmix1yjhh00042751t5msxvj2	WRIT 1101	Writing & Information Literacy I	Foundational academic writing and research skills.	University Core	6	2025-12-08 11:12:47.139	2025-12-14 20:23:32.833
cmix1xe7e00032751j0y3culj	WRIT 1202	Writing & Information Literacy II	Advanced writing, argumentation, and research projects.	University Core	6	2025-12-08 11:11:53.642	2025-12-14 20:23:32.833
cmj669xpe000212b8km8bn45r	LITR 2302 	Literature of Azerbaijan 	\N	University Core	6	2025-12-14 20:23:32.833	2025-12-14 20:23:45.706
cmj66axt3000312b8gf9hm4cz	CULT 1100 	Azerbaijani Culture 	\N	University Core	6	2025-12-14 20:24:19.624	2025-12-14 20:23:54.455
cmj66oo8z000i12b8i7w42mcq	CSCI 3510	Principles of Operating Systems 	\N	SITE	6	2025-12-14 20:35:00.419	2025-12-14 20:34:41.783
cmj66c8yr000512b8jvdc632y	MATH 1100 	Pre-Calculus 	\N	University Core	6	2025-12-14 20:25:20.74	2025-12-14 20:25:01.506
cmj668yaf000112b89byikd60	HIST 2302	History of Azerbaijan 	\N	University Core	6	2025-12-14 20:22:46.936	2025-12-14 20:25:26.67
cmj66dh01000612b81chmswsy	MATH 1111	Calculus I  	\N	SITE	6	2025-12-14 20:26:17.81	2025-12-14 20:25:51.776
cmj66edcr000712b8jlq37s5o	PDEV 2302	Data & Computing Skills 	\N	University Core	6	2025-12-14 20:26:59.739	2025-12-14 20:26:42.415
cmix1ulxa00022751d1mvtlyw	MATH 1222	Calculus II	Integration techniques, sequences, and series.	SITE	6	2025-12-08 11:09:43.678	2025-12-14 20:28:07.026
cmj66bcv5000412b8fdox6qrn	MUSC 1100	Azerbaijani Music Appreciation 	\N	University Core	6	2025-12-14 20:24:39.138	2025-12-14 20:28:33.344
cmj66g87z000912b8ai4n846v	MATH 1101	Discrete Structures 	\N	SITE	6	2025-12-14 20:28:26.399	2025-12-14 20:29:02.019
cmj66f07h000812b8c2jvylxj	SOCS 1102	Global Perspective 	\N	University Core	6	2025-12-14 20:27:29.357	2025-12-14 20:29:02.019
cmj66hka7000a12b8enxxow4y	PHYS 1201	Physics I	\N	SITE	6	2025-12-14 20:29:28.688	2025-12-14 20:29:15.849
cmj66iwa7000c12b8dlkbiyfy	CSCI 2303	 Introduction to Computer Networks 	\N	SITE	6	2025-12-14 20:30:30.896	2025-12-14 20:30:11.872
cmj66i2ak000b12b8a189o3ed	PHYS 1201L 	Physics I Lab 	\N	SITE	2	2025-12-14 20:29:52.028	2025-12-14 20:30:42.42
cmj66jlgh000d12b8la6hjwyv	ENCE 2301	Digital Logic Design 	\N	SITE	6	2025-12-14 20:31:03.521	2025-12-14 20:30:49.003
cmj66k33f000e12b8fqxay39g	MATH 3501	Linear Algebra 	\N	SITE	6	2025-12-14 20:31:26.379	2025-12-14 20:31:11.751
cmix2qdca00031niyaaxdbzst	CSCI 2406	Computer Organization & Architecture	CPU architecture, memory systems, and machine instructions.	SITE	6	2025-12-08 11:34:25.544	2025-12-14 20:32:07.625
cmj66mm73000f12b8oo493qah	PDEV 3900 	Career Development Skills & Strategies 	\N	Personal Development	6	2025-12-14 20:33:24.448	2025-12-14 20:32:23.77
cmj668954000012b8gtl3den6	COMM 1200 	Public Speaking & Persuasion 	Public Speaking & Persuasion focuses on building confident, compelling communication skills to influence, inform, and inspire audiences effectively.	Personal Development	6	2025-12-14 20:22:14.344	2025-12-14 20:33:37.056
cmj66pa62000j12b8cnt960z6	CSCI 3509	Introduction to Software Engineering 	\N	SITE	6	2025-12-14 20:35:28.827	2025-12-14 20:35:12.901
cmj66ppc7000k12b819lets5a	CSCI 3612	Object Oriented Analysis & Design	\N	SITE	6	2025-12-14 20:35:48.488	2025-12-14 20:35:58.02
cmj66sz8n000l12b8fgb8iy3p	CSCI 2408	Computer Graphics 	\N	SITE	6	2025-12-14 20:38:21.288	2025-12-14 20:38:06.62
cmj66thl2000m12b879vfbpzo	CSCI 2407	Theory of Computation 	\N	SITE	6	2025-12-14 20:38:45.062	2025-12-14 20:38:27.089
cmj66u7ig000n12b8ysimqk3c	ENCE 2402	Electric Circuits Design 	\N	SITE	6	2025-12-14 20:39:18.665	2025-12-14 20:39:06.723
cmj66ysxb000s12b8i83v38kv	BUSA 1100 	Fundamentals of Business 	\N	SB	6	2025-12-14 20:42:53.039	2025-12-14 20:42:17.754
cmj66wmwm000p12b84z3429uv	STAT 2301	Business Statistics 	\N	SB	6	2025-12-14 20:41:11.926	2025-12-14 20:42:53.039
cmj66vzdq000o12b88frnidl1	ECON 1103	Principles of Economics 1	\N	SB	6	2025-12-14 20:40:41.438	2025-12-14 20:42:53.039
cmj66zekw000t12b8w9sxckuu	ACCT 1200	Financial Accounting 	\N	SB	6	2025-12-14 20:43:21.105	2025-12-14 20:43:03.22
cmj676klj000u12b8tgpsgp6q	FINC 2400 	Principles of Finance 	\N	SB	6	2025-12-14 20:48:55.495	2025-12-14 20:48:41.158
cmj6776o0000v12b8b47i64oe	MRKT 2400 	Principles of Marketing	\N	SB	6	2025-12-14 20:49:24.097	2025-12-14 20:49:09.642
cmj679tgy000w12b853y0dx60	PBLW 1100 	Constitutional Law 	\N	LLB	6	2025-12-14 20:51:26.962	2025-12-14 20:51:04.533
cmj67abyp000x12b8repl7ewk	PBLW 1101 	Foundations of a Legal System 	\N	LLB	6	2025-12-14 20:51:50.93	2025-12-14 20:51:31.548
cmj67auo5000y12b8ma13atmg	PBLW 1200	Administrative Law 	\N	LLB	6	2025-12-14 20:52:15.173	2025-12-14 20:51:59.114
cmj67crfx000z12b8fo53vaxf	PBLW 1202	Fundamental Rights 	\N	LLB	6	2025-12-14 20:53:44.301	2025-12-14 20:53:22.305
cmj67daxo001012b8fnhqgjuh	PRLW 2301 	Law of Obligations I 	\N	LLB	6	2025-12-14 20:54:09.564	2025-12-14 20:53:52.713
cmj67du88001112b86ocrtiw1	LRES 2301 	Legal Research & Writing I 	\N	LLB	6	2025-12-14 20:54:34.568	2025-12-14 20:54:16.689
cmj67eryp001212b8jqp7wf1d	PUBA 2400	Organizational Behavior 	\N	BAPA	6	2025-12-14 20:55:18.289	2025-12-14 20:54:54.902
cmj67f8sw001312b8gs1lg3l0	PADM 3600 	Crisis Management 	\N	BAPA	6	2025-12-14 20:55:40.112	2025-12-14 20:55:24.435
cmj67fqwn001412b8pvqull3k	MGMT 4701 	Human Resources Management	\N	BAPA	6	2025-12-14 20:56:03.576	2025-12-14 20:55:49.003
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (id, "reviewId", "userId", "createdAt") FROM stdin;
cmixftipg0005ukrrg3tw0zqa	cmiurh1mt0003yqcjm5b37x1l	cmiuft3wm0000bf21cvv2kshv	2025-12-08 17:40:47.476
\.


--
-- Data for Name: professors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professors (id, "firstName", "lastName", email, department, bio, "createdAt", "updatedAt") FROM stdin;
cmiugckrs000113jjvj3wsvjx	Mykhailo 	Medvediev	mmedvediev@ada.edu.az	SITE	Assistant Professor  Computer and Information Sciences	2025-12-06 15:32:18.089	2025-12-06 15:31:45.008
cmix2s68p00041niy2ceysheq	Samir	Mammadov	stmammadov@ada.edu.az	SITE	Instructor  Computer and Information Sciences	2025-12-08 11:35:49.658	2025-12-08 11:35:09.875
cmj67j8ij001612b8vquc4g1h	John	Burns	jburns@ada.edu.az	SITE	Assistant Professor  Computer and Information Sciences	2025-12-14 20:58:46.364	2025-12-14 21:00:14.585
cmj67ic6q001512b8mcnfspsi	Kamila	Ismayilova	kismayilova@ada.edu.az	SITE	Adjunct Instructor, Introduction to Software Engineering	2025-12-14 20:58:04.466	2025-12-14 21:00:14.585
cmj67rhfx001d12b8g17hxobc	Burcu	Ramazanli	bramazanli@ada.edu.az	SITE	Assistant Professor  Engineering	2025-12-14 21:05:11.18	2025-12-14 21:04:40.082
cmj67pjnf001b12b84vj8s4zj	Jamaladdin	Hasanov	jhasanov@ada.edu.az	SITE	Associate Professor, Director of BSIT Program  Computer and Information Sciences	2025-12-14 21:03:40.731	2025-12-14 21:05:11.18
cmj67s3w8001e12b8xl04cmon	Wisam 	Al-Dayyeni	wdayyeni@ada.edu.az	SITE	Professor, Electrical Engineering, Program director of CE, EEE.  Electrical Engineering	2025-12-14 21:05:40.28	2025-12-14 21:05:20.644
cmj67utni001j12b8bmlbln86	Fuad 	Hajiyev	fhajiyev@ada.edu.az	SITE	Assistant Professor  Mathematics	2025-12-14 21:07:46.975	2025-12-14 21:07:23.067
cmj67vd49001k12b88oddw8fb	Abzatdin	Adamov	aadamov@ada.edu.az	SITE	Dean  School of IT and Engineering	2025-12-14 21:08:12.201	2025-12-14 21:07:53.285
cmj67wa8u001l12b8vdwqyv0s	Vugar 	Musayev	vmusayev@ada.edu.az	SITE	Assistant Professor, Associate Dean, Academic Affairs  Mathematics and Statistics	2025-12-14 21:08:55.134	2025-12-14 21:08:16.92
cmj67x26s001m12b8fkmmprtu	Samir 	Rustamov	srustamov@ada.edu.az	SITE	Associate Professor, Director of BSCS Program  Computer and Information Sciences	2025-12-14 21:09:31.348	2025-12-14 21:09:02.946
cmj67xq7s001n12b8a4nb2sb9	Rashad 	Aliyev	raaliyev@ada.edu.az	SITE	Assistant Professor  Computer and Information Science	2025-12-14 21:10:02.489	2025-12-14 21:09:43.461
cmj680n02001o12b8dn9b7buc	Ruslan 	Aliyev	raliyev@ada.edu.az	SB	Associate Dean, Academic Affairs  Economics	2025-12-14 21:12:18.291	2025-12-14 21:11:54.33
cmj6818f0001p12b85swnao3l	Elkin 	Nurmammadov	enurmammadov@ada.edu.az	SB	Vice Rector, Academic Affairs  Assistant Professor, Economics	2025-12-14 21:12:46.045	2025-12-14 21:12:27.454
cmj6822pc001q12b8446p6iub	Aysel 	Bandad	asbandad@ada.edu.az	SB	Senior Instructor  Economics	2025-12-14 21:13:25.296	2025-12-14 21:12:58.629
cmj685ggq001r12b87kr01n9l	Rashad 	Ibadov	ribadov@ada.edu.az	LLB	Dean  School of Law	2025-12-14 21:16:03.098	2025-12-14 21:13:34.733
cmj6867z2001s12b8devoc3cy	Javid 	Gadirov	jgadirov@ada.edu.az	LLB	Associate Dean, Assistant Professor	2025-12-14 21:16:38.75	2025-12-14 21:16:12.724
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, "reviewId", "userId", reason, description, status, "createdAt", "updatedAt", "resolvedAt", "resolvedBy") FROM stdin;
cmiurjf0k0005yqcjtf5owgrd	cmiuqww8v0001yqcjzz80hsyd	cmiuft3wm0000bf21cvv2kshv	SPAM	\N	DISMISSED	2025-12-06 20:45:32.996	2025-12-08 18:16:46.832	\N	cmiuft3wm0000bf21cvv2kshv
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "userId", "courseId", "professorId", rating, difficulty, workload, content, "isAnonymous", "isApproved", "isEdited", "helpfulCount", "createdAt", "updatedAt") FROM stdin;
cmiuqww8v0001yqcjzz80hsyd	cmiuft3wm0000bf21cvv2kshv	cmiugb6ed000013jjf2k19jbw	\N	5	4	3	Took the course in the first semester of university so due to that was hard at first. But prof is amazing and class teaches you a lot	f	t	f	0	2025-12-06 20:28:02.235	2025-12-06 20:43:54.818
cmixfuqe40007ukrrzer3xffk	cmiugfqxn0003bf21cl03y0nf	cmix2pllo00021niydjhrdzae	\N	2	3	3	Literally hardest math course dont take	t	t	t	0	2025-12-08 17:41:44.092	2025-12-08 18:17:02.965
cmj4gj4np0001njgvf4g67mm2	cmiuft3wm0000bf21cvv2kshv	\N	cmix2s68p00041niy2ceysheq	5	3	3	nice teaching	t	t	f	0	2025-12-13 15:35:05.552	2025-12-13 15:36:45.33
cmiurh1mt0003yqcjm5b37x1l	cmiugfqxn0003bf21cl03y0nf	cmiugb6ed000013jjf2k19jbw	\N	5	3	2	not bad I liked	f	t	t	1	2025-12-06 20:43:42.341	2025-12-13 16:45:07.247
cmiy5lr640001zxoqndvyycgd	cmiugfqxn0003bf21cl03y0nf	\N	cmix2s68p00041niy2ceysheq	5	3	3	one of the best professors	f	t	t	0	2025-12-09 05:42:35.19	2025-12-13 16:52:59.363
cmj5oni6k000310w4y5egnjz0	cmiuft3wm0000bf21cvv2kshv	cmix1xe7e00032751j0y3culj	\N	4	4	4	kind of not much informative	t	t	f	0	2025-12-14 12:10:12.812	2025-12-14 12:10:28.521
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt") FROM stdin;
cmiugfqxn0003bf21cl03y0nf	testuser@ada.edu.az	$2a$12$neEn86jMMZX1vEngHmo2nu1rpSuWfboqypdO6OK.BxvhKdK6HHG5q	Test	User	STUDENT	t	2025-12-06 15:34:46.043	2025-12-06 15:34:46.043
cmiuft3wm0000bf21cvv2kshv	zshahbazli20509@ada.edu.az	$2a$12$oyP3mc/0Wdtpl8B5x265rOfsI54n7XrrMrbu73xZiXOWwT0YX0Ici	Zahra	Shahbazli	ADMIN	t	2025-12-06 15:17:09.765	2025-12-08 18:07:58.847
cmiykm0f40002zxoqnbagwnic	lalahuseynova@ada.edu.az	$2a$12$Fz/nQc9o15Gxa8zZF/hAy.0zr3aFHKx891MxlgRvW5Cv8yJMQdg..	Test	Prof	PROFESSOR	t	2025-12-09 12:42:41.44	2025-12-09 12:42:41.44
\.


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: course_professors course_professors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_professors
    ADD CONSTRAINT course_professors_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: professors professors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors
    ADD CONSTRAINT professors_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admins_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "admins_userId_key" ON public.admins USING btree ("userId");


--
-- Name: comments_reviewId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "comments_reviewId_idx" ON public.comments USING btree ("reviewId");


--
-- Name: course_professors_courseId_professorId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "course_professors_courseId_professorId_key" ON public.course_professors USING btree ("courseId", "professorId");


--
-- Name: courses_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX courses_code_key ON public.courses USING btree (code);


--
-- Name: likes_reviewId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "likes_reviewId_idx" ON public.likes USING btree ("reviewId");


--
-- Name: likes_reviewId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "likes_reviewId_userId_key" ON public.likes USING btree ("reviewId", "userId");


--
-- Name: professors_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX professors_email_key ON public.professors USING btree (email);


--
-- Name: reports_reviewId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reports_reviewId_idx" ON public.reports USING btree ("reviewId");


--
-- Name: reports_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reports_status_idx ON public.reports USING btree (status);


--
-- Name: reviews_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_courseId_idx" ON public.reviews USING btree ("courseId");


--
-- Name: reviews_professorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_professorId_idx" ON public.reviews USING btree ("professorId");


--
-- Name: reviews_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_userId_idx" ON public.reviews USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: admins admins_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_reviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: course_professors course_professors_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_professors
    ADD CONSTRAINT "course_professors_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: course_professors course_professors_professorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_professors
    ADD CONSTRAINT "course_professors_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES public.professors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: likes likes_reviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: likes likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_reviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_professorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES public.professors(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict EhaLNqbwpYpUHAhk5OUqEhkfWBk5FCDBdKn3uxlFWHTsTXt8UbQxLDF57kyQobb

