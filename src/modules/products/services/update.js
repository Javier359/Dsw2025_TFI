import { instance } from '../../shared/api/axiosInstance';

export const updateProduct = async (id, formData) => {
  await instance.put(`/api/products/${id}/update`, {
    name: formData.name,
    description: formData.description,
    currentUnitPrice: formData.price,
    stockQuantity: formData.stock,
  });
};