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
import type { LocationStat } from '../../types';

interface LocationChartProps {
  data: LocationStat[];
}

const COLORS = [
  '#00d4ff', '#00bfea', '#00aad5', '#0095c0', '#0080ab',
  '#006b96', '#005681', '#00416c', '#002c57', '#001742',
];

export function LocationChart({ data }: LocationChartProps) {
  const display = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={display}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: '#1e2d4a' }}
        />
        <YAxis
          type="category"
          dataKey="location"
          tick={{ fill: '#e2e8f0', fontSize: 10, fontFamily: 'monospace' }}
          width={100}
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
        <Bar dataKey="count" radius={[0, 3, 3, 0]}>
          {display.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
