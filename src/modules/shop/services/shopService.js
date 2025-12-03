import { instance } from '../../shared/api/axiosInstance';

export const getPublicProducts = async () => {
  try {
    // Apuntamos al endpoint que tiene [AllowAnonymous] en tu C#
    const response = await instance.get('api/products/get'); 

    // Tu controlador C# devuelve la lista directamente en response.data
    // O si está vacía, devuelve un objeto { message, data }.
    // Lo normalizamos aquí:
    return { 
      data: Array.isArray(response.data) ? response.data : (response.data.data || []), 
      error: null 
    };
  } catch (error) {
    console.error("Error en shopService:", error);
    return { data: [], error: error };
  }
};