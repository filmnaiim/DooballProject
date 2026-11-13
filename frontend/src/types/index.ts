export interface Tournament {
  tournament_id: number;
  name: string;
  type: string;
}

export type SeatStatus = 'AVAILABLE' | 'PENDING' | 'BOOKED' | 'SELECTED';

export interface Seat {
  seat_id: number;
  match_id?: number;
  zone_name: string;
  seat_number: string;
  price: number | string;
  status: 'AVAILABLE' | 'PENDING' | 'BOOKED';
  locked_until?: string | null;
  lock_token?: string | null;
}

export interface MatchSummary {
  match_id: number;
  tournament_id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  stadium: string;
  tournaments: Tournament;
  seats: Array<{
    seat_id: number;
    price: number | string;
    status: 'AVAILABLE' | 'PENDING' | 'BOOKED';
  }>;
}

export interface MatchDetail {
  match_id: number;
  tournament_id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  stadium: string;
  tournaments: Tournament;
  seats: Seat[];
}

export interface AntiBotTelemetry {
  timeSpentMs: number;
  mouseMoves: number;
  honeypot: string;
}

export interface LockSeatPayload {
  seatIds: number[];
  telemetry: AntiBotTelemetry;
}

export interface LockSeatResponse {
  message: string;
  lockToken: string;
  lockedUntil: string;
  botRiskScore: number;
}

export interface CheckoutPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  paymentMethod: 'PROMPTPAY' | 'CREDIT_CARD' | 'TRUEMONEY';
  seatIds: number[];
  lockToken: string;
  botRiskScore: number;
}

