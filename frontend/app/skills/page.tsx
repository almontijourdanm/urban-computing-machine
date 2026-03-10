import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { TopSkillsChart } from '../../components/dashboard/TopSkillsChart';
import { api } from '../../services/api';
import type { TopSkill } from '../../types';

export default async function SkillsPage() {
  let skills: TopSkill[] = [];

  try {
    const res = await api.getTopSkills(20);
    skills = res.data;
  } catch {
    // Backend offline
  }

  const maxCount = skills[0]?.count ?? 1;

  return (
    <>
      <Header title="Skill Demand" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <Card title="Top 20 In-Demand Skills" badge={`${skills.length} tracked`}>
          <TopSkillsChart initialData={skills} />
        </Card>

        <Card title="Skill Rankings">
          {skills.length === 0 ? (
            <p className="text-terminal-muted text-sm text-center py-8">No data yet.</p>
          ) : (
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={skill.skill} className="flex items-center gap-4">
                  <span className="w-6 text-xs text-terminal-muted text-right font-mono">
                    {index + 1}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm text-terminal-text w-36 truncate font-mono">
                      {skill.skill}
                    </span>
                    <div className="flex-1 bg-terminal-border rounded-full h-1.5">
                      <div
                        className="bg-terminal-accent rounded-full h-1.5 transition-all duration-500"
                        style={{ width: `${(skill.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-terminal-muted w-10 text-right font-mono">
                      {skill.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </main>
    </>
  );
}
