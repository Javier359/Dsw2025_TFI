import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

 const onValid = async (formData) => {
  try {
    const { data, error } = await singin(formData.username, formData.password);

    if (error) {
      setErrorMessage(
        typeof error.message === 'string'
          ? error.message
          : 'Usuario y/o contraseña incorrectos'
      );
      return;
    }

    navigate('/admin/home');

  } catch (error) {
    console.log("ERROR EN COMPONENTE:", error);

    setErrorMessage('Llame a soporte');
  }
};

  return (
    <form className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
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
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatorio',
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Button type='submit'>Iniciar Sesión</Button>
      <Button type="button" variant='secondary' onClick={() => alert('Debe impletar navegacion y pagina de registro')}>Registrar Usuario</Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
