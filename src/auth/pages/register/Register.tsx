'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CheckCircle } from 'lucide-react';
import { RegisterForm } from '@/auth/components/RegisterForm';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-300px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-700">
                ¡Registro Exitoso!
              </h2>
              <p className="text-gray-600">
                Tu cuenta ha sido creada correctamente.
              </p>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Redirigiendo...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
        <RegisterForm isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
      </Card>
    </div>
  );
}
