import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ฟังก์ชันปลดล็อกที่นั่งที่ติด PENDING เกินเวลา (10 นาที) ให้กลับมาเป็น AVAILABLE อัตโนมัติ
async function releaseExpiredSeats() {
  await prisma.seats.updateMany({
    where: {
      status: 'PENDING',
      locked_until: { lt: new Date() },
    },
    data: {
      status: 'AVAILABLE',
      locked_until: null,
      lock_token: null,
    },
  });
}

// ==========================================
// 1. API ดึงรายการแข่งขันทั้งหมด (หน้าแรก)
// ==========================================
app.get('/api/matches', async (_req: Request, res: Response) => {
  try {
    await releaseExpiredSeats();
    const matches = await prisma.matches.findMany({
      include: {
        tournaments: true,
        seats: {
          select: { seat_id: true, price: true, status: true },
        },
      },
      orderBy: { match_date: 'asc' },
    });
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแข่งขัน' });
  }
});

// ==========================================
// 2. API ดึงผังที่นั่งของแต่ละแมตช์
// ==========================================
app.get('/api/matches/:id', async (req: Request, res: Response) => {
  try {
    await releaseExpiredSeats();
    const matchId = Number(req.params.id);
    const match = await prisma.matches.findUnique({
      where: { match_id: matchId },
      include: {
        tournaments: true,
        seats: {
          orderBy: [{ zone_name: 'asc' }, { seat_number: 'asc' }],
        },
      },
    });

    if (!match) {
      return res.status(404).json({ message: 'ไม่พบการแข่งขันนี้' });
    }
    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผังที่นั่ง' });
  }
});

// ==========================================
// 3. API เลือกที่นั่ง -> คัดกรองบอทด้วย AI Telemetry & ล็อกที่นั่งเป็น PENDING (กันคนกดชนกัน)
// ==========================================
const LockSeatSchema = z.object({
  seatIds: z.array(z.number()).min(1, 'กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง'),
  telemetry: z.object({
    timeSpentMs: z.number(),      // เวลาที่ใช้บนหน้าเลือกที่นั่ง (มิลลิวินาที)
    mouseMoves: z.number(),       // จำนวนการขยับเมาส์
    honeypot: z.string().optional() // ช่องดักบอท (คนทั่วไปจะมองไม่เห็น)
  }),
});

app.post('/api/seats/lock', async (req: Request, res: Response) => {
  try {
    await releaseExpiredSeats();

    // Validate ข้อมูลด้วย Zod
    const parsed = LockSeatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง', errors: parsed.error.flatten() });
    }

    const { seatIds, telemetry } = parsed.data;

    // --- ระบบ AI / Behavioral Anti-Bot คำนวณคะแนนความเสี่ยงบอท (0 - 100) ---
    let botRiskScore = 5.0; // คะแนนเริ่มต้นสำหรับผู้ใช้ทั่วไป
    if (telemetry.honeypot && telemetry.honeypot.trim() !== '') {
      botRiskScore = 100.0; // บอทเผลอกรอกช่อง Honeypot ที่ซ่อนไว้
    } else {
      if (telemetry.timeSpentMs < 1200) botRiskScore += 55.0; // กดเร็วผิดมนุษย์ (< 1.2 วินาที)
      else if (telemetry.timeSpentMs < 2500) botRiskScore += 20.0;

      if (telemetry.mouseMoves < 3) botRiskScore += 35.0; // แทบไม่ขยับเมาส์เลย (สคริปต์คลิกตรงๆ)
    }
    botRiskScore = Math.min(100, botRiskScore);

    // ถ้าคะแนนความเสี่ยงบอทตั้งแต่ 75 ขึ้นไป ให้บล็อกทันที!
    if (botRiskScore >= 75) {
      return res.status(403).json({
        message: 'ระบบ AI ตรวจพบพฤติกรรมคล้ายบอทอัตโนมัติ! ไม่อนุญาตให้ทำรายการจองตั๋ว',
        botRiskScore,
      });
    }

    // --- ระบบป้องกันคนกดที่นั่งเดียวกันพร้อมกัน (Atomic Transaction) ---
    const lockToken = 'LOCK-' + crypto.randomUUID();
    const lockedUntil = new Date(Date.now() + 10 * 60 * 1000); // ล็อกนาน 10 นาที

    const result = await prisma.$transaction(async (tx) => {
      // อัปเดตเฉพาะที่นั่งที่สถานะยังเป็น AVAILABLE เท่านั้น
      const updated = await tx.seats.updateMany({
        where: {
          seat_id: { in: seatIds },
          status: 'AVAILABLE',
        },
        data: {
          status: 'PENDING',
          locked_until: lockedUntil,
          lock_token: lockToken,
        },
      });

      // ถ้าจำนวนที่อัปเดตได้ไม่เท่ากับจำนวนที่เลือก แปลว่ามีคนอื่นกดตัดหน้าไปแล้วเสี้ยววินาที!
      if (updated.count !== seatIds.length) {
        throw new Error('SEAT_ALREADY_TAKEN');
      }

      return { lockToken, lockedUntil, botRiskScore };
    });

    res.json({
      message: 'ล็อกที่นั่งสำเร็จ กรุณาชำระเงินภายใน 10 นาที',
      ...result,
    });
  } catch (error: any) {
    if (error.message === 'SEAT_ALREADY_TAKEN') {
      return res.status(409).json({
        message: 'ขออภัย! ที่นั่งที่คุณเลือกเพิ่งถูกผู้อื่นกดจองไปเมื่อสักครู่ กรุณาเลือกที่นั่งใหม่',
      });
    }
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการล็อกที่นั่ง' });
  }
});

// ==========================================
// 4. API ชำระเงินแบบ Guest (ตรวจสอบด้วย Zod + ออกตั๋ว E-Ticket)
// ==========================================
const CheckoutSchema = z.object({
  firstName: z.string().min(2, 'กรุณากรอกชื่อจริง'),
  lastName: z.string().min(2, 'กรุณากรอกนามสกุล'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  phoneNumber: z.string().min(9, 'เบอร์โทรศัพท์ต้องมีอย่างน้อย 9 หลัก'),
  address: z.string().min(5, 'กรุณากรอกที่อยู่ให้ครบถ้วน'),
  paymentMethod: z.enum(['PROMPTPAY', 'CREDIT_CARD', 'TRUEMONEY']),
  seatIds: z.array(z.number()).min(1),
  lockToken: z.string().min(1),
  botRiskScore: z.number().default(5.0),
});

app.post('/api/orders/checkout', async (req: Request, res: Response) => {
  try {
    const parsed = CheckoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'ข้อมูลผู้ซื้อไม่ถูกต้อง', errors: parsed.error.flatten() });
    }

    const { firstName, lastName, email, phoneNumber, address, paymentMethod, seatIds, lockToken, botRiskScore } = parsed.data;

    const orderResult = await prisma.$transaction(async (tx) => {
      // 1. ตรวจสอบว่าที่นั่งยังติด PENDING ด้วย lockToken ของผู้ใช้นี้จริงๆ และยังไม่หมดเวลา
      const lockedSeats = await tx.seats.findMany({
        where: {
          seat_id: { in: seatIds },
          status: 'PENDING',
          lock_token: lockToken,
          locked_until: { gt: new Date() },
        },
        include: { matches: true },
      });

      if (lockedSeats.length !== seatIds.length) {
        throw new Error('LOCK_EXPIRED_OR_INVALID');
      }

      // 2. คำนวณราคารวม
      const totalAmount = lockedSeats.reduce((sum, seat) => sum + Number(seat.price), 0);

      // 3. สร้างใบสั่งซื้อ (orders)
      const newOrder = await tx.orders.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
          address,
          total_amount: totalAmount,
          bot_risk_score: botRiskScore,
          status: 'PAID',
        },
      });

      // 4. สร้างรายการตั๋ว (order_items)
      const orderItems = [];
      for (const seat of lockedSeats) {
        const token = `TKT-2026-${String(newOrder.order_id).padStart(4, '0')}-${seat.zone_name}${seat.seat_number}`;
        const item = await tx.order_items.create({
          data: {
            order_id: newOrder.order_id,
            seat_id: seat.seat_id,
            ticket_token: token,
          },
        });
        orderItems.push({ ...item, seat });
      }

      // 5. บันทึกการชำระเงิน (payments)
      const payment = await tx.payments.create({
        data: {
          order_id: newOrder.order_id,
          payment_method: paymentMethod,
          payment_status: 'SUCCESS',
          paid_at: new Date(),
        },
      });

      // 6. เปลี่ยนสถานะเก้าอี้จาก PENDING เป็น BOOKED ถาวร
      await tx.seats.updateMany({
        where: { seat_id: { in: seatIds } },
        data: {
          status: 'BOOKED',
          locked_until: null,
          lock_token: null,
        },
      });

      return { order: newOrder, items: orderItems, payment };
    });

    res.status(201).json({
      message: 'ชำระเงินและออกตั๋วสำเร็จ!',
      data: orderResult,
    });
  } catch (error: any) {
    if (error.message === 'LOCK_EXPIRED_OR_INVALID') {
      return res.status(400).json({
        message: 'เวลาการจองที่นั่งหมดอายุแล้ว หรือรหัสล็อกที่นั่งไม่ถูกต้อง กรุณาเลือกที่นั่งใหม่อีกครั้ง',
      });
    }
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการชำระเงิน' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DooBall Backend Server is running on http://localhost:${PORT}`);
});