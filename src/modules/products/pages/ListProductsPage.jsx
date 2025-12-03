import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import ProductActiveToggle from '../components/ProductActiveToggle';
import { useProducts } from '../hooks/useProducts'; 

const productStatus = {
  ALL: 'all',
  ENABLED: 'enable',
  DISABLED: 'disable',
};

function ListProductsPage() {
  const navigate = useNavigate();
  
  const { products, total, loading, filters, actions } = useProducts();

  const totalPages = Math.ceil(total / (filters.pageSize || 1));

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
          <h1 className='text-3xl'>Productos</h1>
          
          {/* Botón Móvil */}
          <Button
            className='h-11 w-11 rounded-2xl sm:hidden'
            onClick={() => navigate('/admin/products/create')}
          >
             <span className="text-xl">+</span>
          </Button>

          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3 w-full sm:w-auto flex-1'>
            <input
              value={filters.search}
              onChange={(evt) => actions.changeSearchTerm(evt.target.value)}
              type="text"
              placeholder='Buscar por nombre...'
              className='text-[1.3rem] w-full border border-gray-300 rounded px-2 py-1'
            />
            <Button className='h-11 w-11 flex items-center justify-center' onClick={actions.handleSearch}>
              🔍
            </Button>
          </div>
          
          <select 
            value={filters.status} 
            onChange={evt => actions.changeStatus(evt.target.value)} 
            className='text-[1.3rem] border border-gray-300 rounded px-2 py-1'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>
      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <Card>
            <p className="text-center text-gray-500 py-4">Cargando productos...</p>
          </Card>
        ) : (
          Array.isArray(products) && products.length > 0 ? (
            products.map(product => (
              <Card key={product.sku}>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <h1 className='text-xl font-semibold'>
                      {product.sku} - {product.name}
                    </h1>
                    <p className='text-sm text-gray-600'>{product.description}</p>
                    <p className='text-base mt-2 font-medium'>
                      Stock: {product.stockQuantity} | Precio: {formatCurrency(product.currentUnitPrice)}
                    </p>
                  </div>
                  
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className='flex flex-col sm:flex-row gap-2 mt-3'>
                  <Button
                    className='flex-1'
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  >
                    ✏️ Editar
                  </Button>
                
                  <ProductActiveToggle
                    productId={product.id}
                    isActive={product.isActive}
                    onToggle={actions.refresh} 
                  />
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className='text-center text-gray-500 py-4'>No hay productos para mostrar.</p>
            </Card>
          )
        )}
      </div>

      <div className='flex justify-center items-center mt-3 gap-2 pb-4'>
        <button
          disabled={filters.page === 1}
          onClick={() => actions.changePage(filters.page - 1)}
          className='bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100 disabled:text-gray-400'
        >
          Atrás
        </button>
        
        <span className="font-medium">
          {filters.page} / {totalPages || 1}
        </span>
        
        <button
          disabled={filters.page >= totalPages}
          onClick={() => actions.changePage(filters.page + 1)}
          className='bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100 disabled:text-gray-400'
        >
          Siguiente
        </button>

        <select
          value={filters.pageSize}
          onChange={evt => actions.changePageSize(Number(evt.target.value))}
          className='ml-3 border border-gray-300 rounded p-2'
        >
          <option value="2">2 por pág</option>
          <option value="10">10 por pág</option>
          <option value="15">15 por pág</option>
          <option value="20">20 por pág</option>
        </select>
      </div>
    </div>
  );
}

export default ListProductsPage;