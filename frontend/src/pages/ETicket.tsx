import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, QrCode, Printer, Home, User, Calendar } from 'lucide-react';

export default function ETicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state || !state.orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <p className="text-slate-600 mb-4">ไม่พบข้อมูลตั๋วอิเล็กทรอนิกส์</p>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  const { order, items, payment } = state.orderData;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* แบนเนอร์แจ้งเตือนสำเร็จ */}
        <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center shadow-md">
          <CheckCircle2 className="w-14 h-14 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">ชำระเงินและออกตั๋วสำเร็จ!</h1>
          <p className="text-emerald-100 text-sm mt-1">
            หมายเลขคำสั่งซื้อ #{String(order.order_id).padStart(4, '0')} • ชำระผ่าน {payment.payment_method}
          </p>
        </div>

        {/* รายการตั๋วแต่ละใบ */}
        <div className="space-y-4">
          {items.map((item: any) => (
            <div
              key={item.order_item_id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 flex flex-col sm:flex-row"
            >
              {/* ส่วนซ้าย: ข้อมูลตั๋ว */}
              <div className="p-6 flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    DOOBALL E-TICKET
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.ticket_token}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-800">{state.matchTitle}</h2>

                <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>{order.first_name} {order.last_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>โซน {item.seat?.zone_name} • ที่นั่ง {item.seat?.seat_number}</span>
                  </div>
                </div>
              </div>

              {/* ส่วนขวา: QR Code จำลองสำหรับสแกนเข้าสนาม */}
              <div className="bg-slate-50 border-t sm:border-t-0 sm:border-l border-dashed border-slate-300 p-6 flex flex-col items-center justify-center sm:w-48">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 mt-2 text-center">
                  {item.ticket_token}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">แสดง QR นี้ที่ประตูทางเข้า</span>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่มดำเนินการ */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Printer className="w-4 h-4" /> พิมพ์ / บันทึกตั๋ว PDF
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Home className="w-4 h-4" /> กลับหน้ารายการแข่งขัน
          </button>
        </div>
      </div>
    </div>
  );
}