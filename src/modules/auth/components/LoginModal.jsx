import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Necesario para ir a registro
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [errorMsg, setErrorMsg] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { singin } = useAuth();
  const navigate = useNavigate(); // Hook para navegar

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setErrorMsg('');
    const { data: loginData, error } = await singin(data.username, data.password);
    
    if (error) {
      setErrorMsg(typeof error.message === 'string' ? error.message : 'Credenciales inválidas');
    } else {
      // Éxito: Pasamos el ID y cerramos
      onLoginSuccess(loginData.userId); 
      onClose(); 
    }
  };

  const handleRegisterClick = () => {
    onClose(); // Cerramos el modal primero
    navigate('/register'); // Redirigimos a la página de registro (debes tener la ruta creada)
  };

  return (
    // FONDO TRANSLÚCIDO: fixed inset-0 z-50 bg-black/60 (60% opacidad) backdrop-blur-sm (desenfoque sutil)
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm transition-opacity">
      
      {/* Contenedor del Modal */}
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md relative animate-fade-in-up">
        
        {/* Botón cerrar (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-xl"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-1 text-center text-gray-800">Bienvenido</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Inicia sesión para finalizar tu compra</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input 
            label="Usuario" 
            {...register('username', { required: "El usuario es requerido" })} 
            error={errors.username?.message} 
          />
          <Input 
            type="password" 
            label="Contraseña" 
            {...register('password', { required: "La contraseña es requerida" })} 
            error={errors.password?.message} 
          />
          
          {errorMsg && (
            <div className="bg-red-50 text-red-500 text-sm p-2 rounded border border-red-100 text-center">
              {errorMsg}
            </div>
          )}
          
          <div className="flex flex-col gap-3 mt-4">
            <Button type="submit">Ingresar</Button>
            
            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">O</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* BOTÓN REGISTRARSE */}
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleRegisterClick}
            >
              Crear cuenta nueva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;