import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCreateWorkOrder, useUpdateWorkOrder } from '../../hooks/useWorkOrders';
import { useBuildings } from '../../hooks/useBuildings';
import type { WorkOrder } from '../../types';

const workOrderSchema = z.object({
  title: z.string().min(1, 'Ingrese un titulo').max(200),
  description: z.string().min(1, 'Ingrese una descripcion'),
  buildingId: z.coerce.number().min(1, 'Seleccione un edificio'),
  priority: z.enum(['BAJA', 'MEDIA', 'ALTA', 'URGENTE'], {
    required_error: 'Seleccione una prioridad',
  }),
  assignedTo: z.coerce.number().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder?: WorkOrder | null;
}

export default function WorkOrderForm({
  isOpen,
  onClose,
  workOrder,
}: WorkOrderFormProps) {
  const isEditing = !!workOrder;
  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();
  const { data: buildings = [] } = useBuildings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
  });

  useEffect(() => {
    if (workOrder) {
      reset({
        title: workOrder.title,
        description: workOrder.description,
        buildingId: workOrder.buildingId,
        priority: workOrder.priority,
        assignedTo: workOrder.assignedTo || undefined,
      });
    } else {
      reset({
        title: '',
        description: '',
        buildingId: 0,
        priority: 'MEDIA',
        assignedTo: undefined,
      });
    }
  }, [workOrder, reset]);

  const onSubmit = (data: WorkOrderFormData) => {
    const payload = {
      ...data,
      assignedTo: data.assignedTo || undefined,
    };

    if (isEditing && workOrder) {
      updateWorkOrder.mutate(
        { id: workOrder.id, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createWorkOrder.mutate(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isPending = createWorkOrder.isPending || updateWorkOrder.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Ticket' : 'Nuevo Ticket'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Titulo"
          placeholder="Descripcion breve del problema"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Descripcion
          </label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            rows={4}
            placeholder="Detalle del problema o solicitud..."
            {...register('description')}
          />
          {errors.description?.message && (
            <p className="mt-1 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <Select
          label="Edificio"
          options={buildings.map((b) => ({
            value: String(b.id),
            label: b.name,
          }))}
          placeholder="Seleccione un edificio"
          error={errors.buildingId?.message}
          {...register('buildingId')}
        />

        <Select
          label="Prioridad"
          options={[
            { value: 'BAJA', label: 'Baja' },
            { value: 'MEDIA', label: 'Media' },
            { value: 'ALTA', label: 'Alta' },
            { value: 'URGENTE', label: 'Urgente' },
          ]}
          error={errors.priority?.message}
          {...register('priority')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEditing ? 'Guardar Cambios' : 'Crear Ticket'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
