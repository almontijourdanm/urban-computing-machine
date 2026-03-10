import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { SalaryTrendChart } from '../../components/dashboard/SalaryTrendChart';
import { LocationChart } from '../../components/dashboard/LocationChart';
import { api } from '../../services/api';
import type { SalaryTrend, LocationStat } from '../../types';

export default async function TrendsPage() {
  let salaryTrends: SalaryTrend[] = [];
  let locationData: LocationStat[] = [];

  try {
    const [trendsRes, locationsRes] = await Promise.allSettled([
      api.getSalaryTrends(30),
      api.getJobLocations(10),
    ]);
    salaryTrends = trendsRes.status    === 'fulfilled' ? trendsRes.value.data    : [];
    locationData = locationsRes.status === 'fulfilled' ? locationsRes.value.data : [];
  } catch {
    // Backend offline
  }

  return (
    <>
      <Header title="Market Trends" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <Card title="Salary Trends — Past 30 Days">
          <SalaryTrendChart data={salaryTrends} />
        </Card>

        <Card title="Location Distribution">
          <LocationChart data={locationData} />
        </Card>

        <Card title="Salary Data Table">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="text-left py-2 text-terminal-muted uppercase tracking-widest">Date</th>
                  <th className="text-right py-2 text-terminal-muted uppercase tracking-widest">Avg Salary</th>
                  <th className="text-right py-2 text-terminal-muted uppercase tracking-widest">Jobs</th>
                </tr>
              </thead>
              <tbody>
                {salaryTrends.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-terminal-muted">
                      No data yet.
                    </td>
                  </tr>
                ) : (
                  salaryTrends.map((row) => (
                    <tr
                      key={row.date}
                      className="border-b border-terminal-border/50 hover:bg-white/[0.02]"
                    >
                      <td className="py-1.5">{row.date}</td>
                      <td className="py-1.5 text-right text-terminal-green">
                        {row.average_salary != null
                          ? `$${Math.round(row.average_salary).toLocaleString()}`
                          : '—'}
                      </td>
                      <td className="py-1.5 text-right text-terminal-accent">{row.job_count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </main>
    </>
  );
}
