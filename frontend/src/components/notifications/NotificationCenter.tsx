import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import Spinner from '../ui/Spinner';

interface NotificationCenterProps {
  onClose: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">Notificaciones</h3>
        {unreadNotifs.length > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Marcar todas como leidas
          </button>
        )}
      </div>

      {/* Body */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="py-8">
            <Spinner size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No hay notificaciones
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) {
                  markAsRead.mutate(notif.id);
                }
              }}
              className={clsx(
                'block w-full border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50',
                !notif.isRead && 'bg-primary-50/50'
              )}
            >
              <div className="flex items-start gap-3">
                {!notif.isRead && (
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                )}
                <div className={clsx(!notif.isRead ? '' : 'pl-5')}>
                  <p className="text-sm font-medium text-slate-800">
                    {notif.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {notif.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
