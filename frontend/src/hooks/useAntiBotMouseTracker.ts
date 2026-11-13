import { useState, useEffect, useRef, useCallback } from 'react';
import type { AntiBotTelemetry } from '../types';

export interface MousePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface AntiBotStats {
  mouseMoves: number;
  timeSpentMs: number;
  isHumanLikely: boolean;
  botScoreEstimate: number; // 0 - 100 (ต่ำ = มนุษย์, สูง = บอท)
  honeypotTriggered: boolean;
  entropyScore: number; // 0 - 100
  teleportCount: number;
}

export function useAntiBotMouseTracker() {
  const startTimeRef = useRef<number>(Date.now());
  const mouseMovesRef = useRef<number>(0);
  const honeypotRef = useRef<string>('');
  const pointsRef = useRef<MousePoint[]>([]);
  const teleportCountRef = useRef<number>(0);

  // State สำหรับแสดงผล UI / Dashboard สด
  const [stats, setStats] = useState<AntiBotStats>({
    mouseMoves: 0,
    timeSpentMs: 0,
    isHumanLikely: false,
    botScoreEstimate: 100,
    honeypotTriggered: false,
    entropyScore: 0,
    teleportCount: 0,
  });

  const [honeypotValue, setHoneypotValue] = useState<string>('');

  // ฟังก์ชันคำนวณความแปรปรวนของการเคลื่อนที่ (Entropy & Curvature)
  const calculateEntropy = (points: MousePoint[]): number => {
    if (points.length < 5) return 0;

    let totalAngleChange = 0;
    let velocityChanges = 0;

    for (let i = 2; i < points.length; i++) {
      const p0 = points[i - 2];
      const p1 = points[i - 1];
      const p2 = points[i];

      const v1x = p1.x - p0.x;
      const v1y = p1.y - p0.y;
      const v2x = p2.x - p1.x;
      const v2y = p2.y - p1.y;

      const dt1 = Math.max(1, p1.timestamp - p0.timestamp);
      const dt2 = Math.max(1, p2.timestamp - p1.timestamp);

      const speed1 = Math.hypot(v1x, v1y) / dt1;
      const speed2 = Math.hypot(v2x, v2y) / dt2;

      if (Math.abs(speed2 - speed1) > 0.05) {
        velocityChanges++;
      }

      const dot = v1x * v2x + v1y * v2y;
      const mag1 = Math.hypot(v1x, v1y);
      const mag2 = Math.hypot(v2x, v2y);
      if (mag1 > 0 && mag2 > 0) {
        const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
        totalAngleChange += Math.acos(cosAngle);
      }
    }

    const naturalScore = Math.min(100, Math.round(totalAngleChange * 10 + velocityChanges * 2));
    return naturalScore;
  };

  // ประเมินคะแนนความเสี่ยงบอท (อิงตามโมเดล Backend)
  const computeBotRisk = useCallback(
    (timeSpentMs: number, mouseMoves: number, honeypot: string): number => {
      if (honeypot && honeypot.trim() !== '') return 100.0;

      let score = 5.0;
      if (timeSpentMs < 1200) {
        score += 55.0;
      } else if (timeSpentMs < 2500) {
        score += 20.0;
      }

      if (mouseMoves < 3) {
        score += 35.0;
      } else if (mouseMoves < 8) {
        score += 10.0;
      } else {
        score = Math.max(0, score - 5.0);
      }

      return Math.min(100, Math.max(0, score));
    },
    []
  );

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      const x = 'clientX' in e ? e.clientX : (e.touches[0]?.clientX ?? 0);
      const y = 'clientY' in e ? e.clientY : (e.touches[0]?.clientY ?? 0);

      const lastPoint = pointsRef.current[pointsRef.current.length - 1];
      if (lastPoint) {
        const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
        const dt = now - lastPoint.timestamp;
        // หากเมาส์กระโดดเกิน 400px ในเสี้ยววินาที (<16ms) ส่อแวว Teleport/Script
        if (dist > 400 && dt < 16) {
          teleportCountRef.current += 1;
        }
      }

      mouseMovesRef.current += 1;
      pointsRef.current.push({ x, y, timestamp: now });
      if (pointsRef.current.length > 50) {
        pointsRef.current.shift();
      }
    };

    // อัปเดตสถิติทุกๆ 200ms
    const interval = setInterval(() => {
      const timeSpent = Date.now() - startTimeRef.current;
      const moves = mouseMovesRef.current;
      const honeypot = honeypotRef.current;
      const entropy = calculateEntropy(pointsRef.current);
      const botRisk = computeBotRisk(timeSpent, moves, honeypot);

      setStats({
        mouseMoves: moves,
        timeSpentMs: timeSpent,
        isHumanLikely: botRisk < 75 && timeSpent >= 1200 && moves >= 3,
        botScoreEstimate: botRisk,
        honeypotTriggered: Boolean(honeypot && honeypot.trim() !== ''),
        entropyScore: entropy,
        teleportCount: teleportCountRef.current,
      });
    }, 200);

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [computeBotRisk]);

  // ฟังก์ชันดึง payload ส่งไปยัง Backend
  const getTelemetryPayload = useCallback((): AntiBotTelemetry => {
    const timeSpentMs = Date.now() - startTimeRef.current;
    return {
      timeSpentMs,
      mouseMoves: mouseMovesRef.current,
      honeypot: honeypotRef.current,
    };
  }, []);

  const handleHoneypotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    honeypotRef.current = e.target.value;
    setHoneypotValue(e.target.value);
  };

  const resetTracker = useCallback(() => {
    startTimeRef.current = Date.now();
    mouseMovesRef.current = 0;
    honeypotRef.current = '';
    pointsRef.current = [];
    teleportCountRef.current = 0;
    setHoneypotValue('');
  }, []);

  return {
    stats,
    honeypotValue,
    handleHoneypotChange,
    getTelemetryPayload,
    resetTracker,
  };
}

