'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { RegisterForm } from '@/auth/components/RegisterForm';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { session } = useAuth();
  const router = useNavigate();

  useEffect(() => {
    if (session) {
      router('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router('/auth/login');
      }, 500);
    }
  }, [isSuccess, router]);

  return (
    <>
      <Helmet>
        <title>Registro Exitoso</title>
        <meta
          name="description"
          content="Tu cuenta ha sido creada correctamente"
        />
      </Helmet>
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-300px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              <h1>Crear Cuenta</h1>
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus datos para registrarte
            </CardDescription>
          </CardHeader>
          <RegisterForm setIsSuccess={setIsSuccess} />
        </Card>
      </div>
    </>
  );
}
