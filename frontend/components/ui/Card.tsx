import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
}

export function Card({ children, className, title, badge }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-terminal-panel border border-terminal-border rounded-lg overflow-hidden',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border">
          <h2 className="text-xs font-semibold text-terminal-muted uppercase tracking-widest">
            {title}
          </h2>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/20">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
