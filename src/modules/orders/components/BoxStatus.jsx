import { useState } from "react";
import Button from "../../shared/components/Button";
import { updateOrderStatus } from "../services/updateStatus";

// Estados EXACTOS según tu backend
const orderStatus = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELED: 4
};

// Etiquetas para mostrar en pantalla
const orderStatusLabels = {
  0: "Pendiente",
  1: "Procesando",
  2: "Enviado",
  3: "Entregado",
  4: "Cancelado"
};

function BoxStatus({ order, refresh }) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.status) {
      setError("Debe seleccionar un estado diferente");
      return;
    }

    try {
      setIsUpdating(true);
      setError("");
      setSuccess(false);

      await updateOrderStatus(order.id, selectedStatus);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.Error || "Error al actualizar el estado");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
      <label className="text-sm font-medium text-gray-700">
        Estado del pedido:
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(Number(e.target.value));
            setError("");
            setSuccess(false);
          }}
          disabled={isUpdating}
          className="text-base flex-1"
        >
          {Object.entries(orderStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <Button
          onClick={handleUpdateStatus}
          disabled={isUpdating || selectedStatus === order.status}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm font-medium">
          ✓ Estado actualizado correctamente
        </p>
      )}
    </div>
  );
}

export default BoxStatus;
