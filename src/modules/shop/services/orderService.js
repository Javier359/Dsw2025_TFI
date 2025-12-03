import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (orderData) => {
  try {
    // orderData debe coincidir con OrderRequest de C#
    const response = await instance.post('api/orders/create', orderData);
    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data?.error || error.response?.data?.message || "Error al procesar la orden"
    };
  }
};