'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useSkillStats } from '../../hooks/useAnalytics';
import type { TopSkill } from '../../types';

interface TopSkillsChartProps {
  initialData: TopSkill[];
}

const BAR_COLORS = [
  '#00d4ff', '#00c4ee', '#00b4dd', '#00a4cc', '#0094bb',
  '#0084aa', '#007499', '#006488', '#005477', '#004466',
  '#003355', '#002244',
];

export function TopSkillsChart({ initialData }: TopSkillsChartProps) {
  const { skills } = useSkillStats(initialData);
  const display = skills.slice(0, 12);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={display} margin={{ top: 5, right: 10, left: -20, bottom: 65 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
        <XAxis
          dataKey="skill"
          tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
          angle={-45}
          textAnchor="end"
          interval={0}
          tickLine={false}
          axisLine={{ stroke: '#1e2d4a' }}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0f1629',
            border: '1px solid #1e2d4a',
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
          cursor={{ fill: 'rgba(0, 212, 255, 0.05)' }}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {display.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
