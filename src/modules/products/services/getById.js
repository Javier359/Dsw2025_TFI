import { instance } from '../../shared/api/axiosInstance';

export const getProductById = async (id) => {
  const response = await instance.get(`/api/products/get/${id}`);

  return { data: response.data, error: null };
};
