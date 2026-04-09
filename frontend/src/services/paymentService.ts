import api from '../lib/api';
import type {
  Payment,
  CreatePaymentRequest,
  MarkPaidRequest,
  PaymentChartData,
} from '../types';

export interface PaymentFilters {
  buildingId?: number;
  status?: string;
  monthFrom?: string;
  monthTo?: string;
}

export const paymentService = {
  getAll: async (filters?: PaymentFilters): Promise<Payment[]> => {
    const params = new URLSearchParams();
    if (filters?.buildingId) params.append('buildingId', String(filters.buildingId));
    if (filters?.status && filters.status !== 'ALL')
      params.append('status', filters.status);
    if (filters?.monthFrom) params.append('monthFrom', filters.monthFrom);
    if (filters?.monthTo) params.append('monthTo', filters.monthTo);

    const response = await api.get<Payment[]>('/payments', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  create: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },

  update: async (id: number, data: CreatePaymentRequest): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${id}`, data);
    return response.data;
  },

  markAsPaid: async (id: number, data: MarkPaidRequest): Promise<Payment> => {
    const response = await api.patch<Payment>(`/payments/${id}/mark-paid`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },

  getChartData: async (): Promise<PaymentChartData[]> => {
    const response = await api.get<PaymentChartData[]>('/payments/chart');
    return response.data;
  },
};
