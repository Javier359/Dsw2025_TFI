import { createContext, useState } from 'react';
import { login } from '../services/login';
import { getUserIdFromToken, parseJwt } from '../helpers/jwtHelper';

const AuthContext = createContext();

function AuthProvider({ children }) {
  // 1. Estado de Autenticación (MEJORADO)
  // Verifica si el token existe Y si sigue siendo válido (no expirado)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    
    // Validación básica: que no sea null, undefined o string vacío
    if (!token || token === "undefined" || token === "null") {
      return false;
    }

    // Validación avanzada: ¿Expiró?
    const decoded = parseJwt(token);
    if (!decoded || (decoded.exp * 1000 < Date.now())) {
      // Si expiró o es inválido, limpiamos la basura
      localStorage.clear();
      return false;
    }

    return true;
  });

  const [roles, setRoles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('roles')) || []; } 
    catch { return []; }
  });

  const [userId, setUserId] = useState(() => {
    const token = localStorage.getItem('token');
    return getUserIdFromToken(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRoles([]);
    setUserId(null);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) return { error };

    try {
      localStorage.setItem('token', data.token);
      localStorage.setItem('roles', JSON.stringify(data.roles));

      setIsAuthenticated(true);
      setRoles(data.roles);

      const id = getUserIdFromToken(data.token);
      setUserId(id);

      return { data: { ...data, userId: id }, error: null };
    } catch (err) {
      return { error: { message: "Error al procesar la sesión." } };
    }
  };

  const isAdmin = roles.includes("ADMIN");

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, isAdmin, userId, singin, singout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };