import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrderService } from '../services/workOrderService';
import { useNotificationStore } from '../store/notificationStore';
import type {
  CreateWorkOrderRequest,
  UpdateWorkOrderStatusRequest,
  AddCommentRequest,
} from '../types';

export function useWorkOrders() {
  return useQuery({
    queryKey: ['workOrders'],
    queryFn: workOrderService.getAll,
  });
}

export function useWorkOrder(id: number) {
  return useQuery({
    queryKey: ['workOrders', id],
    queryFn: () => workOrderService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: CreateWorkOrderRequest) => workOrderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast('success', 'Ticket creado exitosamente');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo crear el ticket');
    },
  });
}

export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateWorkOrderRequest }) =>
      workOrderService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      addToast('success', 'Ticket actualizado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo actualizar el ticket');
    },
  });
}

export function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateWorkOrderStatusRequest;
    }) => workOrderService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast('success', 'Estado actualizado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo actualizar el estado');
    },
  });
}

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => workOrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      addToast('success', 'Ticket eliminado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo eliminar el ticket');
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      workOrderId,
      data,
    }: {
      workOrderId: number;
      data: AddCommentRequest;
    }) => workOrderService.addComment(workOrderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workOrders', variables.workOrderId],
      });
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      addToast('success', 'Comentario agregado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo agregar el comentario');
    },
  });
}
