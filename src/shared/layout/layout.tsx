import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Home } from '../pages/home/Home';
import { About } from '../pages/about/About';
import NavBar from './navbar/NavBar';
import { Footer } from './footer/Footer';
import { AuthRouter } from '@/auth/AuthRouter';
import { AuthProvider } from '../contexts/AuthContext';
import { RoleProvider } from '../contexts/RoleContext';
import { RoleGuard } from '../guards/RoleGuard';
import { UserRoutes } from '@/user/UserRoutes';
import Unauthorized from '../pages/unauthorized/Unauthorized';
import { CreditRoutes } from '@/credit/CreditRoutes';

export const Layout = () => {
  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <NavBar />

            <main className="flex-grow p-4 h-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth/*" element={<AuthRouter />} />
                <Route
                  path="/user/*"
                  element={<RoleGuard children={<UserRoutes />} />}
                />
                <Route
                  path="/credit/*"
                  element={<RoleGuard children={<CreditRoutes />} />}
                />
                <Route
                  path="/unauthorized"
                  element={
                    <Unauthorized
                      title="Acceso No Autorizado"
                      message="No tienes permisos para ver este contenido"
                      showBackButton={true}
                    />
                  }
                />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
};
