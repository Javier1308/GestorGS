import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCreatePayment, useUpdatePayment } from '../../hooks/usePayments';
import { useBuildings, useBuildingUtilities } from '../../hooks/useBuildings';
import type { Payment } from '../../types';
import { useState, useEffect } from 'react';

const paymentSchema = z.object({
  utilityId: z.coerce.number().min(1, 'Seleccione un servicio'),
  month: z.string().min(1, 'Ingrese el mes'),
  amount: z.coerce.number().positive('El monto debe ser positivo'),
  dueDate: z.string().min(1, 'Ingrese la fecha de vencimiento'),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
}

export default function PaymentForm({
  isOpen,
  onClose,
  payment,
}: PaymentFormProps) {
  const isEditing = !!payment;
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const { data: buildings = [] } = useBuildings();
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(0);
  const { data: utilities = [] } = useBuildingUtilities(selectedBuildingId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment
      ? {
          utilityId: payment.utilityId,
          month: payment.month,
          amount: payment.amount,
          dueDate: payment.dueDate,
          paymentMethod: payment.paymentMethod || '',
          notes: payment.notes || '',
        }
      : {},
  });

  useEffect(() => {
    if (payment) {
      reset({
        utilityId: payment.utilityId,
        month: payment.month,
        amount: payment.amount,
        dueDate: payment.dueDate,
        paymentMethod: payment.paymentMethod || '',
        notes: payment.notes || '',
      });
    } else {
      reset({
        utilityId: 0,
        month: '',
        amount: 0,
        dueDate: '',
        paymentMethod: '',
        notes: '',
      });
    }
  }, [payment, reset]);

  const onSubmit = (data: PaymentFormData) => {
    if (isEditing && payment) {
      updatePayment.mutate(
        { id: payment.id, data },
        { onSuccess: () => { onClose(); } }
      );
    } else {
      createPayment.mutate(data, {
        onSuccess: () => { onClose(); },
      });
    }
  };

  const isPending = createPayment.isPending || updatePayment.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Pago' : 'Nuevo Pago'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isEditing && (
          <Select
            label="Edificio"
            options={buildings.map((b) => ({
              value: String(b.id),
              label: b.name,
            }))}
            placeholder="Seleccione un edificio"
            value={String(selectedBuildingId)}
            onChange={(e) => setSelectedBuildingId(Number(e.target.value))}
          />
        )}

        <Select
          label="Servicio"
          options={utilities.map((u) => ({
            value: String(u.id),
            label: `${u.name} - ${u.accountNumber}`,
          }))}
          placeholder="Seleccione un servicio"
          error={errors.utilityId?.message}
          {...register('utilityId')}
        />

        <Input
          label="Mes"
          type="month"
          error={errors.month?.message}
          {...register('month')}
        />

        <Input
          label="Monto (S/)"
          type="number"
          step="0.01"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Input
          label="Fecha de Vencimiento"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <Select
          label="Metodo de Pago"
          options={[
            { value: 'TRANSFERENCIA', label: 'Transferencia' },
            { value: 'EFECTIVO', label: 'Efectivo' },
            { value: 'TARJETA', label: 'Tarjeta' },
            { value: 'CHEQUE', label: 'Cheque' },
          ]}
          placeholder="Seleccione (opcional)"
          {...register('paymentMethod')}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Notas
          </label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            rows={3}
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEditing ? 'Guardar Cambios' : 'Crear Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
