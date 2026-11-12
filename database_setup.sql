-- ==========================================
-- ส่วนที่ 1: สร้างตารางทั้ง 6 ตาราง (CREATE TABLES)
-- ==========================================
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;

CREATE TABLE tournaments (
    tournament_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE matches (
    match_id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    match_date TIMESTAMP NOT NULL,
    stadium VARCHAR(100) NOT NULL, 
    CONSTRAINT fk_match_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE
);

CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    zone_name VARCHAR(10) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    locked_until TIMESTAMP,
    lock_token VARCHAR(100),
    CONSTRAINT fk_seat_match FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    CONSTRAINT uq_match_seat UNIQUE (match_id, zone_name, seat_number)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL, 
    address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    bot_risk_score DECIMAL(5, 2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    seat_id INT NOT NULL,
    ticket_token VARCHAR(255) UNIQUE NOT NULL,  
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_seat FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE RESTRICT
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP,   
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- ==========================================
-- ส่วนที่ 2: ข้อมูลจำลองตารางละ 10+ รายการ (MOCK DATA)
-- ==========================================
INSERT INTO tournaments (name, type) VALUES
('Thai League 1 (Revo Thai League)', 'League'),
('Chang FA Cup', 'Cup'),
('Revo Cup (League Cup)', 'Cup'),
('AFC Champions League Elite', 'International Club'),
('AFC Champions League Two', 'International Club'),
('King''s Cup Thailand', 'International'),
('ASEAN Mitsubishi Electric Cup', 'International'),
('FIFA World Cup Qualifiers (Asia)', 'International'),
('Thailand Champions Cup', 'Super Cup'),
('Thai League 2', 'League');

INSERT INTO matches (tournament_id, home_team, away_team, match_date, stadium) VALUES
(1, 'Buriram United', 'BG Pathum United', '2026-11-20 19:00:00', 'Chang Arena'),
(1, 'Port FC', 'Muangthong United', '2026-11-21 18:00:00', 'PAT Stadium'),
(2, 'Bangkok United', 'Ratchaburi FC', '2026-11-25 19:00:00', 'Thammasat Stadium'),
(3, 'Chiangrai United', 'Khon Kaen United', '2026-11-28 18:30:00', 'Singha Chiangrai Stadium'),
(4, 'Buriram United', 'Yokohama F. Marinos', '2026-12-02 20:00:00', 'Chang Arena'),
(6, 'Thailand', 'Syria', '2026-12-05 19:30:00', 'Rajamangala Stadium'),
(7, 'Thailand', 'Vietnam', '2026-12-10 19:30:00', 'Rajamangala Stadium'),
(8, 'Thailand', 'South Korea', '2026-12-15 19:30:00', 'Rajamangala Stadium'),
(9, 'Buriram United', 'Bangkok United', '2026-12-20 18:00:00', 'Suphachalasai Stadium'),
(10, 'Nakhon Ratchasima FC', 'Chonburi FC', '2026-12-22 18:00:00', '80th Birthday Stadium');

INSERT INTO seats (match_id, zone_name, seat_number, price, status, locked_until, lock_token) VALUES
(1, 'A', 'A1', 500.00, 'BOOKED', NULL, NULL),
(1, 'A', 'A2', 500.00, 'BOOKED', NULL, NULL),
(1, 'VIP', 'V1', 1500.00, 'BOOKED', NULL, NULL),
(2, 'A', 'A1', 600.00, 'BOOKED', NULL, NULL),
(2, 'B', 'B1', 300.00, 'PENDING', CURRENT_TIMESTAMP + INTERVAL '10 minutes', 'lock-tok-005'),
(3, 'VIP', 'V1', 1200.00, 'BOOKED', NULL, NULL),
(4, 'A', 'A1', 450.00, 'BOOKED', NULL, NULL),
(5, 'C', 'C1', 800.00, 'AVAILABLE', NULL, NULL),
(6, 'VIP', 'V1', 2000.00, 'BOOKED', NULL, NULL),
(7, 'W', 'W1', 1000.00, 'BOOKED', NULL, NULL),
(1, 'A', 'A3', 500.00, 'AVAILABLE', NULL, NULL),
(1, 'A', 'A4', 500.00, 'AVAILABLE', NULL, NULL),
(1, 'B', 'B1', 300.00, 'AVAILABLE', NULL, NULL),
(1, 'B', 'B2', 300.00, 'AVAILABLE', NULL, NULL),
(1, 'VIP', 'V2', 1500.00, 'AVAILABLE', NULL, NULL),
(2, 'A', 'A2', 600.00, 'AVAILABLE', NULL, NULL),
(6, 'E', 'E1', 600.00, 'AVAILABLE', NULL, NULL),
(7, 'W', 'W2', 1000.00, 'AVAILABLE', NULL, NULL);

INSERT INTO orders (first_name, last_name, email, phone_number, address, total_amount, bot_risk_score, status) VALUES
('ภัทรพล', 'อัศวเมธี', 'phat.asawa@gmail.com', '0812345601', '123 สุขุมวิท กรุงเทพฯ', 500.00, 5.20, 'PAID'),
('ญาณิศา', 'วรโชติ', 'yanisa.wrc@gmail.com', '0812345602', '45/6 เมือง นนทบุรี', 500.00, 12.50, 'PAID'),
('ธนดล', 'กิตติวัฒน์', 'thanadon.ktw@outlook.com', '0812345603', '88 เมือง บุรีรัมย์', 1500.00, 3.00, 'PAID'),
('พิมพ์ลภัส', 'รัตนากร', 'pimlaphat.rtn@gmail.com', '0812345604', '99 คลองเตย กรุงเทพฯ', 600.00, 8.75, 'PAID'),
('กวินทร์', 'พงศ์พิพัฒน์', 'kawin.ppp@icloud.com', '0812345605', '12 ปากเกร็ด นนทบุรี', 300.00, 45.00, 'PENDING'),
('ณภัทร', 'ชายา', 'kean@gmail.com', '0812345606', '77 คลองหลวง ปทุมธานี', 1200.00, 2.10, 'PAID'),
('ภูริณัฐ', 'ศิริวงศ์', 'phurinat.srw@gmail.com', '0812345607', '55 เมือง เชียงราย', 450.00, 15.30, 'PAID'),
('อชิรวิชญ์', 'เตชะไพบูลย์', 'achirawit.tcp@hotmail.com', '0812345608', '108 พญาไท กรุงเทพฯ', 800.00, 96.50, 'CANCELLED'),
('เอกราช', 'เผ่าศรีเผือก', 'film666@gmail.com', '0812345609', '321 บางกะปิ กรุงเทพฯ', 2000.00, 4.50, 'PAID'),
('ลลิตา', 'วัฒนากูล', 'lalita.wtnk@gmail.com', '0812345610', '654 เมือง ขอนแก่น', 1000.00, 6.80, 'PAID');

INSERT INTO order_items (order_id, seat_id, ticket_token) VALUES
(1, 1, 'TKT-2026-0001-BRU'),
(2, 2, 'TKT-2026-0002-BRU'),
(3, 3, 'TKT-2026-0003-VIP'),
(4, 4, 'TKT-2026-0004-PRT'),
(5, 5, 'TKT-2026-0005-PND'),
(6, 6, 'TKT-2026-0006-BKU'),
(7, 7, 'TKT-2026-0007-CRU'),
(8, 8, 'TKT-2026-0008-BOT'),
(9, 9, 'TKT-2026-0009-THA'),
(10, 10, 'TKT-2026-0010-THA');

INSERT INTO payments (order_id, payment_method, payment_status, paid_at) VALUES
(1, 'PROMPTPAY', 'SUCCESS', '2026-11-01 10:05:00'),
(2, 'PROMPTPAY', 'SUCCESS', '2026-11-01 10:12:00'),
(3, 'CREDIT_CARD', 'SUCCESS', '2026-11-01 11:00:00'),
(4, 'TRUEMONEY', 'SUCCESS', '2026-11-02 14:20:00'),
(5, 'PROMPTPAY', 'PENDING', NULL),
(6, 'CREDIT_CARD', 'SUCCESS', '2026-11-03 09:15:00'),
(7, 'PROMPTPAY', 'SUCCESS', '2026-11-03 16:40:00'),
(8, 'CREDIT_CARD', 'FAILED', NULL),
(9, 'CREDIT_CARD', 'SUCCESS', '2026-11-04 19:00:00'),
(10, 'TRUEMONEY', 'SUCCESS', '2026-11-05 20:30:00');