import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MatchListPage from './pages/MatchListPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import Checkout from './pages/Checkout';
import ETicket from './pages/ETicket';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MatchListPage />} />
            <Route path="/matches" element={<MatchListPage />} />
            <Route path="/matches/:id/seats" element={<SeatSelectionPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/eticket" element={<ETicket />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
