import { useState } from 'react';
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useUpdateWorkOrderStatus } from '../../hooks/useWorkOrders';
import type { WorkOrder, WorkOrderStatus } from '../../types';

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onViewDetail: (workOrder: WorkOrder) => void;
}

const columns: { id: WorkOrderStatus; title: string; color: string }[] = [
  { id: 'ABIERTA', title: 'Abierta', color: 'border-blue-400' },
  { id: 'EN_PROGRESO', title: 'En Progreso', color: 'border-amber-400' },
  { id: 'COMPLETADA', title: 'Completada', color: 'border-green-400' },
  { id: 'CERRADA', title: 'Cerrada', color: 'border-slate-400' },
];

export default function KanbanBoard({
  workOrders,
  onViewDetail,
}: KanbanBoardProps) {
  const updateStatus = useUpdateWorkOrderStatus();
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const activeWorkOrder = activeId
    ? workOrders.find((wo) => wo.id === activeId) || null
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const workOrderId = Number(active.id);
    const newStatus = String(over.id) as WorkOrderStatus;

    const workOrder = workOrders.find((wo) => wo.id === workOrderId);
    if (!workOrder || workOrder.status === newStatus) return;

    updateStatus.mutate({
      id: workOrderId,
      data: { status: newStatus },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnOrders = workOrders.filter(
            (wo) => wo.status === column.id
          );
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnOrders.length}
              color={column.color}
            >
              {columnOrders.map((wo) => (
                <KanbanCard
                  key={wo.id}
                  workOrder={wo}
                  onClick={() => onViewDetail(wo)}
                />
              ))}
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeWorkOrder ? (
          <div className="rotate-3 opacity-90">
            <KanbanCard workOrder={activeWorkOrder} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
