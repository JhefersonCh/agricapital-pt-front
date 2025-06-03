import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const sessionRaw = localStorage.getItem(
      'sb-shzozpqlrjpszalsqoey-auth-token',
    );

    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        const accessToken = session.access_token;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (err) {
        console.error('Error parsing auth token from localStorage', err);
        toast.error('Error de Autenticación', {
          description:
            'No se pudo leer el token de sesión. Por favor, inicia sesión de nuevo.',
        });
      }
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    toast.error('Error de Red', {
      description:
        'No se pudo completar la petición. Revisa tu conexión a internet.',
    });
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (
      ['post', 'patch', 'delete'].includes(response.config.method as string)
    ) {
      toast.success(response.data.message, {
        position: 'top-right',
        icon: '✅',
      });
    }
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response);

    let errorMessage = 'Ha ocurrido un error inesperado.';
    let errorTitle = 'Error';

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorTitle = 'Petición Inválida';
          errorMessage =
            error.response.data?.message ||
            'Los datos enviados son incorrectos.';
          break;
        case 401:
          errorTitle = 'No Autorizado';
          errorMessage =
            'Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.';
          break;
        case 403:
          errorTitle = 'Acceso Denegado';
          errorMessage = 'No tienes permiso para realizar esta acción.';
          break;
        case 409:
          errorTitle = 'Conflicto de Datos';
          errorMessage =
            error.response.data?.message ||
            'Ya existe un recurso con estos datos.';
          break;
        case 500:
          errorTitle = 'Error del Servidor';
          errorMessage =
            'Ha ocurrido un error interno en el servidor. Inténtalo de nuevo más tarde.';
          break;
        default:
          if (error.response.status !== 404) {
            errorMessage =
              error.response.data?.message || `Error: ${error.response.status}`;
          }
          break;
      }
    } else if (error.request) {
      errorTitle = 'Error de Conexión';
      errorMessage =
        'No se recibió respuesta del servidor. Revisa tu conexión a internet.';
    } else {
      errorTitle = 'Error de Configuración';
      errorMessage = `Error al configurar la petición: ${error.message}`;
    }

    if (error.response.status !== 404) {
      toast.error(errorTitle, {
        icon: '❌',
        description: errorMessage,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
