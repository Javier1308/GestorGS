// ── Enums ──────────────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'STAFF' | 'TECHNICIAN' | 'OWNER';

export type PaymentStatus = 'PENDIENTE' | 'PAGADO' | 'VENCIDO';

export type WorkOrderStatus = 'ABIERTA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CERRADA';

export type Priority = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// ── Entities ───────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
}

export interface Building {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  totalUtilities: number;
  activeWorkOrders: number;
}

export interface Utility {
  id: number;
  buildingId: number;
  name: string;
  accountNumber: string;
}

export interface Payment {
  id: number;
  utilityId: number;
  utilityName: string;
  buildingName: string;
  month: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: PaymentStatus;
  receiptNumber: string | null;
  paymentMethod: string | null;
  notes: string | null;
  daysOverdue: number;
}

export interface WorkOrder {
  id: number;
  title: string;
  description: string;
  buildingId: number;
  buildingName: string;
  status: WorkOrderStatus;
  assignedTo: number | null;
  assignedToName: string | null;
  createdBy: number;
  createdByName: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  comments: WorkOrderComment[];
}

export interface WorkOrderComment {
  id: number;
  workOrderId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: number;
  entityType: string;
  entityId: number;
  userId: number;
  userName: string;
  action: string;
  createdAt: string;
}

// ── Dashboard ──────────────────────────────────────────────────────────

export interface DashboardData {
  overduePaymentsCount: number;
  openWorkOrdersCount: number;
  activeUsersCount: number;
  buildingsCount: number;
  recentActivity: ActivityLogEntry[];
}

export interface PaymentChartData {
  month: string;
  paid: number;
  pending: number;
}

// ── Auth ───────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Requests ───────────────────────────────────────────────────────────

export interface CreateBuildingRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CreatePaymentRequest {
  utilityId: number;
  month: string;
  amount: number;
  dueDate: string;
  paymentMethod?: string;
  notes?: string;
}

export interface MarkPaidRequest {
  receiptNumber: string;
  paidDate?: string;
}

export interface CreateWorkOrderRequest {
  title: string;
  description: string;
  buildingId: number;
  priority: Priority;
  assignedTo?: number;
}

export interface UpdateWorkOrderStatusRequest {
  status: WorkOrderStatus;
}

export interface AddCommentRequest {
  content: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  password: string;
}

// ── Toast ──────────────────────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}
