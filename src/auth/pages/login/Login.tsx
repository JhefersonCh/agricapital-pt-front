/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/auth/components/LoginForm';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const { session, loading } = useAuth();
  const router = useNavigate();

  useEffect(() => {
    if (session) {
      router('/');
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-300px)]">
        <div>Cargando...</div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión</title>
        <meta
          name="description"
          content="Bienvenido a la página de inicio de sesión"
        />
      </Helmet>
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-300px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              <h1>Iniciar Sesión</h1>
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
