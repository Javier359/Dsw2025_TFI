import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  // 1. Estado de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token);
  });

  // 2. NUEVO: Estado para Roles
  const [roles, setRoles] = useState(() => {
    const storedRoles = localStorage.getItem('roles');
    try {
      return storedRoles ? JSON.parse(storedRoles) : [];
    } catch {
      return [];
    }
  });

  const singout = () => {
    localStorage.clear(); // Borra token y roles
    setIsAuthenticated(false);
    setRoles([]);
  };

  const singin = async (username, password) => {
    // data ahora trae { token: "...", roles: ["...", "..."] }
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    try {
      // A. Guardamos en LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('roles', JSON.stringify(data.roles));

      // B. Actualizamos el Estado de React
      setIsAuthenticated(true);
      setRoles(data.roles);

      // C. Retornamos la data completa para que el LoginForm pueda decidir redirección
      return { data, error: null };
      
    } catch (err) {
      return { error: { message: "Error al procesar la sesión." } };
    }
  };

  // Helper útil para proteger rutas o mostrar botones
  const isAdmin = roles.includes("ADMIN");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        roles,     // Exportamos los roles
        isAdmin,   // Exportamos el booleano directo (muy útil)
        singin,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};