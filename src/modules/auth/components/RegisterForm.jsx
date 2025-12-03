import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ 
    defaultValues: { 
      username: '', 
      email: '', 
      password: '',
      confirmPassword: ''
    } 
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const { data, error } = await registerService(
        formData.username,
        formData.email,
        formData.password
      );

      if (error) {
        setErrorMessage(
          typeof error.message === 'string'
            ? error.message
            : 'No se pudo registrar el usuario'
        );
        return;
      }

      // Si el back devolvió un mensaje (string), podemos mostrarlo
      if (typeof data === 'string') {
        setSuccessMessage(data);
      } else {
        setSuccessMessage('Usuario registrado correctamente.');
      }

      // Pequeño delay opcional y redirigimos al login
      setTimeout(() => {
        navigate('/login'); 
      }, 1000);

    } catch (error) {
      console.log("ERROR EN COMPONENTE REGISTER:", error);
      setErrorMessage('Llame a soporte');
    }
  };

  return (
    <form
      className='
        flex
        flex-col
        gap-4
        bg-white
        p-8
        sm:w-md
        sm:rounded-lg
        sm:shadow-lg
      '
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />

      <Input
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
        }) }
        type='email'
        error={errors.email?.message}
      />

      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
          }
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Input
        label='Confirmar Contraseña'
        type='password'
        { ...register('confirmPassword', {
            required: 'Debe confirmar la contraseña',
            validate: (value) =>
            value === watch('password') || 'Las contraseñas no coinciden'
        }) }
        error={errors.confirmPassword?.message}
      />


      <Button type='submit'>Registrarse</Button>
      <Button variant='secondary' onClick={() => navigate('/login')}>Inicio de Sesión</Button>

      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      {successMessage && <p className='text-green-600'>{successMessage}</p>}
    </form>
  );
}

export default RegisterForm;
