import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Shield, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  // ไฮไลต์ Step ปัจจุบันตาม URL
  const getStep = () => {
    if (location.pathname === '/' || location.pathname === '/matches') return 1;
    if (location.pathname.includes('/seats')) return 2;
    if (location.pathname.includes('/checkout')) return 3;
    if (location.pathname.includes('/eticket')) return 4;
    return 1;
  };

  const currentStep = getStep();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg backdrop-blur-md bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 -rotate-12" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                DooBall <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">TICKET</span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-1 font-medium">
                ระบบจำหน่ายตั๋วฟุตบอลพร้อม AI กันบอท
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/matches"
              className={`flex items-center gap-2 transition ${
                currentStep === 1 ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" /> ตารางการแข่งขัน
            </Link>
            <div className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Behavioral Shield Active</span>
            </div>
          </nav>
        </div>

        {/* Multi-step Breadcrumb / Progress Bar */}
        <div className="py-2.5 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-center min-w-[500px] gap-2 sm:gap-4 text-xs">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                1
              </span>
              <span>เลือกคู่แข่งขัน</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                2
              </span>
              <span>เลือกผังที่นั่ง & สแกนบอท</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                3
              </span>
              <span>ชำระเงิน</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                4
              </span>
              <span>รับ E-Ticket</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
