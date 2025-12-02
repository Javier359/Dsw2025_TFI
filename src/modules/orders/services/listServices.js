import { instance } from "../../shared/api/axiosInstance";

export const getOrders = async (
  status = null,
  customerId = null,
  customerName = null,
  pageNumber = 1,
  pageSize = 20
) => {
  const params = {
    pageNumber,
    pageSize,
  };

  if (status !== null && status !== undefined && status !== "all") {
    params.status = status;
  }
  
  if (customerId) {
    params.customerId = customerId;
  }

  if (customerName) {
    params.customerName = customerName;
  }

  const queryString = new URLSearchParams(params);

  const response = await instance.get(`api/orders/get?${queryString}`);

  return { data: response.data, error: null };
};
