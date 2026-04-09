import api from '../lib/api';
import type {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderStatusRequest,
  AddCommentRequest,
  WorkOrderComment,
} from '../types';

export const workOrderService = {
  getAll: async (): Promise<WorkOrder[]> => {
    const response = await api.get<WorkOrder[]>('/work-orders');
    return response.data;
  },

  getById: async (id: number): Promise<WorkOrder> => {
    const response = await api.get<WorkOrder>(`/work-orders/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkOrderRequest): Promise<WorkOrder> => {
    const response = await api.post<WorkOrder>('/work-orders', data);
    return response.data;
  },

  update: async (id: number, data: CreateWorkOrderRequest): Promise<WorkOrder> => {
    const response = await api.put<WorkOrder>(`/work-orders/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdateWorkOrderStatusRequest
  ): Promise<WorkOrder> => {
    const response = await api.patch<WorkOrder>(`/work-orders/${id}/status`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/work-orders/${id}`);
  },

  addComment: async (
    workOrderId: number,
    data: AddCommentRequest
  ): Promise<WorkOrderComment> => {
    const response = await api.post<WorkOrderComment>(
      `/work-orders/${workOrderId}/comments`,
      data
    );
    return response.data;
  },
};
