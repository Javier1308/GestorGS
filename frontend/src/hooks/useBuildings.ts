import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingService } from '../services/buildingService';
import { useNotificationStore } from '../store/notificationStore';
import type { CreateBuildingRequest } from '../types';

export function useBuildings() {
  return useQuery({
    queryKey: ['buildings'],
    queryFn: buildingService.getAll,
  });
}

export function useBuilding(id: number) {
  return useQuery({
    queryKey: ['buildings', id],
    queryFn: () => buildingService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: CreateBuildingRequest) => buildingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      addToast('success', 'Edificio creado exitosamente');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo crear el edificio');
    },
  });
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateBuildingRequest }) =>
      buildingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      addToast('success', 'Edificio actualizado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo actualizar el edificio');
    },
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: number) => buildingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      addToast('success', 'Edificio eliminado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo eliminar el edificio');
    },
  });
}

export function useBuildingUtilities(buildingId: number) {
  return useQuery({
    queryKey: ['buildings', buildingId, 'utilities'],
    queryFn: () => buildingService.getUtilities(buildingId),
    enabled: buildingId > 0,
  });
}

export function useCreateUtility() {
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      buildingId,
      data,
    }: {
      buildingId: number;
      data: { name: string; accountNumber: string };
    }) => buildingService.createUtility(buildingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['buildings', variables.buildingId, 'utilities'],
      });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      addToast('success', 'Servicio agregado');
    },
    onError: () => {
      addToast('error', 'Error', 'No se pudo agregar el servicio');
    },
  });
}
