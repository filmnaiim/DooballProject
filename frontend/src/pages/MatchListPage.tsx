import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Trophy, ChevronRight, AlertCircle, RefreshCw, Ticket } from 'lucide-react';
import { matchService } from '../services/api';
import type { MatchSummary } from '../types';

// พาธของโลโก้ทีม (Key ต้องตรงกับชื่อทีมที่ส่งมาจาก API)
const teamLogos: Record<string, string> = {
  'Buriram United': '/teams/buriram-united.png',
  'BG Pathum United': '/teams/bg-pathum.png',
  'Port FC': '/teams/port-fc.png',
  'Muangthong United': '/teams/muangthong.png',
  'Bangkok United': '/teams/bangkok-united.png',
  'Ratchaburi FC': '/teams/ratchaburi.png',
  'Chiangrai United': '/teams/chiangrai.png',
  'Khon Kaen United': '/teams/khon-kaen.png',
  'Yokohama F. Marinos': '/teams/yokohama-marinos.png',
  'Thailand': '/teams/thailand.png',
  'Vietnam': '/teams/vietnam.png',
  'South Korea': '/teams/south-korea.png',
  'Nakhon Ratchasima FC': '/teams/nakhon-ratchasima.png', 
  'Chonburi FC': '/teams/chonburi.png',
  'Syria': '/teams/syria.jpg',
};

// คอมโพเนนต์แสดงโลโก้팀 พร้อมระบบ Fallback
function TeamLogo({ team }: { team: string }) {
  const [imageError, setImageError] = useState(false);
  // ใช้ .trim() ป้องกันช่องว่างเกินในชื่อทีม
  const logoPath = teamLogos[team.trim()];

  return (
    <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-700 flex items-center justify-center p-2 shadow-inner overflow-hidden shrink-0 group-hover:border-emerald-500/40 transition">
      {logoPath && !imageError ? (
        <img
          src={logoPath}
          alt={`${team} logo`}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        // ถ้าไม่มีรูป หรือโหลดไม่ผ่าน แสดงตัวอักษรย่อ 3 ตัว
        <span className="text-xl font-black text-slate-900">
          {team.substring(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function MatchListPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State สำหรับการค้นหาและกรอง
  const [selectedTournament, setSelectedTournament] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchService.getMatches();
      setMatches(data);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.response?.data?.message || 'ไม่สามารถโหลดรายการแข่งขันได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend ทำงานอยู่');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // ดึงรายชื่อทัวร์นาเมนต์ทั้งหมดที่มี
  const tournamentList = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => {
      if (m.tournaments?.name) set.add(m.tournaments.name);
    });
    return Array.from(set);
  }, [matches]);

  // กรองตามการค้นหาและทัวร์นาเมนต์
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchTournament = match.tournaments?.name || '';
      const matchText = `${match.home_team} ${match.away_team} ${match.stadium} ${matchTournament}`.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || matchText.includes(searchQuery.toLowerCase());
      const matchesTournament = selectedTournament === 'ALL' || matchTournament === selectedTournament;
      return matchesSearch && matchesTournament;
    });
  }, [matches, searchQuery, selectedTournament]);

  // ฟอร์แมตวันที่แบบไทย
  const formatThaiDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
            <Trophy className="w-3.5 h-3.5" /> ฟุตบอลลีก & บอลถ้วย ฤดูกาล 2026/2027
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            เลือกคู่การแข่งขันที่คุณต้องการชม
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
            ระบบจองตั๋วฟุตบอลพร้อม <span className="text-emerald-400 font-semibold">AI Telemetry Bot Shield</span> ล็อกที่นั่งแบบเรียลไทม์ 10 นาที
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาทีม เช่น บุรีรัมย์, เมืองทอง, ท่าเรือ หรือสนามแข่ง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-inner placeholder-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs text-slate-400 hover:text-white"
                >
                  ล้างคำค้น
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tournament Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedTournament('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedTournament === 'ALL'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            ทุกรายการ ({matches.length})
          </button>
          {tournamentList.map((tName) => {
            const count = matches.filter((m) => m.tournaments?.name === tName).length;
            const isSelected = selectedTournament === tName;
            return (
              <button
                key={tName}
                onClick={() => setSelectedTournament(tName)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tName} ({count})
              </button>
            );
          })}
        </div>

        {/* Loading / Error / Empty States... (คงเดิม) */}
        {loading && ( <div className="text-center text-slate-500 py-12">กำลังโหลด...</div> )}
        {!loading && error && ( <div className="text-center text-rose-400 py-12">{error}</div> )}
        {!loading && !error && filteredMatches.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-300">ไม่พบคู่การแข่งขันที่ตรงกับเงื่อนไข</h3>
            <button onClick={() => { setSearchQuery(''); setSelectedTournament('ALL'); }} className="text-xs text-emerald-400 hover:underline pt-2">
              รีเซ็ตการค้นหา
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && filteredMatches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMatches.map((match) => {
              const availableSeats = match.seats?.filter((s) => s.status === 'AVAILABLE') || [];
              const totalSeats = match.seats?.length || 0;
              const isSoldOut = totalSeats > 0 && availableSeats.length === 0;

              // คำนวณช่วงราคา
              const prices = (match.seats || []).map((s) => Number(s.price));
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

              return (
                <div key={match.match_id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-emerald-950/20 flex flex-col justify-between group">
                  {/* Top Bar */}
                  <div className="p-5 pb-3 border-b border-slate-800/80 bg-slate-900/70">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 truncate">
                        {match.tournaments?.name || 'การแข่งขันฟุตบอล'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{formatThaiDate(match.match_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Teams Face-Off */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      {/* ✅ แก้ไข: เรียกใช้คอมโพเนนต์ TeamLogo สำหรับทีมเหย้า */}
                      <div className="flex-1 text-center space-y-2">
                        <TeamLogo team={match.home_team} />
                        <h4 className="font-bold text-sm sm:text-base text-white leading-tight">
                          {match.home_team}
                        </h4>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">เจ้าบ้าน</span>
                      </div>

                      {/* VS Badge */}
                      <div className="flex flex-col items-center justify-center px-2">
                        <span className="text-xs font-black text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                          VS
                        </span>
                      </div>

                      {/* ✅ แก้ไข: เรียกใช้คอมโพเนนต์ TeamLogo สำหรับทีมเยือน */}
                      <div className="flex-1 text-center space-y-2">
                        <TeamLogo team={match.away_team} />
                        <h4 className="font-bold text-sm sm:text-base text-white leading-tight">
                          {match.away_team}
                        </h4>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">ทีมเยือน</span>
                      </div>
                    </div>

                    {/* Stadium Location */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{match.stadium}</span>
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="p-5 pt-3 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-slate-400">ราคาบัตรเข้าชม</div>
                      {/* ✅ แก้ไข: ลบ Git Diff '-' และจัดฟอร์แมตราคาใหม่ */}
                      <div className="text-sm font-black text-emerald-400">
                        {minPrice === maxPrice
                          ? `฿${minPrice.toLocaleString()}`
                          : `฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`}
                      </div>
                    </div>

                    <div className="text-right">
                      {isSoldOut ? (
                        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                          บัตรหมดแล้ว
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(`/matches/${match.match_id}/seats`)}
                          className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20 group cursor-pointer"
                        >
                          <span>เลือกที่นั่ง</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1">
                        ว่าง {availableSeats.length} / {totalSeats} ที่นั่ง
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}