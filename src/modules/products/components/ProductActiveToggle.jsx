import { useState } from 'react';
import Button from '../../shared/components/Button';
import { toggleProductActive } from '../services/toggleActive';

function ProductActiveToggle({ productId, isActive, onToggle }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = async () => {
    if (!window.confirm(`¿Está seguro que desea ${isActive ? 'desactivar' : 'activar'} este producto?`)) {
      return;
    }

    try {
      setIsUpdating(true);
      setError('');

      await toggleProductActive(productId);

      if (onToggle) {
        onToggle();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.Error || 'Error al cambiar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleToggle}
        disabled={isUpdating}
        className={`
          flex-1
          ${isActive ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'}
          disabled:opacity-50
        `}
      >
        {isUpdating
          ? 'Procesando...'
          : isActive
            ? '🔴 Desactivar'
            : '✅ Activar'}
      </Button>
      {error && <span className='text-red-500 text-sm col-span-2'>{error}</span>}
    </>
  );
}

export default ProductActiveToggle;