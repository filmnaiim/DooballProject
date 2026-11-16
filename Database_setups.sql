--
-- PostgreSQL database dump
--

\restrict CeahhpA7iCvIjgZkS2YRI8uBPhHRScdwVi9r1xNeGdYF4XRMBNyezuERdRfxfv8

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-16 17:36:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 17403)
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    match_id integer NOT NULL,
    tournament_id integer NOT NULL,
    home_team character varying(100) NOT NULL,
    away_team character varying(100) NOT NULL,
    match_date timestamp without time zone NOT NULL,
    stadium character varying(100) NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 17402)
-- Name: matches_match_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.matches_match_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 221
-- Name: matches_match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.matches_match_id_seq OWNED BY public.matches.match_id;


--
-- TOC entry 228 (class 1259 OID 17463)
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    item_id integer NOT NULL,
    order_id integer NOT NULL,
    seat_id integer NOT NULL,
    ticket_token character varying(255) NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 17462)
-- Name: order_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_item_id_seq OWNED BY public.order_items.item_id;


--
-- TOC entry 226 (class 1259 OID 17442)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone_number character varying(20) NOT NULL,
    address text NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    bot_risk_score numeric(5,2) DEFAULT 0.00,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 17441)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 230 (class 1259 OID 17486)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id integer NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    paid_at timestamp without time zone
);


--
-- TOC entry 229 (class 1259 OID 17485)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 229
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 224 (class 1259 OID 17421)
-- Name: seats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seats (
    seat_id integer NOT NULL,
    match_id integer NOT NULL,
    zone_name character varying(10) NOT NULL,
    seat_number character varying(10) NOT NULL,
    price numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'AVAILABLE'::character varying NOT NULL,
    locked_until timestamp without time zone,
    lock_token character varying(100)
);


--
-- TOC entry 223 (class 1259 OID 17420)
-- Name: seats_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seats_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 223
-- Name: seats_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seats_seat_id_seq OWNED BY public.seats.seat_id;


--
-- TOC entry 220 (class 1259 OID 17393)
-- Name: tournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournaments (
    tournament_id integer NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(50) NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 17392)
-- Name: tournaments_tournament_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tournaments_tournament_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 219
-- Name: tournaments_tournament_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tournaments_tournament_id_seq OWNED BY public.tournaments.tournament_id;


--
-- TOC entry 4835 (class 2604 OID 17406)
-- Name: matches match_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches ALTER COLUMN match_id SET DEFAULT nextval('public.matches_match_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 17466)
-- Name: order_items item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN item_id SET DEFAULT nextval('public.order_items_item_id_seq'::regclass);


--
-- TOC entry 4838 (class 2604 OID 17445)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4843 (class 2604 OID 17489)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4836 (class 2604 OID 17424)
-- Name: seats seat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seats ALTER COLUMN seat_id SET DEFAULT nextval('public.seats_seat_id_seq'::regclass);


--
-- TOC entry 4834 (class 2604 OID 17396)
-- Name: tournaments tournament_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments ALTER COLUMN tournament_id SET DEFAULT nextval('public.tournaments_tournament_id_seq'::regclass);


--
-- TOC entry 5018 (class 0 OID 17403)
-- Dependencies: 222
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (1, 1, 'Buriram United', 'BG Pathum United', '2026-11-20 19:00:00', 'Chang Arena');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (2, 1, 'Port FC', 'Muangthong United', '2026-11-21 18:00:00', 'PAT Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (3, 2, 'Bangkok United', 'Ratchaburi FC', '2026-11-25 19:00:00', 'Thammasat Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (4, 3, 'Chiangrai United', 'Khon Kaen United', '2026-11-28 18:30:00', 'Singha Chiangrai Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (5, 4, 'Buriram United', 'Yokohama F. Marinos', '2026-12-02 20:00:00', 'Chang Arena');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (6, 6, 'Thailand', 'Syria', '2026-12-05 19:30:00', 'Rajamangala Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (7, 7, 'Thailand', 'Vietnam', '2026-12-10 19:30:00', 'Rajamangala Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (8, 8, 'Thailand', 'South Korea', '2026-12-15 19:30:00', 'Rajamangala Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (9, 9, 'Buriram United', 'Bangkok United', '2026-12-20 18:00:00', 'Suphachalasai Stadium');
INSERT INTO public.matches (match_id, tournament_id, home_team, away_team, match_date, stadium) VALUES (10, 10, 'Nakhon Ratchasima FC', 'Chonburi FC', '2026-12-22 18:00:00', '80th Birthday Stadium');


--
-- TOC entry 5024 (class 0 OID 17463)
-- Dependencies: 228
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (1, 1, 1, 'TKT-2026-0001-BRU');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (2, 2, 2, 'TKT-2026-0002-BRU');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (3, 3, 3, 'TKT-2026-0003-VIP');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (4, 4, 4, 'TKT-2026-0004-PRT');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (5, 5, 5, 'TKT-2026-0005-PND');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (6, 6, 6, 'TKT-2026-0006-BKU');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (7, 7, 7, 'TKT-2026-0007-CRU');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (8, 8, 8, 'TKT-2026-0008-BOT');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (9, 9, 9, 'TKT-2026-0009-THA');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (10, 10, 10, 'TKT-2026-0010-THA');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (11, 11, 11, 'TKT-2026-0011-AA3');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (12, 13, 13, 'TKT-2026-0013-BB1');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (13, 14, 12, 'TKT-2026-0014-AA4');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (14, 15, 37, 'TKT-2026-0015-AA5');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (15, 15, 38, 'TKT-2026-0015-AA6');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (16, 16, 2, 'TKT-2026-0016-AA2');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (17, 16, 11, 'TKT-2026-0016-AA3');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (18, 17, 1, 'TKT-2026-0017-AA1');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (19, 18, 19, 'TKT-2026-0018-AA5');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (20, 19, 20, 'TKT-2026-0019-AA6');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (21, 20, 55, 'TKT-2026-0020-VIPV4');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (22, 21, 29, 'TKT-2026-0021-CC3');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (23, 22, 13, 'TKT-2026-0022-BB1');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (24, 22, 15, 'TKT-2026-0022-VIPV2');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (25, 22, 33, 'TKT-2026-0022-VIPV3');
INSERT INTO public.order_items (item_id, order_id, seat_id, ticket_token) VALUES (26, 23, 34, 'TKT-2026-0023-VIPV4');


--
-- TOC entry 5022 (class 0 OID 17442)
-- Dependencies: 226
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (1, 'ภัทรพล', 'อัศวเมธี', 'phat.asawa@gmail.com', '0812345601', '123 สุขุมวิท กรุงเทพฯ', 500.00, 5.20, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (2, 'ญาณิศา', 'วรโชติ', 'yanisa.wrc@gmail.com', '0812345602', '45/6 เมือง นนทบุรี', 500.00, 12.50, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (3, 'ธนดล', 'กิตติวัฒน์', 'thanadon.ktw@outlook.com', '0812345603', '88 เมือง บุรีรัมย์', 1500.00, 3.00, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (4, 'พิมพ์ลภัส', 'รัตนากร', 'pimlaphat.rtn@gmail.com', '0812345604', '99 คลองเตย กรุงเทพฯ', 600.00, 8.75, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (5, 'กวินทร์', 'พงศ์พิพัฒน์', 'kawin.ppp@icloud.com', '0812345605', '12 ปากเกร็ด นนทบุรี', 300.00, 45.00, 'PENDING', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (6, 'ณภัทร', 'ชายา', 'kean@gmail.com', '0812345606', '77 คลองหลวง ปทุมธานี', 1200.00, 2.10, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (7, 'ภูริณัฐ', 'ศิริวงศ์', 'phurinat.srw@gmail.com', '0812345607', '55 เมือง เชียงราย', 450.00, 15.30, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (8, 'อชิรวิชญ์', 'เตชะไพบูลย์', 'achirawit.tcp@hotmail.com', '0812345608', '108 พญาไท กรุงเทพฯ', 800.00, 96.50, 'CANCELLED', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (9, 'เอกราช', 'เผ่าศรีเผือก', 'film666@gmail.com', '0812345609', '321 บางกะปิ กรุงเทพฯ', 2000.00, 4.50, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (10, 'ลลิตา', 'วัฒนากูล', 'lalita.wtnk@gmail.com', '0812345610', '654 เมือง ขอนแก่น', 1000.00, 6.80, 'PAID', '2026-11-12 17:42:54.215867');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (11, 'เาหทเ', 'หาเทหาเ', 'gmskgd@gmail.comm', '0945768912', '360/1 กรุงเทพมหานคร', 500.00, 5.00, 'PAID', '2026-11-12 12:08:38.08');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (13, 'fdfij', 'dgdogkd', 'ogkfog@gmail.com', '0945762519', '333/1', 300.00, 5.00, 'PAID', '2026-11-12 14:30:22.404');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (14, 'sdgjsdoigj', 'fkkjakfjas', 'gkagjk@gmail.com', '0948754689', '46264/11', 500.00, 5.00, 'PAID', '2026-11-14 16:17:35.204');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (15, 'naphatlism', 'ccc', '67112014@dpu.ac.th', '0948803218', '333/1', 1000.00, 5.00, 'PAID', '2026-11-14 16:18:28.401');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (16, 'Naphat', 'Chaya', '67112014@dpu.ac.th', '0948032188', '333/1', 1000.00, 5.00, 'PAID', '2026-11-14 16:20:45.983');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (17, 'daffa', 'faaf', '67112196@dpu.ac.th', '0210891254', 'thailad', 500.00, 5.00, 'PAID', '2026-11-14 16:27:31.534');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (18, 'test', 'ddd', 'ffilmnnaiim@gmail.com', '0618745963', 'thailand', 500.00, 5.00, 'PAID', '2026-11-14 16:29:12.519');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (19, 'fafaf', 'fafaf', 'filmnaiim@gmail.com', '0589654789', 'thailand', 500.00, 5.00, 'PAID', '2026-11-14 16:30:54.851');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (20, 'ออฟ', 'คุง', 'ffilmnnaiim@gmail.com', '0875698745', 'ไทยแลนด์', 1500.00, 5.00, 'PAID', '2026-11-14 16:32:52.519');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (21, 'test', 'kub', '67112014@dpu.ac.th', '0857846985', 'thailand', 300.00, 5.00, 'PAID', '2026-11-14 16:39:30.992');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (22, 'naphat', 'lism', 'naputt3579@gmail.com', '0214569859', 'thailand', 3300.00, 5.00, 'PAID', '2026-11-15 13:44:44.96');
INSERT INTO public.orders (order_id, first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status, created_at) VALUES (23, 'kgsdm', 'gdsgij', '67112014@dpu.ac.th', '06492181546', 'thailand', 1500.00, 5.00, 'PAID', '2026-11-15 14:55:15.824');


--
-- TOC entry 5026 (class 0 OID 17486)
-- Dependencies: 230
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (1, 1, 'PROMPTPAY', 'SUCCESS', '2026-11-01 10:05:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (2, 2, 'PROMPTPAY', 'SUCCESS', '2026-11-01 10:12:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (3, 3, 'CREDIT_CARD', 'SUCCESS', '2026-11-01 11:00:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (4, 4, 'TRUEMONEY', 'SUCCESS', '2026-11-02 14:20:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (5, 5, 'PROMPTPAY', 'PENDING', NULL);
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (6, 6, 'CREDIT_CARD', 'SUCCESS', '2026-11-03 09:15:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (7, 7, 'PROMPTPAY', 'SUCCESS', '2026-11-03 16:40:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (8, 8, 'CREDIT_CARD', 'FAILED', NULL);
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (9, 9, 'CREDIT_CARD', 'SUCCESS', '2026-11-04 19:00:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (10, 10, 'TRUEMONEY', 'SUCCESS', '2026-11-05 20:30:00');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (11, 11, 'CREDIT_CARD', 'SUCCESS', '2026-11-12 12:08:38.087');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (12, 13, 'PROMPTPAY', 'SUCCESS', '2026-11-12 14:30:22.438');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (13, 14, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:17:35.23');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (14, 15, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:18:28.411');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (15, 16, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:20:45.992');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (16, 17, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:27:31.554');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (17, 18, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:29:12.523');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (18, 19, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:30:54.868');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (19, 20, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:32:52.54');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (20, 21, 'PROMPTPAY', 'SUCCESS', '2026-11-14 16:39:31.011');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (21, 22, 'PROMPTPAY', 'SUCCESS', '2026-11-15 13:44:44.967');
INSERT INTO public.payments (payment_id, order_id, payment_method, payment_status, paid_at) VALUES (22, 23, 'PROMPTPAY', 'SUCCESS', '2026-11-15 14:55:15.828');


--
-- TOC entry 5020 (class 0 OID 17421)
-- Dependencies: 224
-- Data for Name: seats; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (1, 1, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (12, 1, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (15, 1, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (19, 1, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (37, 2, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (38, 2, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (13, 1, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (20, 1, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (2, 1, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (33, 1, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (55, 2, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (3, 1, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (4, 2, 'A', 'A1', 600.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (6, 3, 'VIP', 'V1', 1200.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (7, 4, 'A', 'A1', 450.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (8, 5, 'C', 'C1', 800.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (9, 6, 'VIP', 'V1', 2000.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (10, 7, 'W', 'W1', 1000.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (16, 2, 'A', 'A2', 600.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (17, 6, 'E', 'E1', 600.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (18, 7, 'W', 'W2', 1000.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (29, 1, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (5, 2, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (34, 1, 'VIP', 'V4', 1500.00, 'BOOKED', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (14, 1, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (21, 1, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (22, 1, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (23, 1, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (24, 1, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (25, 1, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (26, 1, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (27, 1, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (28, 1, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (30, 1, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (31, 1, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (32, 1, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (35, 2, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (36, 2, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (39, 2, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (40, 2, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (41, 2, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (42, 2, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (43, 2, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (44, 2, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (45, 2, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (46, 2, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (47, 2, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (48, 2, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (49, 2, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (50, 2, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (51, 2, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (52, 2, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (53, 2, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (54, 2, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (56, 3, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (57, 3, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (58, 3, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (59, 3, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (60, 3, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (61, 3, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (62, 3, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (63, 3, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (64, 3, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (65, 3, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (66, 3, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (67, 3, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (68, 3, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (69, 3, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (70, 3, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (71, 3, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (72, 3, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (73, 3, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (74, 3, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (75, 3, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (76, 3, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (77, 3, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (78, 3, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (79, 4, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (80, 4, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (81, 4, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (82, 4, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (83, 4, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (84, 4, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (85, 4, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (86, 4, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (87, 4, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (88, 4, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (89, 4, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (90, 4, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (91, 4, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (92, 4, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (93, 4, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (94, 4, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (95, 4, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (96, 4, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (97, 4, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (98, 4, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (99, 4, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (100, 4, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (101, 4, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (102, 5, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (103, 5, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (104, 5, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (105, 5, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (11, 1, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (106, 5, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (107, 5, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (108, 5, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (109, 5, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (110, 5, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (111, 5, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (112, 5, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (113, 5, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (114, 5, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (115, 5, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (116, 5, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (117, 5, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (118, 5, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (119, 5, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (120, 5, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (121, 5, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (122, 5, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (123, 5, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (124, 5, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (125, 6, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (126, 6, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (127, 6, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (128, 6, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (129, 6, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (130, 6, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (131, 6, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (132, 6, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (133, 6, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (134, 6, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (135, 6, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (136, 6, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (137, 6, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (138, 6, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (139, 6, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (140, 6, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (141, 6, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (142, 6, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (143, 6, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (144, 6, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (145, 6, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (146, 6, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (147, 6, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (148, 7, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (149, 7, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (150, 7, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (151, 7, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (152, 7, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (153, 7, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (154, 7, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (155, 7, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (156, 7, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (157, 7, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (158, 7, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (159, 7, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (160, 7, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (161, 7, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (162, 7, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (163, 7, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (164, 7, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (165, 7, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (166, 7, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (167, 7, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (168, 7, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (169, 7, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (170, 7, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (171, 7, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (172, 8, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (173, 8, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (174, 8, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (175, 8, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (176, 8, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (177, 8, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (178, 8, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (179, 8, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (180, 8, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (181, 8, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (182, 8, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (183, 8, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (184, 8, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (185, 8, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (186, 8, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (187, 8, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (188, 8, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (189, 8, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (190, 8, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (191, 8, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (192, 8, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (193, 8, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (194, 8, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (195, 8, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (196, 9, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (197, 9, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (198, 9, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (199, 9, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (200, 9, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (201, 9, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (202, 9, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (203, 9, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (204, 9, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (205, 9, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (206, 9, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (207, 9, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (208, 9, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (209, 9, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (210, 9, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (211, 9, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (212, 9, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (213, 9, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (214, 9, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (215, 9, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (216, 9, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (217, 9, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (218, 9, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (219, 9, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (220, 10, 'A', 'A1', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (221, 10, 'A', 'A2', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (222, 10, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (223, 10, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (224, 10, 'A', 'A5', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (225, 10, 'A', 'A6', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (226, 10, 'A', 'A7', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (227, 10, 'A', 'A8', 500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (228, 10, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (229, 10, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (230, 10, 'B', 'B3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (231, 10, 'B', 'B4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (232, 10, 'B', 'B5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (233, 10, 'B', 'B6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (234, 10, 'C', 'C1', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (235, 10, 'C', 'C2', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (236, 10, 'C', 'C3', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (237, 10, 'C', 'C4', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (238, 10, 'C', 'C5', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (239, 10, 'C', 'C6', 300.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (240, 10, 'VIP', 'V1', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (241, 10, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (242, 10, 'VIP', 'V3', 1500.00, 'AVAILABLE', NULL, NULL);
INSERT INTO public.seats (seat_id, match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES (243, 10, 'VIP', 'V4', 1500.00, 'AVAILABLE', NULL, NULL);


--
-- TOC entry 5016 (class 0 OID 17393)
-- Dependencies: 220
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tournaments (tournament_id, name, type) VALUES (1, 'Thai League 1 (Revo Thai League)', 'League');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (2, 'Chang FA Cup', 'Cup');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (3, 'Revo Cup (League Cup)', 'Cup');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (4, 'AFC Champions League Elite', 'International Club');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (5, 'AFC Champions League Two', 'International Club');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (6, 'King''s Cup Thailand', 'International');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (7, 'ASEAN Mitsubishi Electric Cup', 'International');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (8, 'FIFA World Cup Qualifiers (Asia)', 'International');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (9, 'Thailand Champions Cup', 'Super Cup');
INSERT INTO public.tournaments (tournament_id, name, type) VALUES (10, 'Thai League 2', 'League');


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 221
-- Name: matches_match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.matches_match_id_seq', 10, true);


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_item_id_seq', 26, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 23, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 229
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 22, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 223
-- Name: seats_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seats_seat_id_seq', 243, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 219
-- Name: tournaments_tournament_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tournaments_tournament_id_seq', 10, true);


--
-- TOC entry 4848 (class 2606 OID 17414)
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (match_id);


--
-- TOC entry 4856 (class 2606 OID 17472)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (item_id);


--
-- TOC entry 4858 (class 2606 OID 17474)
-- Name: order_items order_items_ticket_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_ticket_token_key UNIQUE (ticket_token);


--
-- TOC entry 4854 (class 2606 OID 17461)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4860 (class 2606 OID 17498)
-- Name: payments payments_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);


--
-- TOC entry 4862 (class 2606 OID 17496)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4850 (class 2606 OID 17433)
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (seat_id);


--
-- TOC entry 4846 (class 2606 OID 17401)
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (tournament_id);


--
-- TOC entry 4852 (class 2606 OID 17435)
-- Name: seats uq_match_seat; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT uq_match_seat UNIQUE (match_id, zone_name, seat_number);


--
-- TOC entry 4865 (class 2606 OID 17475)
-- Name: order_items fk_item_order; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 17480)
-- Name: order_items fk_item_seat; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_item_seat FOREIGN KEY (seat_id) REFERENCES public.seats(seat_id) ON DELETE RESTRICT;


--
-- TOC entry 4863 (class 2606 OID 17415)
-- Name: matches fk_match_tournament; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT fk_match_tournament FOREIGN KEY (tournament_id) REFERENCES public.tournaments(tournament_id) ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 17499)
-- Name: payments fk_payment_order; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4864 (class 2606 OID 17436)
-- Name: seats fk_seat_match; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT fk_seat_match FOREIGN KEY (match_id) REFERENCES public.matches(match_id) ON DELETE CASCADE;


-- Completed on 2026-11-16 17:36:43

--
-- PostgreSQL database dump complete
--

\unrestrict CeahhpA7iCvIjgZkS2YRI8uBPhHRScdwVi9r1xNeGdYF4XRMBNyezuERdRfxfv8

