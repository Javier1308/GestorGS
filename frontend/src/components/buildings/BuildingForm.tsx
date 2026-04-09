import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreateBuilding, useUpdateBuilding } from '../../hooks/useBuildings';
import type { Building } from '../../types';

const buildingSchema = z.object({
  name: z.string().min(1, 'Ingrese el nombre del edificio'),
  address: z.string().min(1, 'Ingrese la direccion'),
  phone: z.string().min(1, 'Ingrese el telefono'),
  email: z.string().email('Ingrese un email valido'),
});

type BuildingFormData = z.infer<typeof buildingSchema>;

interface BuildingFormProps {
  isOpen: boolean;
  onClose: () => void;
  building?: Building | null;
}

export default function BuildingForm({
  isOpen,
  onClose,
  building,
}: BuildingFormProps) {
  const isEditing = !!building;
  const createBuilding = useCreateBuilding();
  const updateBuilding = useUpdateBuilding();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
  });

  useEffect(() => {
    if (building) {
      reset({
        name: building.name,
        address: building.address,
        phone: building.phone,
        email: building.email,
      });
    } else {
      reset({ name: '', address: '', phone: '', email: '' });
    }
  }, [building, reset]);

  const onSubmit = (data: BuildingFormData) => {
    if (isEditing && building) {
      updateBuilding.mutate(
        { id: building.id, data },
        { onSuccess: () => onClose() }
      );
    } else {
      createBuilding.mutate(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isPending = createBuilding.isPending || updateBuilding.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Edificio' : 'Nuevo Edificio'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre"
          placeholder="Ej: Edificio Central"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Direccion"
          placeholder="Ej: Av. Principal 123"
          error={errors.address?.message}
          {...register('address')}
        />

        <Input
          label="Telefono"
          placeholder="Ej: 01-2345678"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Ej: admin@edificio.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEditing ? 'Guardar Cambios' : 'Crear Edificio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
