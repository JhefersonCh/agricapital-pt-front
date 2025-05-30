import { Navigate, Route, Routes } from 'react-router-dom';
import { Clients } from './pages/Clients';
import { InitCredit } from './pages/InitCredit';
import { Credits } from './pages/Credits';
import { RequetByClient } from './pages/RequetByClient';

export const CreditRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="clients" replace />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/init/:id" element={<InitCredit />} />
      <Route path="/requests" element={<Credits />} />
      <Route path="/request-by-client/:id" element={<RequetByClient />} />
    </Routes>
  );
};
