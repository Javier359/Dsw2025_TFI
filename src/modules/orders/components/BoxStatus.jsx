import { useState } from 'react';
// Asegúrate de importar la función updateOrderStatus desde tu archivo de servicios
import { updateOrderStatus } from '../services/updateStatus'; 

// Mismo mapa de etiquetas que usas en el otro lado
const statusOptions = [
  { value: 0, label: 'Pendiente' },
  { value: 1, label: 'Procesando' },
  { value: 2, label: 'Enviado' },
  { value: 3, label: 'Entregado' },
  { value: 4, label: 'Cancelado' },
];

export default function OrderStatusUpdater({ orderId, currentStatus, onStatusUpdated }) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    // Si no ha cambiado el estado, no hacemos nada
    if (Number(selectedStatus) === currentStatus) return;

    try {
      setLoading(true);
      // Llamamos al servicio [cite: 77]
      const { error } = await updateOrderStatus(orderId, Number(selectedStatus));
      
      if (error) {
        alert('Error al actualizar: ' + error);
      } else {
        // Éxito: avisamos al componente padre para que recargue la lista
        if (onStatusUpdated) onStatusUpdated();
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error inesperado al actualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
      <span className="text-sm font-medium text-gray-700">Cambiar estado:</span>
      
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(Number(e.target.value))}
        disabled={loading}
        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading || Number(selectedStatus) === currentStatus}
        className={`
          text-sm px-3 py-1 rounded text-white transition-colors
          ${loading || Number(selectedStatus) === currentStatus 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {loading ? 'Guardando...' : 'Actualizar'}
      </button>
    </div>
  );
}