import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: false, 
});

// REQUEST interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // OJO: era error.status, pero axios usa error.response.status
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
    }

    return Promise.reject(error); // deja que el componente lo maneje
  }
);

export { instance };
