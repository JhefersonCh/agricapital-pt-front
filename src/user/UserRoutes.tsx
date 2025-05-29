import { Route, Routes } from 'react-router-dom';
import { Profile } from './pages/Profile';

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
