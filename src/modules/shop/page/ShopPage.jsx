import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCar';
import { getPublicProducts } from '../services/shopService'; // Importamos el servicio NUEVO

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await getPublicProducts();
      
      if (!error && Array.isArray(data)) {
        // FILTRO DE SEGURIDAD (OPCIONAL PERO RECOMENDADO):
        // Aunque el endpoint sea público, asegúrate de mostrar solo 
        // los que tienen stock y están activos (si tu backend trae esa info).
        // Si tu backend ya filtra esto, puedes quitar el .filter()
        const activeProducts = data.filter(p => p.stockQuantity > 0 && p.isActive !== false);
        
        setProducts(activeProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // ... (Aquí va la misma lógica de addToCart que te pasé antes) ...
  const addToCart = (product, quantity) => {

    // 1. SOLUCIÓN AL ID: Buscamos todas las variantes posibles de nombre
    // C# suele mandar 'Id' o 'productId', JS busca 'id'.
    const safeId = product.id || product.Id || product.productId || product.ProductId;
    const safeName = product.name || product.Name || "Sin Nombre";
    const safePrice = product.currentUnitPrice || product.CurrentUnitPrice || 0;

    if (!safeId) {
      alert("Error interno: Producto sin ID");
      return;
    }

    // 2. SOLUCIÓN AL STORAGE CORRUPTO: Try-Catch
    let cart = [];
    try {
      const storedCart = localStorage.getItem('cart');
      // Si existe y no es "undefined" (texto), lo parseamos
      if (storedCart && storedCart !== "undefined") {
        cart = JSON.parse(storedCart);
      }
    } catch (error) {
      cart = []; // Si falla, empezamos de cero para que funcione
      localStorage.removeItem('cart');
    }

    // 3. LÓGICA DE AGREGADO
    const existingIndex = cart.findIndex(item => item.id === safeId);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: safeId,
        name: safeName,
        price: safePrice,
        quantity: quantity
      });
    }

    // 4. GUARDADO FINAL
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
          
      // Evento para que el header se entere (si tienes uno)
      window.dispatchEvent(new Event("storage"));
      
      alert("¡Agregado al carrito!"); 
    } catch (err) {
      alert("No se pudo guardar en el carrito (Espacio lleno o error de navegador).");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tienda</h1>

      {loading ? (
        <p className="text-center py-10">Cargando catálogo...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.id} // Tu modelo C# usa 'id', no 'sku'
                product={product} 
                onAddToCart={addToCart} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-gray-50 rounded">
                <p className="text-xl text-gray-500">No hay productos disponibles :(</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShopPage;