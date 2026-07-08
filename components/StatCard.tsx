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
    <div className={`${bgColor} group rounded-2xl border border-white/70 p-6 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value}</p>
          {subtitle && <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>}
        </div>
        {icon && <div className="ml-4 rounded-2xl bg-white/80 p-3 text-slate-600 shadow-sm transition group-hover:scale-110 group-hover:text-cyan-600">{icon}</div>}
      </div>
    </div>
  );
}
