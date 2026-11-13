import axios from 'axios';
import type { MatchSummary, MatchDetail, LockSeatPayload, LockSeatResponse, CheckoutPayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const matchService = {
  // 1. ดึงรายการแมตช์แข่งขันทั้งหมด
  getMatches: async (): Promise<MatchSummary[]> => {
    const res = await apiClient.get<MatchSummary[]>('/matches');
    return res.data;
  },

  // 2. ดึงผังที่นั่งของแมตช์ที่ระบุ
  getMatchById: async (id: number | string): Promise<MatchDetail> => {
    const res = await apiClient.get<MatchDetail>(`/matches/${id}`);
    return res.data;
  },

  // 3. ล็อกที่นั่งพร้อมส่ง Telemetry กันบอท
  lockSeats: async (payload: LockSeatPayload): Promise<LockSeatResponse> => {
    const res = await apiClient.post<LockSeatResponse>('/seats/lock', payload);
    return res.data;
  },

  // 4. ชำระเงิน
  checkout: async (payload: CheckoutPayload) => {
    const res = await apiClient.post('/orders/checkout', payload);
    return res.data;
  },
};

