import { useState } from 'react';
import { useWorkOrders } from '../hooks/useWorkOrders';
import KanbanBoard from '../components/workorders/KanbanBoard';
import WorkOrderForm from '../components/workorders/WorkOrderForm';
import WorkOrderDetail from '../components/workorders/WorkOrderDetail';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import type { WorkOrder } from '../types';

export default function WorkOrdersPage() {
  const { data: workOrders = [], isLoading } = useWorkOrders();
  const [showForm, setShowForm] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  const handleViewDetail = (workOrder: WorkOrder) => {
    setDetailId(workOrder.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona las ordenes de trabajo
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Ticket
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <KanbanBoard workOrders={workOrders} onViewDetail={handleViewDetail} />
      )}

      <WorkOrderForm isOpen={showForm} onClose={() => setShowForm(false)} />

      {detailId !== null && (
        <WorkOrderDetail
          workOrderId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
