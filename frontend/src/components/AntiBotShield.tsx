import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity, MousePointer, Clock, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import type { AntiBotStats } from '../hooks/useAntiBotMouseTracker';

interface AntiBotShieldProps {
  stats: AntiBotStats;
  honeypotValue: string;
  onHoneypotChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSimulateBotAction?: () => void;
}

export const AntiBotShield: React.FC<AntiBotShieldProps> = ({
  stats,
  honeypotValue,
  onHoneypotChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isSafe = stats.botScoreEstimate < 75 && stats.timeSpentMs >= 1200 && stats.mouseMoves >= 3;

  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 p-4 transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              stats.honeypotTriggered || stats.botScoreEstimate >= 75
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                : isSafe
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {stats.honeypotTriggered || stats.botScoreEstimate >= 75 ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">DooBall AI Bot Shield</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                  stats.honeypotTriggered || stats.botScoreEstimate >= 75
                    ? 'bg-rose-500/30 text-rose-300'
                    : isSafe
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/30 text-amber-300'
                }`}
              >
                {stats.honeypotTriggered
                  ? 'ตรวจพบบอท (Honeypot)'
                  : stats.botScoreEstimate >= 75
                  ? 'เสี่ยงเป็นบอท'
                  : isSafe
                  ? 'ยืนยัน: ผู้ใช้งานจริง'
                  : 'กำลังวิเคราะห์พฤติกรรม...'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isSafe
                ? 'ตรวจพบพฤติกรรมเมาส์ตามธรรมชาติ พร้อมทำรายการจองตั๋ว'
                : 'กรุณาขยับเมาส์และเลือกที่นั่งตามปกติเพื่อยืนยันความเป็นมนุษย์'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">เวลา:</span>
          <span className="font-mono font-medium text-slate-200">
            {(stats.timeSpentMs / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg">
          <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">การขยับเมาส์:</span>
          <span className="font-mono font-medium text-slate-200">
            {stats.mouseMoves} ครั้ง
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">คะแนนเสี่ยง:</span>
          <span
            className={`font-mono font-bold ${
              stats.botScoreEstimate >= 75
                ? 'text-rose-400'
                : stats.botScoreEstimate >= 40
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {stats.botScoreEstimate.toFixed(1)} / 100
          </span>
        </div>
      </div>

      {/* Expanded Details / Bot Inspector */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>เกณฑ์ความเสี่ยงบอท (Backend Risk Score)</span>
              <span className="font-mono text-slate-400">
                {stats.botScoreEstimate.toFixed(1)}% (ระบบบล็อกที่ &gt;= 75%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  stats.botScoreEstimate >= 75
                    ? 'bg-rose-500'
                    : stats.botScoreEstimate >= 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, stats.botScoreEstimate)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-400" /> กลไกตรวจสอบพฤติกรรม (Telemetry Verification):
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center justify-between">
                <span>1. เวลาเลือกที่นั่ง (Human Speed &gt;= 1.2s):</span>
                <span className={stats.timeSpentMs >= 1200 ? 'text-emerald-400' : 'text-amber-400'}>
                  {stats.timeSpentMs >= 1200 ? 'ผ่านเกณฑ์มนุษย์' : 'เร็วเกินไป (คล้ายสคริปต์)'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>2. การเคลื่อนไหวของเคอร์เซอร์ (Mouse Moves &gt;= 3):</span>
                <span className={stats.mouseMoves >= 3 ? 'text-emerald-400' : 'text-rose-400'}>
                  {stats.mouseMoves >= 3 ? `พบการเคลื่อนไหว (${stats.mouseMoves})` : 'ยังไม่มีการขยับเมาส์'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>3. กับดักบอท (Honeypot Trap):</span>
                <span className={stats.honeypotTriggered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {stats.honeypotTriggered ? 'ติดกับดัก! (ถูกกรอก)' : 'ปลอดภัย (ว่าง)'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>4. ความเป็นธรรมชาติของวิถีเมาส์ (Trajectory Entropy):</span>
                <span className="text-sky-400 font-mono">{stats.entropyScore}% Organic</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Hidden Honeypot Input: Invisible to humans, but bots scraping DOM will autofill it */}
      <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }}>
        <label htmlFor="anti_bot_hp_field">Do not fill this field</label>
        <input
          id="anti_bot_hp_field"
          type="text"
          name="honeypot"
          value={honeypotValue}
          onChange={onHoneypotChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

