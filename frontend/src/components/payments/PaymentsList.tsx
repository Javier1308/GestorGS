import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import MarkPaidDialog from './MarkPaidDialog';
import type { Payment, PaymentStatus } from '../../types';

interface PaymentsListProps {
  payments: Payment[];
  isLoading: boolean;
  onEdit: (payment: Payment) => void;
}

const statusBadge: Record<PaymentStatus, { color: 'green' | 'amber' | 'red'; label: string }> = {
  PAGADO: { color: 'green', label: 'Pagado' },
  PENDIENTE: { color: 'amber', label: 'Pendiente' },
  VENCIDO: { color: 'red', label: 'Vencido' },
};

export default function PaymentsList({
  payments,
  isLoading,
  onEdit,
}: PaymentsListProps) {
  const [markPaidId, setMarkPaidId] = useState<number | null>(null);

  const overduePayments = payments.filter((p) => p.status === 'VENCIDO');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Overdue alert */}
      {overduePayments.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <svg className="h-5 w-5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium text-red-800">
            Hay {overduePayments.length} pago(s) vencido(s) que requieren atencion inmediata.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Servicio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Edificio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mes
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Monto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vencimiento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  No se encontraron pagos
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const badge = statusBadge[payment.status];
                return (
                  <tr
                    key={payment.id}
                    className={clsx(
                      'transition-colors hover:bg-slate-50',
                      payment.status === 'VENCIDO' && 'bg-red-50/30'
                    )}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">
                      {payment.utilityName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {payment.buildingName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {payment.month}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-slate-800">
                      S/ {payment.amount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {format(new Date(payment.dueDate), 'dd MMM yyyy', { locale: es })}
                      {payment.daysOverdue > 0 && (
                        <span className="ml-1 text-xs text-red-500">
                          ({payment.daysOverdue}d)
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge color={badge.color}>{badge.label}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status !== 'PAGADO' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setMarkPaidId(payment.id)}
                          >
                            Marcar Pagado
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(payment)}
                        >
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mark Paid Dialog */}
      {markPaidId !== null && (
        <MarkPaidDialog
          paymentId={markPaidId}
          onClose={() => setMarkPaidId(null)}
        />
      )}
    </div>
  );
}
