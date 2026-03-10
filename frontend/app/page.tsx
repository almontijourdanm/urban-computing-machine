import { Suspense } from "react";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { LiveJobFeed } from "../components/dashboard/LiveJobFeed";
import { TopSkillsChart } from "../components/dashboard/TopSkillsChart";
import { SalaryTrendChart } from "../components/dashboard/SalaryTrendChart";
import { LocationChart } from "../components/dashboard/LocationChart";
import { StatsCards } from "../components/dashboard/StatsCards";
import { api } from "../services/api";
import type {
  Job,
  TopSkill,
  SalaryTrend,
  LocationStat,
  JobStats,
} from "../types";

const EMPTY_STATS: JobStats = {
  total_today: 0,
  most_hiring_company: "N/A",
  remote_percentage: 0,
};

async function getDashboardData() {
  const [skillsRes, trendsRes, locationsRes, statsRes, jobsRes] =
    await Promise.allSettled([
      api.getTopSkills(15),
      api.getSalaryTrends(30),
      api.getJobLocations(10),
      api.getJobCount(),
      api.getJobs(1, 20),
    ]);

  return {
    skills:
      skillsRes.status === "fulfilled"
        ? skillsRes.value.data
        : ([] as TopSkill[]),
    salaryTrends:
      trendsRes.status === "fulfilled"
        ? trendsRes.value.data
        : ([] as SalaryTrend[]),
    locations:
      locationsRes.status === "fulfilled"
        ? locationsRes.value.data
        : ([] as LocationStat[]),
    stats: statsRes.status === "fulfilled" ? statsRes.value.data : EMPTY_STATS,
    recentJobs:
      jobsRes.status === "fulfilled" ? jobsRes.value.jobs : ([] as Job[]),
  };
}

export default async function DashboardPage() {
  const { skills, salaryTrends, locations, stats, recentJobs } =
    await getDashboardData();

  return (
    <>
      <Header title="Developer Job Market Radar" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ── KPI cards ─────────────────────────────────────── */}
        <StatsCards stats={stats} />

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live feed */}
          <Card title="Live Job Feed" badge="LIVE" className="lg:col-span-1">
            <Suspense
              fallback={<p className="text-terminal-muted text-sm">Loading…</p>}
            >
              <LiveJobFeed initialJobs={recentJobs} />
            </Suspense>
          </Card>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Top In-Demand Skills">
              <TopSkillsChart initialData={skills} />
            </Card>

            <Card title="Salary Trends — 30 days">
              <SalaryTrendChart data={salaryTrends} />
            </Card>
          </div>
        </div>

        {/* ── Location breakdown ─────────────────────────────── */}
        <Card title="Job Distribution by Location">
          <LocationChart data={locations} />
        </Card>
      </main>
    </>
  );
}
