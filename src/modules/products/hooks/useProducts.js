import { useState, useEffect } from 'react';
import { getProducts } from '../services/list'; 

export const useProducts = () => {
  // 1. Agrupamos los estados de filtros para que sea más ordenado
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // productStatus.ALL
    page: 1,
    pageSize: 10
  });

  // 2. Estados de datos
  const [data, setData] = useState({
    products: [],
    total: 0
  });
  const [loading, setLoading] = useState(false);

  // 3. La función que carga los datos (La lógica "pesada")
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data: responseData, error } = await getProducts(
        filters.search, 
        filters.status, 
        filters.page, 
        filters.pageSize
      );

      if (error) throw error;

      setData({
        products: responseData?.productItems || [],
        total: responseData?.total || 0
      });

    } catch (error) {
      console.error(error);
      
      // La lógica del 404 que hicimos antes
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
        setData({ products: [], total: 0 });
      } else {
        // Error genérico
        setData({ products: [], total: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. useEffect: Se dispara cuando cambian los filtros (excepto search que es manual)
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.page, filters.pageSize]); 
  // Nota: Quitamos filters.search del array para que solo busque al dar click al botón, si así lo prefieres.

  // 5. Funciones auxiliares para que el componente las use fácil
  const handleSearch = () => {
    // Al buscar, reseteamos a la página 1 y forzamos la petición
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchProducts(); // Llamada manual
  };

  const changePage = (newPage) => setFilters(prev => ({ ...prev, page: newPage }));
  const changeStatus = (newStatus) => setFilters(prev => ({ ...prev, status: newStatus, page: 1 }));
  const changeSearchTerm = (text) => setFilters(prev => ({ ...prev, search: text }));
  const changePageSize = (size) => setFilters(prev => ({ ...prev, pageSize: size, page: 1 }));

  // 6. Retornamos todo lo que el componente visual necesita
  return {
    products: data.products,
    total: data.total,
    loading,
    filters,
    actions: {
      changePage,
      changeStatus,
      changeSearchTerm,
      changePageSize,
      handleSearch,
      refresh: fetchProducts // Por si quieres recargar manualmente
    }
  };
};