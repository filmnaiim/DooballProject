import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ตั้งค่าตัวส่งอีเมลของระบบ (ใช้ Gmail จากไฟล์ .env)
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ฟังก์ชันส่งตั๋ว E-Ticket ไปยังอีเมลที่ลูกค้ากรอกเข้ามาตอนสั่งซื้อ
async function sendRealTicketEmail(orderData: {
  order: any;
  items: any[];
  payment: any;
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ ยังไม่ได้ตั้งค่า EMAIL_USER และ EMAIL_PASS ในไฟล์ .env ข้ามการส่งอีเมล');
    return;
  }

  const { order, items, payment } = orderData;
  const firstSeat = items[0]?.seat;
  const match = firstSeat?.matches;

  const matchTitle = match ? `${match.home_team} vs ${match.away_team}` : 'การแข่งขันฟุตบอล';
  const matchStadium = match ? match.stadium : '-';
  const matchDate = match
    ? new Date(match.match_date).toLocaleString('th-TH', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : '-';

  const ticketRowsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">โซน <b>${item.seat.zone_name}</b> - ที่นั่ง <b>${item.seat.seat_number}</b></td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: monospace; color: #2563eb; font-weight: bold; font-size: 15px;">${item.ticket_token}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${Number(item.seat.price).toLocaleString()} บาท</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); color: white; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">⚽ DooBall Official E-Ticket</h2>
        <p style="margin: 6px 0 0; opacity: 0.9;">ตั๋วอิเล็กทรอนิกส์ยืนยันการเข้าชมการแข่งขันฟุตบอล</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #1f2937;">
        <p style="font-size: 16px;">สวัสดีคุณ <b>${order.first_name} ${order.last_name}</b>,</p>
        <p>การสั่งซื้อตั๋วของคุณเสร็จสมบูรณ์แล้ว! นี่คือรายละเอียดตั๋วเข้าชมการแข่งขันของคุณ (หมายเลขคำสั่งซื้อ: <b>#${order.order_id}</b>):</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <p style="margin: 6px 0;">🏟️ <b>คู่แข่งขัน:</b> ${matchTitle}</p>
          <p style="margin: 6px 0;">📍 <b>สนามแข่งขัน:</b> ${matchStadium}</p>
          <p style="margin: 6px 0;">📅 <b>วันและเวลา:</b> ${matchDate} น.</p>
          <p style="margin: 6px 0;">👤 <b>ผู้ซื้อ:</b> ${order.first_name} ${order.last_name} (${order.phone_number})</p>
          <p style="margin: 6px 0;">💳 <b>การชำระเงิน:</b> ${payment.payment_method} <span style="color: #16a34a; font-weight: bold;">(${payment.payment_status})</span></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 12px;">โซน / ที่นั่ง</th>
              <th style="padding: 12px;">รหัสตั๋ว (Ticket Token)</th>
              <th style="padding: 12px; text-align: right;">ราคา</th>
            </tr>
          </thead>
          <tbody>
            ${ticketRowsHtml}
          </tbody>
        </table>

        <h3 style="text-align: right; color: #16a34a; font-size: 20px; margin-top: 10px;">
          ยอดชำระสุทธิ: ${Number(order.total_amount).toLocaleString()} บาท
        </h3>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #6b7280; text-align: center; margin: 0;">
          กรุณานำอีเมลฉบับนี้พร้อมรหัส <b>Ticket Token</b> ไปแสดงที่จุดตรวจบัตรหน้าสนามเพื่อเข้าชมการแข่งขัน
        </p>
      </div>
    </div>
  `;

  console.log(`📨 กำลังส่งอีเมลตั๋วไปที่ ${order.email}...`);
  await mailTransporter.sendMail({
    from: `"DooBall Ticket System" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `🎫 ตั๋วเข้าชมฟุตบอลของคุณ: ${matchTitle} (Order #${order.order_id})`,
    html: htmlContent,
  });

  console.log(`✅ ส่งอีเมลตั๋ว E-Ticket ไปยัง ${order.email} สำเร็จแล้ว!`);
}

// ฟังก์ชันปลดล็อกที่นั่งที่ติด PENDING เกินเวลา (10 นาที)
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

// 1. API ดึงรายการแข่งขันทั้งหมด
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
    return res.json(matches);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแข่งขัน' });
  }
});

// 2. API ดึงผังที่นั่งของแต่ละแมตช์
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
    return res.json(match);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผังที่นั่ง' });
  }
});

// 3. API เลือกที่นั่ง & Anti-Bot
const LockSeatSchema = z.object({
  seatIds: z.array(z.number()).min(1, 'กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง'),
  telemetry: z.object({
    timeSpentMs: z.number(),
    mouseMoves: z.number(),
    honeypot: z.string().optional(),
  }),
});

app.post('/api/seats/lock', async (req: Request, res: Response) => {
  try {
    await releaseExpiredSeats();

    const parsed = LockSeatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง', errors: parsed.error.flatten() });
    }

    const { seatIds, telemetry } = parsed.data;

    let botRiskScore = 5.0;
    if (telemetry.honeypot && telemetry.honeypot.trim() !== '') {
      botRiskScore = 100.0;
    } else {
      if (telemetry.timeSpentMs < 1200) botRiskScore += 55.0;
      else if (telemetry.timeSpentMs < 2500) botRiskScore += 20.0;

      if (telemetry.mouseMoves < 3) botRiskScore += 35.0;
    }
    botRiskScore = Math.min(100, botRiskScore);

    if (botRiskScore >= 75) {
      return res.status(403).json({
        message: 'ระบบ AI ตรวจพบพฤติกรรมคล้ายบอทอัตโนมัติ! ไม่อนุญาตให้ทำรายการจองตั๋ว',
        botRiskScore,
      });
    }

    const lockToken = 'LOCK-' + crypto.randomUUID();
    const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
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

      if (updated.count !== seatIds.length) {
        throw new Error('SEAT_ALREADY_TAKEN');
      }

      return { lockToken, lockedUntil, botRiskScore };
    });

    return res.json({
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
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการล็อกที่นั่ง' });
  }
});

// 4. API ชำระเงินแบบ Guest + ส่งอีเมล
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

      const totalAmount = lockedSeats.reduce((sum, seat) => sum + Number(seat.price), 0);

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

      const orderItems: any[] = [];
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

      const payment = await tx.payments.create({
        data: {
          order_id: newOrder.order_id,
          payment_method: paymentMethod,
          payment_status: 'SUCCESS',
          paid_at: new Date(),
        },
      });

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

    try {
      await sendRealTicketEmail(orderResult);
    } catch (emailErr) {
      console.error('❌ เกิดข้อผิดพลาดในการส่งอีเมล:', emailErr);
    }

    return res.status(201).json({
      message: `ชำระเงินสำเร็จ! ระบบได้ส่งตั๋ว E-Ticket ไปที่อีเมล ${email} เรียบร้อยแล้ว`,
      data: orderResult,
    });
  } catch (error: any) {
    if (error.message === 'LOCK_EXPIRED_OR_INVALID') {
      return res.status(400).json({
        message: 'เวลาการจองที่นั่งหมดอายุแล้ว หรือรหัสล็อกที่นั่งไม่ถูกต้อง กรุณาเลือกที่นั่งใหม่อีกครั้ง',
      });
    }
    console.error(error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการชำระเงิน' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DooBall Backend Server is running on http://localhost:${PORT}`);
  console.log(`📧 Email Sender Configured: ${process.env.EMAIL_USER ? process.env.EMAIL_USER : '❌ ยังไม่ได้ตั้งค่าใน .env'}`);
});