import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const sessionRaw = localStorage.getItem('sb-shzozpqlrjpszalsqoey-auth-token');

  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      const accessToken = session.access_token;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (err) {
      console.error('Error parsing auth token from localStorage', err);
    }
  }

  return config;
});

export default api;
