import StatCard from '../shared/StatCard';
import { useDashboardStats } from '../hook/useDashboardStats';

function Home() {
  // 1. Llamas a tu lógica en una sola línea
  const { stats, loading } = useDashboardStats();

  return (
    <div className='flex flex-col gap-3 sm:grid sm:grid-cols-2'>
      
      {/* 2. Reutilizas el componente visual */}
      <StatCard 
        title="Productos" 
        count={stats.products} 
        isLoading={loading}
        colorClass="text-purple-600"
      />

      <StatCard 
        title="Órdenes" 
        count={stats.orders} 
        isLoading={loading}
        colorClass="text-blue-600"
      />

    </div>
  );
};

export default Home;