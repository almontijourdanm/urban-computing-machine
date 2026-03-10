'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SalaryTrend } from '../../types';

interface SalaryTrendChartProps {
  data: SalaryTrend[];
}

export function SalaryTrendChart({ data }: SalaryTrendChartProps) {
  const chartData = data.map((d) => ({
    date: d.date.split('T')[0],
    avg_salary: d.average_salary != null ? Math.round(d.average_salary) : null,
    job_count: d.job_count,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: '#1e2d4a' }}
        />
        <YAxis
          yAxisId="salary"
          orientation="left"
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <YAxis
          yAxisId="count"
          orientation="right"
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
          formatter={(value: number, name: string) =>
            name === 'avg_salary'
              ? [`$${value?.toLocaleString()}`, 'Avg Salary']
              : [value, 'Job Count']
          }
        />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}
          formatter={(value) => (value === 'avg_salary' ? 'Avg Salary' : 'Job Count')}
        />
        <Line
          yAxisId="salary"
          type="monotone"
          dataKey="avg_salary"
          stroke="#00ff88"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
        <Line
          yAxisId="count"
          type="monotone"
          dataKey="job_count"
          stroke="#00d4ff"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="4 4"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
