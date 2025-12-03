import ShopPage from './modules/shop/page/ShopPage';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import EditProductPage from './modules/products/pages/EditProductPage';
import Navbar from './modules/shared/components/NavBar';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <div className="min-h-screen bg-gray-50 flex flex-col">
           {/* AQUÍ USAMOS EL NAVBAR COMPARTIDO */}
           <Navbar/> 
           
           {/* Contenido principal */}
           <main className="flex-1">
             <Outlet /> 
           </main>
           
           {/* Aquí podrías agregar un <Footer /> en el futuro */}
        </div>
        ),
      children: [
        {
          path: '/',
          element: <ShopPage/>,
        },
        {
          path: '/cart',
          element: <>Carrito de compras</>,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/home',
          element: <Home />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
        },
        {
          path: '/admin/products/:id/edit',
          element: <EditProductPage />,
        }
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
