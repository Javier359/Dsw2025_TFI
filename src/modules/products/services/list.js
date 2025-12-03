import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  try {
    const params = { pageNumber, pageSize };

    if (search) params.search = search;
    if (status) params.status = status;

    const queryString = new URLSearchParams(params).toString();

    const response = await instance.get(`api/products/admin?${queryString}`);

    // Éxito: devolvemos data y error nulo
    return { data: response.data, error: null };

  } catch (error) {
    // Error: devolvemos data nulo y el objeto error de axios
    return { data: null, error: error };
  }
};