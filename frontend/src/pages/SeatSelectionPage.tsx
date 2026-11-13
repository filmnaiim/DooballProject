import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldAlert,
  Sparkles,
  Bot,
  UserCheck
} from 'lucide-react';
import { matchService } from '../services/api';
import { useAntiBotMouseTracker } from '../hooks/useAntiBotMouseTracker';
import { AntiBotShield } from '../components/AntiBotShield';
import type { MatchDetail, Seat } from '../types';

export default function SeatSelectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // การเลือกที่นั่ง
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  // สถานะการล็อกที่นั่ง
  const [isLocking, setIsLocking] = useState(false);
  const [botBlockedError, setBotBlockedError] = useState<{ message: string; score?: number } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // เรียกใช้ Hook ตรวจจับเมาส์และ Telemetry กันบอท
  const {
    stats: botStats,
    honeypotValue,
    handleHoneypotChange,
    getTelemetryPayload,
    resetTracker,
  } = useAntiBotMouseTracker();

  // ดึงข้อมูลผังที่นั่ง
  const fetchMatchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await matchService.getMatchById(id);
      setMatch(data);
    } catch (err: any) {
      console.error('Error fetching match details:', err);
      setError(err.response?.data?.message || 'ไม่สามารถโหลดผังที่นั่งได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
    // รีเซ็ตตัวนับการขยับเมาส์เมื่อเข้าหน้านี้
    resetTracker();
  }, [id]);

  // ดึงรายชื่อโซนทั้งหมด
  const zones = useMemo(() => {
    if (!match?.seats) return [];
    const set = new Set<string>();
    match.seats.forEach((s) => set.add(s.zone_name));
    return Array.from(set).sort();
  }, [match]);

  // ที่นั่งที่ถูกกรองตามโซน
  const displayedSeats = useMemo(() => {
    if (!match?.seats) return [];
    if (selectedZone === 'ALL') return match.seats;
    return match.seats.filter((s) => s.zone_name === selectedZone);
  }, [match, selectedZone]);

  // รายการที่นั่งที่เลือกอยู่ขณะนี้
  const selectedSeatsList = useMemo(() => {
    if (!match?.seats) return [];
    return match.seats.filter((s) => selectedSeatIds.includes(s.seat_id));
  }, [match, selectedSeatIds]);

  // ราคารวม
  const totalPrice = useMemo(() => {
    return selectedSeatsList.reduce((sum, seat) => sum + Number(seat.price), 0);
  }, [selectedSeatsList]);

  // คลิกเลือกหรือยกเลิกที่นั่ง
  const handleToggleSeat = (seat: Seat) => {
    if (seat.status !== 'AVAILABLE') return;

    if (selectedSeatIds.includes(seat.seat_id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.seat_id));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert('คุณสามารถเลือกที่นั่งได้สูงสุด 6 ที่นั่งต่อการทำรายการ');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.seat_id]);
    }
  };

  // กดยืนยันการจอง -> ส่ง Telemetry และ Seat IDs ไปล็อกที่นั่ง
  const handleConfirmAndLock = async (forceBotSimulate = false) => {
    if (selectedSeatIds.length === 0) {
      alert('กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง');
      return;
    }

    setIsLocking(true);
    setBotBlockedError(null);
    setGeneralError(null);

    try {
      // ดึง Telemetry ของเมาส์และเวลาที่บันทึกไว้
      const telemetry = forceBotSimulate
        ? { timeSpentMs: 150, mouseMoves: 0, honeypot: '' } // ข้อมูลจำลองพฤติกรรมบอทความเร็วสูง
        : getTelemetryPayload();

      const res = await matchService.lockSeats({
        seatIds: selectedSeatIds,
        telemetry,
      });

      // ล็อกสำเร็จ นำทางไปหน้า Checkout
      navigate('/checkout', {
        state: {
          seatIds: selectedSeatIds,
          seatLabels: selectedSeatsList.map((s) => `โซน ${s.zone_name} - ที่นั่ง ${s.seat_number}`),
          totalAmount: totalPrice,
          lockToken: res.lockToken,
          botRiskScore: res.botRiskScore,
          matchTitle: `${match?.home_team} vs ${match?.away_team}`,
        },
      });
    } catch (err: any) {
      console.error('Lock seats failed:', err);
      if (err.response?.status === 403) {
        // ตรวจพบบอท!
        setBotBlockedError({
          message: err.response.data?.message || 'ระบบตรวจพบพฤติกรรมคล้ายบอทอัตโนมัติ!',
          score: err.response.data?.botRiskScore || botStats.botScoreEstimate,
        });
      } else if (err.response?.status === 409) {
        // ที่นั่งถูกจองตัดหน้า
        setGeneralError('ขออภัย! ที่นั่งที่คุณเลือกเพิ่งถูกผู้อื่นกดจองไปเมื่อสักครู่ ระบบกำลังรีเฟรชข้อมูลที่นั่งใหม่');
        fetchMatchDetails();
        setSelectedSeatIds([]);
      } else {
        setGeneralError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการล็อกที่นั่ง กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsLocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm">กำลังโหลดผังที่นั่งและเปิดระบบตรวจจับความปลอดภัย...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">ไม่สามารถเปิดผังที่นั่งได้</h2>
          <p className="text-xs text-slate-400">{error || 'ไม่พบข้อมูลแมตช์นี้'}</p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={fetchMatchDetails}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              โหลดใหม่
            </button>
            <Link
              to="/matches"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              กลับหน้ารายการแข่งขัน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Header / Match Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/matches"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {match.tournaments?.name}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {match.stadium}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white">
                {match.home_team} <span className="text-slate-500 text-xs font-normal">VS</span> {match.away_team}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">สถานะล็อกที่นั่ง</span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" /> ล็อกเวลา 10 นาทีหลังกด
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Anti-Bot Protection Live Widget */}
        <AntiBotShield
          stats={botStats}
          honeypotValue={honeypotValue}
          onHoneypotChange={handleHoneypotChange}
        />

        {/* Bot Detection Blocked Alert Modal / Banner */}
        {botBlockedError && (
          <div className="bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl p-6 text-white shadow-2xl space-y-4 animate-shake">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/40">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-black text-rose-200">
                  ระบบ AI ตรวจพบพฤติกรรมคล้ายบอทอัตโนมัติ! (Bot Blocked)
                </h3>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {botBlockedError.message}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="bg-rose-900/60 px-3 py-1 rounded-lg font-mono font-bold text-rose-300 border border-rose-700">
                    Bot Risk Score: {botBlockedError.score ? Number(botBlockedError.score).toFixed(1) : '95.0'}/100
                  </span>
                  <span className="text-slate-300">
                    สาเหตุ: การคลิกเร็วเกินปกติ (&lt;1.2 วิ) หรือไม่มีการขยับเคอร์เซอร์ตามธรรมชาติ
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-rose-800/60">
              <button
                onClick={() => {
                  setBotBlockedError(null);
                  resetTracker();
                }}
                className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" /> ฉันคือมนุษย์ (รีเซ็ตและลองใหม่)
              </button>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {generalError && (
          <div className="bg-amber-950/70 border border-amber-600/70 rounded-2xl p-4 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{generalError}</span>
            </div>
            <button
              onClick={() => setGeneralError(null)}
              className="text-amber-300 hover:text-white underline text-[11px] ml-4 cursor-pointer"
            >
              ปิด
            </button>
          </div>
        )}

        {/* Zone Filter & Seat Legend */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Zone Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0">เลือกดูโซน:</span>
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                selectedZone === 'ALL'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ทั้งหมด ({match.seats.length})
            </button>
            {zones.map((zone) => {
              const count = match.seats.filter((s) => s.zone_name === zone).length;
              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                    selectedZone === zone
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  โซน {zone} ({count})
                </button>
              );
            })}
          </div>

          {/* Seat Status Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500/20 border-2 border-emerald-500" />
              <span>ว่าง (Available)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 border-2 border-indigo-400" />
              <span>เลือกอยู่ (Selected)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500/30 border-2 border-amber-500" />
              <span>ติดจองชั่วคราว (Pending)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border-2 border-slate-700 opacity-60" />
              <span>ขายแล้ว (Booked)</span>
            </div>
          </div>
        </div>

        {/* Stadium Layout & Seat Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Football Field & Seat Stand (2 Columns) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Visual Pitch Display */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-900/60 bg-emerald-950/40 p-6 flex flex-col items-center justify-center text-center shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {/* Pitch White Markings */}
              <div className="w-full max-w-md h-24 border-2 border-emerald-500/30 rounded-xl relative flex items-center justify-center">
                {/* Center Circle */}
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 absolute" />
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full z-10" />
                {/* Center Line */}
                <div className="w-full h-0.5 bg-emerald-500/30 absolute" />
                {/* Goal Areas */}
                <div className="w-16 h-6 border-2 border-t-0 border-emerald-500/30 absolute top-0" />
                <div className="w-16 h-6 border-2 border-b-0 border-emerald-500/30 absolute bottom-0" />
              </div>

              <div className="mt-3 text-xs font-bold text-emerald-400/80 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> สนามแข่งขัน (PITCH VIEW) • {match.stadium}
              </div>
            </div>

            {/* Seats Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  ผังที่นั่ง ({displayedSeats.length} ที่นั่ง)
                </h3>
                <span className="text-[11px] text-slate-400">
                  คลิกที่นั่งสีเขียวเพื่อเลือก (สูงสุด 6 ที่นั่ง)
                </span>
              </div>

              {displayedSeats.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  ไม่พบที่นั่งในโซนนี้
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {displayedSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.seat_id);
                    const isAvailable = seat.status === 'AVAILABLE';
                    const isPending = seat.status === 'PENDING';

                    let seatClasses = '';
                    if (isSelected) {
                      seatClasses = 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-105';
                    } else if (isAvailable) {
                      seatClasses = 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50 hover:border-emerald-400 hover:scale-105 shadow-xs cursor-pointer';
                    } else if (isPending) {
                      seatClasses = 'bg-amber-950/40 text-amber-400 border-amber-600/40 cursor-not-allowed opacity-80';
                    } else {
                      seatClasses = 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-40';
                    }

                    return (
                      <button
                        key={seat.seat_id}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleToggleSeat(seat)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all text-center relative group ${seatClasses}`}
                      >
                        {/* Seat Number */}
                        <span className="font-bold text-sm tracking-tight">
                          {seat.seat_number}
                        </span>

                        {/* Zone Tag */}
                        <span className="text-[10px] uppercase font-semibold opacity-80">
                          โซน {seat.zone_name}
                        </span>

                        {/* Price */}
                        <span className="text-[11px] font-mono font-bold mt-1">
                          ฿{Number(seat.price).toLocaleString()}
                        </span>

                        {/* Status Label on Hover */}
                        <span className="text-[9px] mt-0.5 opacity-70">
                          {isSelected ? '✓ เลือกแล้ว' : isAvailable ? 'ว่าง' : isPending ? 'ติดจอง' : 'ขายแล้ว'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Summary & Checkout Action */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-36">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  สรุปรายการที่นั่งที่เลือก
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {selectedSeatIds.length} / 6
                </span>
              </div>

              {/* Selected Seats List */}
              {selectedSeatsList.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">ยังไม่ได้เลือกที่นั่ง</p>
                  <p className="text-[11px] text-slate-500">
                    กรุณาคลิกเลือกที่นั่งที่ต้องการจากผังด้านซ้าย
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedSeatsList.map((seat) => (
                    <div
                      key={seat.seat_id}
                      className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">
                          โซน {seat.zone_name} • {seat.seat_number}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ID: #{seat.seat_id}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">
                          ฿{Number(seat.price).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSeat(seat)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="ลบออก"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Calculation */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>จำนวนที่นั่ง:</span>
                  <span>{selectedSeatsList.length} ที่นั่ง</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-sm text-slate-200">ยอดชำระทั้งหมด:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Main Checkout Button */}
              <button
                type="button"
                disabled={selectedSeatIds.length === 0 || isLocking}
                onClick={() => handleConfirmAndLock(false)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                  selectedSeatIds.length === 0 || isLocking
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
                }`}
              >
                {isLocking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจสอบความปลอดภัย & ล็อกที่นั่ง...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>ยืนยันที่นั่งและไปชำระเงิน</span>
                  </>
                )}
              </button>

              {/* Demo Bot Tester Button for Developers / Evaluation */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-purple-400" /> โหมดทดสอบการกันบอท (Anti-Bot QA):
                </div>
                <button
                  type="button"
                  disabled={selectedSeatIds.length === 0 || isLocking}
                  onClick={() => handleConfirmAndLock(true)}
                  className="w-full py-2 px-3 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 hover:text-purple-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  จำลองคลิกแบบบอท (ความเร็ว &lt; 1s &amp; ไร้เมาส์)
                </button>
                <p className="text-[10px] text-slate-500 mt-1 text-center">
                  ปุ่มนี้ใช้สำหรับทดสอบว่า AI Backend บล็อกสคริปต์บอทได้จริง (HTTP 403)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
