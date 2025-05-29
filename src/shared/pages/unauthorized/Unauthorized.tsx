'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldX, Home, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export default function Unauthorized({
  title = 'Acceso No Autorizado',
  message = 'No tienes permisos para ver este contenido',
  showBackButton = true,
}: UnauthorizedProps) {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icono */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <ShieldX className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Alerta */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Contacta al administrador si necesitas acceso
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleGoHome}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Página Principal
            </Button>

            {showBackButton && (
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                Regresar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
