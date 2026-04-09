import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ActivityLogEntry } from '../../types';

interface RecentActivityProps {
  entries: ActivityLogEntry[];
}

const actionLabels: Record<string, string> = {
  CREATE: 'creo',
  UPDATE: 'actualizo',
  DELETE: 'elimino',
  STATUS_CHANGE: 'cambio estado de',
  MARK_PAID: 'marco como pagado',
};

const entityLabels: Record<string, string> = {
  PAYMENT: 'Pago',
  WORK_ORDER: 'Ticket',
  BUILDING: 'Edificio',
  USER: 'Usuario',
};

export default function RecentActivity({ entries }: RecentActivityProps) {
  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Actividad Reciente
        </h3>
      </div>
      <div className="divide-y divide-slate-50">
        {entries.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            Sin actividad reciente
          </div>
        ) : (
          entries.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-center gap-4 px-6 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <span className="text-xs font-bold">
                  {entry.userName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700">
                  <span className="font-medium">{entry.userName}</span>{' '}
                  {actionLabels[entry.action] || entry.action}{' '}
                  <span className="text-slate-500">
                    {entityLabels[entry.entityType] || entry.entityType} #{entry.entityId}
                  </span>
                </p>
              </div>
              <span className="flex-shrink-0 text-xs text-slate-400">
                {formatDistanceToNow(new Date(entry.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
