import { useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import LoginModal from '../../auth/components/LoginModal';
import { useCart } from '../hooks/useCart';
import useAuth from '../../auth/hook/useAuth';

function CartPage() {
  const { 
    cartItems, 
    total, 
    isProcessing, 
    removeItem, 
    clearCart, 
    processOrder 
  } = useCart();

  const { isAuthenticated } = useAuth();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [address, setAddress] = useState({ shipping: '', billing: '' });

  const formatCurrency = (val) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return alert("El carrito está vacío");
    if (!address.shipping || !address.billing) return alert("Por favor complete las direcciones.");

    if (isAuthenticated) {
      // Si ya está logueado, el ID del contexto ya existe, no hace falta pasarlo
      processOrder(address.shipping, address.billing);
    } else {
      setShowLoginModal(true);
    }
  };

  // --- CAMBIO CLAVE: Recibimos el ID fresco ---
  const handleLoginSuccess = (freshUserId) => {
    setShowLoginModal(false);
    // Lo pasamos directamente a processOrder
    processOrder(address.shipping, address.billing, freshUserId);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <Card><p className="text-center py-4 text-gray-500">Tu carrito está vacío.</p></Card>
          ) : (
            <Card>
              <ul className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-800">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {cartItems.length > 0 && (
                <div className="mt-4 pt-4 border-t text-right">
                  <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 underline">
                    Vaciar todo
                  </button>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="md:col-span-1">
          <Card>
            <h3 className="font-bold mb-4 text-lg">Datos de Envío</h3>
            <div className="flex flex-col gap-3 mb-4">
              <Input 
                label="Dirección de Envío" 
                value={address.shipping}
                onChange={(e) => setAddress({...address, shipping: e.target.value})}
              />
              <Input 
                label="Dirección de Facturación" 
                value={address.billing}
                onChange={(e) => setAddress({...address, billing: e.target.value})}
              />
            </div>
            
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-purple-600">{formatCurrency(total)}</span>
              </div>

              <Button onClick={handleCheckoutClick} disabled={isProcessing || cartItems.length === 0}>
                {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default CartPage;