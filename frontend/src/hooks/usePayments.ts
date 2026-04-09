import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService, type PaymentFilters } from '../services/paymentService';
import { useNotificationStore } from '../store/notificationStore';
import type { CreatePaymentRequest, MarkPaidRequest } from '../types';

export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentService.getAll(filters),
  });
}

export function usePaymentChartData() {
  return useQuery({
    queryKey: ['payments', 'chart'],
    queryFn: paymentService.getChartData,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      addToast('success', 'Pago registrado exitosamente');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo registrar el pago');
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePaymentRequest }) =>
      paymentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      addToast('success', 'Pago actualizado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo actualizar el pago');
    },
  });
}

export function useMarkPaymentAsPaid() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MarkPaidRequest }) =>
      paymentService.markAsPaid(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast('success', 'Pago marcado como pagado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo marcar el pago');
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => paymentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      addToast('success', 'Pago eliminado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo eliminar el pago');
    },
  });
}
