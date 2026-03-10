import type { JobStats } from '../../types';

interface StatsCardsProps {
  stats: JobStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Jobs (24 h)',
      value: stats.total_today.toLocaleString(),
      color: 'text-terminal-accent',
      icon: '◈',
    },
    {
      label: 'Top Hiring',
      value: stats.most_hiring_company,
      color: 'text-terminal-green',
      icon: '◉',
    },
    {
      label: 'Remote %',
      value: `${stats.remote_percentage}%`,
      color: 'text-terminal-yellow',
      icon: '◆',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-terminal-panel border border-terminal-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-terminal-muted uppercase tracking-widest">{card.label}</p>
            <span className={`text-base ${card.color}`}>{card.icon}</span>
          </div>
          <p className={`text-xl font-bold truncate font-mono ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
