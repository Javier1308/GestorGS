import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: ReactNode;
}

export default function KanbanColumn({
  id,
  title,
  count,
  color,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'flex w-72 flex-shrink-0 flex-col rounded-xl bg-slate-100/80 transition-colors',
        isOver && 'bg-primary-50 ring-2 ring-primary-300'
      )}
    >
      {/* Column header */}
      <div className={clsx('border-t-4 rounded-t-xl px-4 py-3', color)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 shadow-sm">
            {count}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thin min-h-[200px]">
        {children}
      </div>
    </div>
  );
}
