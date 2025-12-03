import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import Card from '../../shared/components/Card';
import { getProductById } from '../services/getById';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await getProductById(id);

        if (error) throw error;

        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Card>
        <p>Cargando producto...</p>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card>
        <p className='text-red-500'>{error || 'Producto no encontrado'}</p>
        <button onClick={() => navigate('/admin/products')}>
          Volver a productos
        </button>
      </Card>
    );
  }

  return <ProductForm product={product} isEdit={true} />;
}

export default EditProductPage;