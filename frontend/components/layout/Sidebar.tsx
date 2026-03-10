'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/',       label: 'Dashboard', icon: '◈' },
  { href: '/jobs',   label: 'Jobs',      icon: '◉' },
  { href: '/skills', label: 'Skills',    icon: '◆' },
  { href: '/trends', label: 'Trends',    icon: '◇' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 md:w-56 flex-shrink-0 bg-terminal-panel border-r border-terminal-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-terminal-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-terminal-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-terminal-accent text-lg">⬡</span>
          </div>
          <div className="hidden md:block overflow-hidden">
            <p className="text-xs text-terminal-accent font-bold tracking-widest uppercase truncate">
              Job Radar
            </p>
            <p className="text-xs text-terminal-muted">Market Terminal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150',
              pathname === item.href
                ? 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/30'
                : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5 border border-transparent'
            )}
          >
            <span className="text-base w-4 text-center flex-shrink-0">{item.icon}</span>
            <span className="hidden md:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-terminal-border">
        <p className="hidden md:block text-xs text-terminal-muted text-center tracking-widest">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
