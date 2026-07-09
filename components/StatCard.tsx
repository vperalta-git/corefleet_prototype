'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  bgColor?: string;
}

export function StatCard({ title, value, subtitle, icon, bgColor = 'bg-blue-50' }: StatCardProps) {
  return (
    <div className={`${bgColor} group min-w-0 rounded-2xl border border-white/70 p-4 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-5`}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-2 truncate text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{value}</p>
          {subtitle && <p className="mt-1.5 truncate text-xs font-semibold text-slate-500 sm:text-sm">{subtitle}</p>}
        </div>
        {icon && <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/80 text-slate-600 shadow-sm transition group-hover:scale-105 group-hover:text-cyan-600 sm:size-12">{icon}</div>}
      </div>
    </div>
  );
}
