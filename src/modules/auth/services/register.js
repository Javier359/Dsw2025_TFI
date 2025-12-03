import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, email, password) => {
  try {
    const response = await instance.post(
      'api/auth/register',
      { username, email, password }
    );

    return {
      data: response.data, 
      error: null
    };

  } catch (error) {
    // 1. AGREGAMOS LOG PARA VER EL ERROR REAL EN CONSOLA
    console.error("Error en registro:", error.response?.data);

    let errorMessage = "No se pudo registrar el usuario. Intente nuevamente.";

    if (error.response?.data) {
      const backendError = error.response.data;

      // 2. DETECTAMOS SI ES UN ARRAY (Identity Errors de .NET)
      // El backend devuelve: [{ code: '...', description: 'El error real' }]
      if (Array.isArray(backendError)) {
        // Unimos todas las descripciones en un solo texto
        errorMessage = backendError.map(err => err.description).join('. ');
      } 
      // Si es un string simple
      else if (typeof backendError === 'string') {
        errorMessage = backendError;
      }
      // Si es un objeto complejo (ValidationProblem)
      else if (backendError.errors) {
         errorMessage = Object.values(backendError.errors).flat().join('. ');
      }
    }

    return {
      data: null,
      error: { message: errorMessage }
    };
  }
};