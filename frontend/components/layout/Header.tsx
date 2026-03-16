'use client';

import { useSocket } from '../../hooks/useSocket';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { isConnected } = useSocket();

  return (
    <header className="h-14 bg-terminal-panel border-b border-terminal-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-terminal-accent text-xs tracking-widest font-mono">▶</span>
        <h1 className="text-sm font-semibold text-terminal-text tracking-wide uppercase moving-title">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        {/* UTC Clock */}
        <span
          className="text-xs text-terminal-muted font-mono hidden sm:block"
          suppressHydrationWarning
        >
          {new Date().toUTCString().replace(' GMT', ' UTC')}
        </span>

        {/* Live / Offline indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-terminal-green live-dot' : 'bg-terminal-red'
            }`}
          />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: isConnected ? 'var(--tw-terminal-green, #00ff88)' : '#64748b' }}
          >
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </header>
  );
}
