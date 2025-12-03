import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post(
      'api/auth/login',
      { username, password }
    );
    return {
      data: {
        token: response.data.token,
        roles: response.data.user.roles  
      },
      error: null
    };

  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || "Usuario y/o contraseña incorrectos"
      }
    };
  }
};