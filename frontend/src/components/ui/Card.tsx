import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  icon?: ReactNode;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  className?: string;
}

export default function Card({
  icon,
  value,
  label,
  trend,
  color = 'text-primary-600',
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
        </div>
        {icon && (
          <div className={clsx('rounded-lg bg-slate-50 p-3', color)}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          {trend === 'up' && (
            <span className="text-red-600 font-medium">Requiere atencion</span>
          )}
          {trend === 'down' && (
            <span className="text-green-600 font-medium">En buen estado</span>
          )}
          {trend === 'neutral' && (
            <span className="text-slate-500 font-medium">Sin cambios</span>
          )}
        </div>
      )}
    </div>
  );
}
