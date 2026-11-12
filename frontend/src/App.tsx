import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Checkout from './pages/Checkout';
import ETicket from './pages/ETicket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/checkout" replace />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/eticket" element={<ETicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;