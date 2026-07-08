'use client';

import * as React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

function SidebarProvider({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(() => defaultOpen ?? true);

  React.useEffect(() => {
    if (defaultOpen === undefined) {
      setOpen(window.innerWidth >= 1280);
    }
  }, [defaultOpen]);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-dvh w-full overflow-x-hidden bg-slate-50 text-slate-950">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function SidebarTrigger({ className }: { className?: string }) {
  const { open, setOpen } = useSidebar();
  const Icon = open ? PanelLeftClose : PanelLeftOpen;

  return (
    <button
      type="button"
      aria-label={open ? 'Collapse sidebar' : 'Open sidebar'}
      onClick={() => setOpen((current) => !current)}
      className={cn(
        'inline-grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700 hover:shadow-md',
        className,
      )}
    >
      <Icon size={18} />
    </button>
  );
}

function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col border-r border-slate-200 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 xl:sticky xl:top-0 xl:h-screen xl:w-72 xl:shadow-sm',
          open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0 xl:w-20',
          className,
        )}
      >
        {children}
      </aside>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm xl:hidden"
        />
      )}
    </>
  );
}

function SidebarHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('border-b border-slate-200 p-5', className)}>{children}</div>;
}

function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex-1 overflow-y-auto p-3', className)}>{children}</div>;
}

function SidebarGroup({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}

function SidebarFooter({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('border-t border-slate-200 p-3', className)}>{children}</div>;
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
