import clsx from 'clsx';

type Variant = 'default' | 'accent' | 'green' | 'yellow' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

const variantMap: Record<Variant, string> = {
  default: 'bg-white/5 text-terminal-muted   border-white/10',
  accent:  'bg-terminal-accent/10 text-terminal-accent border-terminal-accent/20',
  green:   'bg-terminal-green/10  text-terminal-green  border-terminal-green/20',
  yellow:  'bg-terminal-yellow/10 text-terminal-yellow border-terminal-yellow/20',
  red:     'bg-terminal-red/10    text-terminal-red    border-terminal-red/20',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-1.5 py-0.5 rounded text-xs border font-mono',
        variantMap[variant]
      )}
    >
      {children}
    </span>
  );
}
