import Card from '../../shared/components/Card'; // Tu componente Card existente

function StatCard({ title, count, isLoading, colorClass = "text-gray-700" }) {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-700">{title}</h3>
      <p className={`text-2xl mt-2 font-semibold ${colorClass}`}>
        {isLoading ? (
          <span className="text-gray-400 text-lg">Cargando...</span>
        ) : (
          `Cantidad: ${count}`
        )}
      </p>
    </Card>
  );
}

export default StatCard;