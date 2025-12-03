import { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  // --- CORRECCIÓN AQUÍ ---
  // Leemos stockQuantity (minúscula) O StockQuantity (mayúscula) para asegurar
  const stockReal = product.stockQuantity || product.StockQuantity || 0;
  
  // Si quieres probar, fuerza el stock a 10 temporalmente descomentando abajo:
  // const stockReal = 10; 

  const hasStock = stockReal > 0;

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrement = () => {
    if (quantity < stockReal) setQuantity(prev => prev + 1);
  };

  const handleAddClick = () => {
    console.log("Botón presionado. Stock detectado:", stockReal); // <--- CHISMOSO 1
    
    if (!hasStock) {
        console.warn("No hay stock, no se agrega.");
        return;
    }
    
    console.log("Enviando al padre:", product.name, quantity); // <--- CHISMOSO 2
    onAddToCart(product, quantity);
    setQuantity(1); 
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3 relative">
      
      {/* Badge de Stock (Debug) */}
      <span className="absolute top-2 right-2 bg-gray-100 text-xs px-2 py-1 rounded">
        Stock: {stockReal}
      </span>

      <div className={`w-full h-40 rounded-md flex items-center justify-center bg-gray-200`}>
        <span className="text-4xl">📦</span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
        {/* Mostramos el precio aunque sea 0 para debuggear */}
        <span className="font-bold text-lg text-gray-900">
          {formatCurrency(product.currentUnitPrice || product.CurrentUnitPrice || 0)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button 
                onClick={handleDecrement}
                className="px-2 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-2 text-sm font-medium w-6 text-center">{quantity}</span>
              <button 
                onClick={handleIncrement}
                className="px-2 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddClick}
              className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-purple-700 shadow-md active:bg-purple-800"
            >
              Agregar
            </button>
          </div>
      </div>
    </div>
  );
}

export default ProductCard;