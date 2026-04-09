import api from '../lib/api';
import type { Building, CreateBuildingRequest, Utility } from '../types';

export const buildingService = {
  getAll: async (): Promise<Building[]> => {
    const response = await api.get<Building[]>('/buildings');
    return response.data;
  },

  getById: async (id: number): Promise<Building> => {
    const response = await api.get<Building>(`/buildings/${id}`);
    return response.data;
  },

  create: async (data: CreateBuildingRequest): Promise<Building> => {
    const response = await api.post<Building>('/buildings', data);
    return response.data;
  },

  update: async (id: number, data: CreateBuildingRequest): Promise<Building> => {
    const response = await api.put<Building>(`/buildings/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/buildings/${id}`);
  },

  getUtilities: async (buildingId: number): Promise<Utility[]> => {
    const response = await api.get<Utility[]>(`/buildings/${buildingId}/utilities`);
    return response.data;
  },

  createUtility: async (
    buildingId: number,
    data: { name: string; accountNumber: string }
  ): Promise<Utility> => {
    const response = await api.post<Utility>(
      `/buildings/${buildingId}/utilities`,
      data
    );
    return response.data;
  },

  deleteUtility: async (buildingId: number, utilityId: number): Promise<void> => {
    await api.delete(`/buildings/${buildingId}/utilities/${utilityId}`);
  },
};
