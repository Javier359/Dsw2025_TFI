import { instance } from '../../shared/api/axiosInstance';

export const toggleProductActive = async (id) => {
  await instance.patch(`/api/products/${id}/isActive`);
};
