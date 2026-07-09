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
    <div className={`${bgColor} group min-w-0 rounded-2xl border border-white/70 p-3.5 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-sky-900/60 dark:bg-slate-900 dark:ring-sky-900/50 sm:p-4`}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-sky-200">{title}</p>
          <p className="mt-1.5 truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">{value}</p>
          {subtitle && <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-300">{subtitle}</p>}
        </div>
        {icon && <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/80 text-slate-600 shadow-sm transition group-hover:scale-105 group-hover:text-cyan-600 dark:bg-slate-950 dark:text-cyan-300 sm:size-11">{icon}</div>}
      </div>
    </div>
  );
}
