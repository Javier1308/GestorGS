import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useBuildings } from '../hooks/useBuildings';
import PaymentsList from '../components/payments/PaymentsList';
import PaymentForm from '../components/payments/PaymentForm';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import type { Payment } from '../types';
import type { PaymentFilters } from '../services/paymentService';

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({});
  const { data: payments = [], isLoading } = usePayments(filters);
  const { data: buildings = [] } = useBuildings();
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pagos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Control de pagos de servicios
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Pago
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="w-48">
          <Select
            label="Edificio"
            options={[
              { value: '', label: 'Todos' },
              ...buildings.map((b) => ({
                value: String(b.id),
                label: b.name,
              })),
            ]}
            value={filters.buildingId ? String(filters.buildingId) : ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                buildingId: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
        <div className="w-40">
          <Select
            label="Estado"
            options={[
              { value: 'ALL', label: 'Todos' },
              { value: 'PENDIENTE', label: 'Pendiente' },
              { value: 'PAGADO', label: 'Pagado' },
              { value: 'VENCIDO', label: 'Vencido' },
            ]}
            value={filters.status || 'ALL'}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                status: e.target.value === 'ALL' ? undefined : e.target.value,
              }))
            }
          />
        </div>
        <div className="w-40">
          <Input
            label="Desde"
            type="month"
            value={filters.monthFrom || ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                monthFrom: e.target.value || undefined,
              }))
            }
          />
        </div>
        <div className="w-40">
          <Input
            label="Hasta"
            type="month"
            value={filters.monthTo || ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                monthTo: e.target.value || undefined,
              }))
            }
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({})}
        >
          Limpiar filtros
        </Button>
      </div>

      <PaymentsList
        payments={payments}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <PaymentForm
        isOpen={showForm}
        onClose={handleCloseForm}
        payment={editingPayment}
      />
    </div>
  );
}
