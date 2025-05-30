import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path="" element={<Navigate to="login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
};
