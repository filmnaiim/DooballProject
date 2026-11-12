import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Smartphone, QrCode, ShieldCheck, ArrowLeft, Ticket } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูลที่นั่งและ lockToken จากหน้าเลือกที่นั่ง (หรือใช้ค่าจำลองหากเปิดหน้านี้โดยตรงเพื่อทดสอบ)
  const bookingData = location.state || {
    seatIds: [1],
    seatLabels: ['โซน A - ที่นั่ง A1'],
    totalAmount: 500,
    lockToken: '',
    botRiskScore: 5.0,
    matchTitle: 'ทีมชาติไทย vs ทีมชาติเวียดนาม',
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    paymentMethod: 'PROMPTPAY' as 'PROMPTPAY' | 'CREDIT_CARD' | 'TRUEMONEY',
  });

  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>(bookingData.seatIds);
  const [selectedSeatLabels, setSelectedSeatLabels] = useState<string[]>(bookingData.seatLabels);
  const [totalAmount, setTotalAmount] = useState<number>(bookingData.totalAmount);
  const [matchTitle, setMatchTitle] = useState<string>(bookingData.matchTitle);
  const [lockToken, setLockToken] = useState<string>(bookingData.lockToken);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ฟังก์ชันดึงที่นั่งที่ยังว่างจริง (AVAILABLE) จากฐานข้อมูล แล้วล็อกอัตโนมัติสำหรับทดสอบ
  const handleTestLockSeat = async () => {
    try {
      setErrorMsg('');
      // 1. ดึงรายการแข่งขันทั้งหมดเพื่อหาที่นั่งที่สถานะเป็น AVAILABLE จริงๆ
      const matchesRes = await axios.get('http://localhost:4000/api/matches');
      let availableSeat: any = null;
      let foundMatchTitle = matchTitle;

      for (const m of matchesRes.data) {
        const found = m.seats?.find((s: any) => s.status === 'AVAILABLE');
        if (found) {
          availableSeat = found;
          foundMatchTitle = `${m.home_team} vs ${m.away_team}`;
          break;
        }
      }

      if (!availableSeat) {
        setErrorMsg('ไม่พบที่นั่งว่างเหลืออยู่ในฐานข้อมูลเลย กรุณาอัปเดตสถานะใน Database');
        return;
      }

      // 2. ยิง API ล็อกที่นั่งที่ว่างนั้นจริงๆ
      const res = await axios.post('http://localhost:4000/api/seats/lock', {
        seatIds: [availableSeat.seat_id],
        telemetry: { timeSpentMs: 5000, mouseMoves: 25, honeypot: '' },
      });

      setSelectedSeatIds([availableSeat.seat_id]);
      setSelectedSeatLabels([`ที่นั่ง #${availableSeat.seat_id}`]);
      setTotalAmount(Number(availableSeat.price));
      setMatchTitle(foundMatchTitle);
      setLockToken(res.data.lockToken);

      alert(`ล็อกที่นั่ง #${availableSeat.seat_id} (${foundMatchTitle}) สำเร็จ! พร้อมชำระเงินได้เลย`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'ไม่สามารถล็อกที่นั่งได้');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:4000/api/orders/checkout', {
        ...formData,
        seatIds: selectedSeatIds,
        lockToken: lockToken,
        botRiskScore: bookingData.botRiskScore,
      });

      // ชำระเงินสำเร็จ -> ส่งข้อมูลไปหน้า E-Ticket
      navigate('/eticket', {
        state: {
          orderData: response.data.data,
          matchTitle: matchTitle,
        },
      });
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || 'เกิดข้อผิดพลาดในการชำระเงิน กรุณาตรวจสอบข้อมูลอีกครั้ง'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับไปเลือกที่นั่ง
        </button>

        {/* แถบเครื่องมือช่วยทดสอบ (จะหายไปเองเมื่อได้รับ lockToken จากหน้าเลือกที่นั่งของเพื่อน) */}
        {!lockToken && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-amber-800">
              <strong>โหมดทดสอบเดี่ยว:</strong> ยังไม่มีรหัสล็อกที่นั่ง (Lock Token) กดปุ่มด้านขวาเพื่อค้นหาและล็อกที่นั่งว่างอัตโนมัติ
            </div>
            <button
              type="button"
              onClick={handleTestLockSeat}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              จำลองล็อกที่นั่งทดสอบ
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ฟอร์มกรอกข้อมูลผู้ซื้อ */}
          <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <h1 className="text-2xl font-bold text-slate-800 border-b pb-4">ข้อมูลผู้สั่งซื้อ & ชำระเงิน</h1>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อจริง *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="เช่น สมชาย"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">นามสกุล *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="เช่น ใจดี"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">อีเมลสำหรับรับตั๋ว *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="somchai@example.com"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
                <input
                  type="tel"
                  required
                  minLength={9}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="0812345678"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ที่อยู่ *</label>
              <textarea
                required
                minLength={5}
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด (อย่างน้อย 5 ตัวอักษร)"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* เลือกช่องทางชำระเงิน */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ช่องทางการชำระเงิน *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'PROMPTPAY', label: 'PromptPay', icon: QrCode },
                  { id: 'CREDIT_CARD', label: 'บัตรเครดิต', icon: CreditCard },
                  { id: 'TRUEMONEY', label: 'TrueMoney', icon: Smartphone },
                ].map((method) => {
                  const Icon = method.icon;
                  const active = formData.paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: method.id as any })
                      }
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition ${
                        active
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-1.5" />
                      <span className="text-sm">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !lockToken}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl shadow-md transition text-lg"
            >
              {loading ? 'กำลังดำเนินการชำระเงิน...' : `ยืนยันการชำระเงิน ฿${totalAmount.toLocaleString()}`}
            </button>
          </form>

          {/* สรุปรายการสั่งซื้อ */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg border-b pb-3">
              <Ticket className="w-5 h-5" /> สรุปรายการจอง
            </div>
            <div>
              <p className="text-xs text-slate-500">การแข่งขัน</p>
              <p className="font-semibold text-slate-800">{matchTitle}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">ที่นั่งที่เลือก ({selectedSeatIds.length} ใบ)</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeatLabels.map((label: string, idx: number) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-slate-600 font-medium">ยอดชำระสุทธิ</span>
              <span className="text-2xl font-extrabold text-emerald-600">
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>ระบบป้องกันบอทและการจองซ้ำซ้อนทำงานอยู่ (AI Anti-Bot Verified)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}