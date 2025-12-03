import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';

function Navbar() {
  const navigate = useNavigate();

  // 2. Obtenemos el estado y la función para cerrar sesión
  const { isAuthenticated, singout } = useAuth(); 

  const handleLogout = () => {
    singout(); // Borra token y roles del storage
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* --- SECCIÓN IZQUIERDA: Logo y Links --- */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <Link to="/" className="flex items-center gap-1">
             {/* Icono de Logo */}
             <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
             </svg>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Productos
            </Link>

            <Link 
              to="/cart" 
              className="text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              Carrito de compras
            </Link>
          </div>
        </div>

        {/* --- SECCIÓN CENTRAL: Buscador --- */}
        <div className="flex-1 max-w-xl w-full relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white text-gray-600 placeholder-gray-400 transition-shadow"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </button>
        </div>

        {/* --- SECCIÓN DERECHA: Botones Auth (CONDICIONAL) --- */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {isAuthenticated ? (
            /* CASO 1: USUARIO LOGUEADO -> MOSTRAR CERRAR SESIÓN */
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleLogout}
                    className="text-red-600 border border-red-200 bg-red-50 px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
          ) : (
            /* CASO 2: USUARIO NO LOGUEADO -> MOSTRAR LOGIN/REGISTRO */
            <>
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-purple-100 text-purple-700 px-5 py-2 rounded-md text-sm font-semibold hover:bg-purple-200 transition-colors"
                >
                    Iniciar Sesión
                </button>
                
                <button 
                    onClick={() => navigate('/register')}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                    Registrarse
                </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;