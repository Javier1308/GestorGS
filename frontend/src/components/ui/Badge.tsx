import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'gray' | 'green' | 'red' | 'amber' | 'blue' | 'violet' | 'orange';
  size?: 'sm' | 'md';
}

const colorStyles = {
  gray: 'bg-slate-100 text-slate-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-primary-100 text-primary-700',
  orange: 'bg-orange-100 text-orange-700',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  children,
  color = 'gray',
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        colorStyles[color],
        sizeStyles[size]
      )}
    >
      {children}
    </span>
  );
}
