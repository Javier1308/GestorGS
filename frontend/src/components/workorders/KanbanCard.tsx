import { useDraggable } from '@dnd-kit/core';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';
import Badge from '../ui/Badge';
import type { WorkOrder, Priority } from '../../types';

interface KanbanCardProps {
  workOrder: WorkOrder;
  onClick: () => void;
}

const priorityBadge: Record<Priority, { color: 'blue' | 'amber' | 'orange' | 'red'; label: string }> = {
  BAJA: { color: 'blue', label: 'Baja' },
  MEDIA: { color: 'amber', label: 'Media' },
  ALTA: { color: 'orange', label: 'Alta' },
  URGENTE: { color: 'red', label: 'Urgente' },
};

export default function KanbanCard({ workOrder, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: workOrder.id,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const badge = priorityBadge[workOrder.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      {/* ID and priority */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">
          WO-{workOrder.id}
        </span>
        <Badge color={badge.color} size="sm">
          {badge.label}
        </Badge>
      </div>

      {/* Title */}
      <p className="mb-2 text-sm font-medium text-slate-800 line-clamp-2">
        {workOrder.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {workOrder.assignedToName ? (
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
              {workOrder.assignedToName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-slate-500 truncate max-w-[80px]">
              {workOrder.assignedToName}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Sin asignar</span>
        )}

        <span className="text-xs text-slate-400">
          {formatDistanceToNow(new Date(workOrder.createdAt), {
            addSuffix: true,
            locale: es,
          })}
        </span>
      </div>
    </div>
  );
}
