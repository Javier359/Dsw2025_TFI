import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../shop/services/orderService';
import useAuth from '../../auth/hook/useAuth';
// 1. IMPORTAMOS EL HELPER AQUÍ TAMBIÉN
import { getUserIdFromToken } from '../../auth/helpers/jwtHelper';

export const useCart = () => {
  const navigate = useNavigate();
  const { userId } = useAuth(); // Intentamos usar el del contexto primero

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        setCartItems(parsed);
        calculateTotal(parsed);
      } catch (error) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const removeItem = (productId) => {
    const newCart = cartItems.filter(item => item.id !== productId);
    setCartItems(newCart);
    calculateTotal(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event("storage"));
  };

  const processOrder = async (shippingAddress, billingAddress, overrideUserId = null) => {
    
    // 2. LÓGICA BLINDADA PARA OBTENER EL ID
    let finalUserId = overrideUserId || userId;

    // Si el contexto falló y no nos pasaron ID manual, LO BUSCAMOS NOSOTROS MISMOS
    if (!finalUserId) {
        console.warn("⚠️ El contexto userId vino vacío. Intentando leer directo del token...");
        const token = localStorage.getItem('token');
        if (token) {
            finalUserId = getUserIdFromToken(token); // Usamos el helper que sabemos que funciona
        }
    }

    console.log("🚀 ID Final para la orden:", finalUserId);

    if (!finalUserId) {
      alert("Error crítico: No se encuentra el ID del usuario en el token. Por favor inicie sesión nuevamente.");
      return;
    }

    setIsProcessing(true);

    const orderPayload = {
      customerId: finalUserId,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      orderItems: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    const { data, error } = await createOrder(orderPayload);

    setIsProcessing(false);

    if (error) {
      // Aquí verás el error del backend si algo sale mal allá (ej. stock)
      alert("Error al crear la orden: " + error);
      return { success: false };
    } else {
      alert(`¡Compra exitosa! Orden #${data.orderId || "Creada"}`);
      clearCart();
      navigate('/');
      return { success: true };
    }
  };

  return {
    cartItems,
    total,
    isProcessing,
    removeItem,
    clearCart,
    processOrder
  };
};