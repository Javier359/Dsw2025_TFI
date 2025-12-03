import { instance } from '../../shared/api/axiosInstance';

// Register va a recibir los datos del formulario de registro
export const register = async (username, email, password) => {
  try {
    const response = await instance.post(
      'api/auth/register',
      {
        username,
        email,
        password
      }
    );

    // Tu backend en Register devuelve un mensaje (202 Accepted con texto),
    return {
      data: response.data, 
      error: null
    };

  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error.response?.data ||
          "No se pudo registrar el usuario. Intente nuevamente."
      }
    };
  }
};
