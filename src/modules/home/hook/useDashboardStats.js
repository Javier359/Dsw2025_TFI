import { useState, useEffect } from 'react';
import { getOrders } from '../../orders/services/listServices';
import { getProducts } from '../../products/services/list';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Ejecutamos ambas en paralelo
        const [ordersRes, productsRes] = await Promise.all([
          getOrders(null, null, null, 1, 10000), // Truco para contar órdenes
          getProducts(null, null, 1, 1)          // Optimizado para productos
        ]);

        // Lógica de Órdenes
        const ordersCount = (!ordersRes.error && Array.isArray(ordersRes.data)) 
          ? ordersRes.data.length 
          : 0;

        // Lógica de Productos
        const productsCount = (!productsRes.error && productsRes.data) 
          ? (productsRes.data.total || productsRes.data.Total || 0)
          : 0;

        setStats({ orders: ordersCount, products: productsCount });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};