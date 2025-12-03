import { instance } from '../../shared/api/axiosInstance';

export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await instance.put(
    `api/orders/get/${orderId}/status`,
    {
      newStatus: newStatus,
    }
  );

  return { data: response.data, error: null };
};


