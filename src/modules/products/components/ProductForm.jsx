import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { updateProduct } from '../services/update';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';

function ProductForm({ product = null, isEdit = false }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: product?.sku || '',
      cui: product?.internalCode || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.currentUnitPrice || 0,
      stock: product?.stockQuantity || 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorBackendMessage('');

      if (isEdit) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }

      navigate('/admin/products');
    } catch (error) {
      if (error.response?.data?.detail) {
        const errorMessage = frontendErrorMessage[error.response.data.code];

        setErrorBackendMessage(errorMessage);
      } else {
        setErrorBackendMessage(error.response?.data?.Error || 'Contactar a Soporte');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className='text-2xl mb-4 font-semibold'>
        {isEdit ? 'Editar Producto' : 'Crear Producto'}
      </h2>
      <form
        className='
          flex
          flex-col
          gap-20
          p-8

          sm:gap-4
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          disabled={isEdit}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message}
          disabled={isEdit}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        <Input
          label='Descripción'
          {...register('description')}
        />
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          step='0.01'
          {...register('price', {
            min: {
              value: 0,
              message: 'No puede tener un precio negativo',
            },
            valueAsNumber: true,
          })}
        />
        <Input
          label='Stock'
          error={errors.stock?.message}
          type='number'
          {...register('stock', {
            min: {
              value: 0,
              message: 'No puede tener un stock negativo',
            },
            valueAsNumber: true,
          })}
        />
        <div className='flex gap-2 sm:justify-end'>
          <Button
            type='button'
            variant='secondary'
            className='w-full sm:w-fit'
            onClick={() => navigate('/admin/products')}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            className='w-full sm:w-fit'
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Guardando...'
              : isEdit
                ? 'Actualizar Producto'
                : 'Crear Producto'}
          </Button>
        </div>
        {errorBackendMessage && <span className='text-red-500'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
}

export default ProductForm;