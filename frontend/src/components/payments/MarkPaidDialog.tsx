import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useMarkPaymentAsPaid } from '../../hooks/usePayments';

const markPaidSchema = z.object({
  receiptNumber: z.string().min(1, 'Ingrese el numero de recibo'),
  paidDate: z.string().optional(),
});

type MarkPaidFormData = z.infer<typeof markPaidSchema>;

interface MarkPaidDialogProps {
  paymentId: number;
  onClose: () => void;
}

export default function MarkPaidDialog({
  paymentId,
  onClose,
}: MarkPaidDialogProps) {
  const markAsPaid = useMarkPaymentAsPaid();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MarkPaidFormData>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: {
      paidDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: MarkPaidFormData) => {
    markAsPaid.mutate(
      { id: paymentId, data },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal isOpen onClose={onClose} title="Marcar como Pagado" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Numero de Recibo"
          placeholder="Ej: REC-001234"
          error={errors.receiptNumber?.message}
          {...register('receiptNumber')}
        />

        <Input
          label="Fecha de Pago"
          type="date"
          error={errors.paidDate?.message}
          {...register('paidDate')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={markAsPaid.isPending}>
            Confirmar Pago
          </Button>
        </div>
      </form>
    </Modal>
  );
}
