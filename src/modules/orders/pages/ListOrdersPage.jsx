import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getOrders } from '../services/listServices';

const orderStatus = {
  ALL: 'all',
  PENDING: 0,      // OrderStatus.Pending
  PROCESSING: 1,   // OrderStatus.Processing
  SHIPPED: 2,      // OrderStatus.Shipped
  DELIVERED: 3,    // OrderStatus.Delivered
  CANCELLED: 4,    // OrderStatus.Cancelled
};

const orderStatusLabels = {
  0: 'Pendiente',
  1: 'Procesando',
  2: 'Enviado',
  3: 'Entregado',
  4: 'Cancelado',
};

function ListOrdersPage() {
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(
        status === orderStatus.ALL ? null : status,
        null, // customerId - null para traer todas (ADMIN)
        null, // customerName - null para traer todas (ADMIN)
        pageNumber,
        pageSize
      );

      if (error) throw error;

      // El backend retorna directamente el array de órdenes
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, pageSize, pageNumber]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Órdenes</h1>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <select 
            value={status} 
            onChange={evt => {
              setStatus(Number(evt.target.value));
              setPageNumber(1);
            }} 
            className='text-[1.3rem]'
          >
            <option value={orderStatus.ALL}>Todas</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.PROCESSING}>Procesando</option>
            <option value={orderStatus.SHIPPED}>Enviadas</option>
            <option value={orderStatus.DELIVERED}>Entregadas</option>
            <option value={orderStatus.CANCELLED}>Canceladas</option>
          </select>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <span>Buscando datos...</span>
        ) : orders.length === 0 ? (
          <Card>
            <p className='text-center text-gray-500'>No se encontraron órdenes</p>
          </Card>
        ) : (
          orders.map(order => (
            <Card key={order.orderId}>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h1 className='text-xl font-semibold'>Orden #{order.orderId.substring(0, 8)}</h1>
                  <p className='text-sm text-gray-600'>
                    Nombre Cliente: {order.Name}
                  </p>
                </div>
                <span 
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${order.status === 0 ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 1 ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 2 ? 'bg-purple-100 text-purple-800' : ''}
                    ${order.status === 3 ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 4 ? 'bg-red-100 text-red-800' : ''}
                  `}
                >
                  {orderStatusLabels[order.status]}
                </span>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-base mb-3'>
                <div>
                  <p className='text-gray-600'>Fecha:</p>
                  <p className='font-medium'>{formatDate(order.date)}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Total:</p>
                  <p className='font-bold text-lg text-green-600'>
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className='text-sm text-gray-600'>
                <p><strong>Dirección de Envío:</strong> {order.shippingAddress}</p>
                <p><strong>Dirección de Facturación:</strong> {order.billingAddres}</p>
              </div>

              <details className='mt-3'>
                <summary className='cursor-pointer text-sm text-purple-600 hover:text-purple-800'>
                  Ver items ({order.items.length})
                </summary>
                <div className='mt-2 pl-4 border-l-2 border-gray-200'>
                  {order.items.map((item, index) => (
                    <div key={index} className='py-2 border-b border-gray-100 last:border-0'>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-600'>
                        Cantidad: {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.subTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </Card>
          ))
        )}
      </div>

      <div className='flex justify-center items-center mt-3 gap-2'>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className='bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed'
        >
          Atrás
        </button>
        <span className='px-4'>Página {pageNumber}</span>
        <button
          disabled={orders.length < pageSize}
          onClick={() => setPageNumber(pageNumber + 1)}
          className='bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3'
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrdersPage;