import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LoginForm = () => {
  const router = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast.success('Bienvenido de nuevo', {
          icon: '✅',
          position: 'top-right',
        });
        router('');
      } else {
        console.warn(
          'Login completado pero no se recibió sesión. Posiblemente un caso especial.',
        );
        toast.warning('Inicio de sesión incompleto', {
          description: 'Hubo un problema al establecer la sesión.',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error de login:', error);

      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';

      if (error.message === 'Invalid login credentials') {
        errorMessage =
          'Credenciales inválidas. Verifica tu email y contraseña.';
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
      } else if (error.message === 'Too many requests') {
        errorMessage =
          'Demasiados intentos. Espera un momento antes de intentar nuevamente.';
      }

      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogleLoginSimple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
          data.url,
          'GoogleLogin',
          `width=${width},height=${height},top=${top},left=${left},popup=yes`,
        );

        // Escuchar cambios en el estado de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              popup?.close();
              authListener?.subscription?.unsubscribe();
              console.log('Login exitoso, popup cerrado');
            }
          },
        );

        // Timeout de seguridad
        setTimeout(() => {
          if (popup && !popup.closed) {
            popup.close();
            authListener?.subscription?.unsubscribe();
          }
        }, 5 * 60 * 1000);
      }
    } catch (error) {
      setLoginError('Error al iniciar sesión con Google');
      console.error('Error Google login:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setLoginError('Error al iniciar sesión con Facebook');
      console.error('Error Facebook login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-8"
            placeholder="correo@ejemplo.com"
            disabled={isSubmitting}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          {showPassword ? (
            <EyeOff
              className="absolute right-2 top-3 h-4 w-4 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="absolute right-2 top-3 h-4 w-4 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          <Lock className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            className="pl-8 pr-8"
            placeholder="********"
            disabled={isSubmitting}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, rememberMe: Boolean(checked) }))
          }
          disabled={isSubmitting}
        />
        <Label htmlFor="rememberMe">Recordarme</Label>
      </div>

      {loginError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <CardFooter className="flex flex-col space-y-4 mt-2">
        <Button
          type="submit"
          className="w-full bg-[#499403] hover:bg-[#8bd149]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Iniciando sesión...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </>
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => router('/auth/register')}
              disabled={isSubmitting}
            >
              Regístrate aquí
            </button>
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                O continúa con
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleLoginSimple}
              disabled={isSubmitting}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleFacebookLogin}
              disabled={isSubmitting}
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </CardFooter>
    </form>
  );
};
