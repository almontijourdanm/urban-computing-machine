import axios from 'axios';
import { NormalizedJob, ArbeitnowResponse } from '../types';
import { extractSkillsFromText } from './skills.extractor';

const ARBEITNOW_URL = 'https://arbeitnow.com/api/job-board-api';

export async function fetchArbeitnowJobs(): Promise<NormalizedJob[]> {
  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_URL, {
    timeout: 10_000,
  });

  return response.data.data.map((job) => ({
    id: `arbeitnow-${job.slug}`,
    title: job.title,
    company: job.company_name,
    skills:
      job.tags.length > 0
        ? job.tags.map((t) => t.toLowerCase())
        : extractSkillsFromText(job.title),
    salary: null,
    location: job.remote ? 'Remote' : job.location || 'Unknown',
    source: 'arbeitnow' as const,
    url: job.url,
    created_at: job.created_at
      ? new Date(
          typeof job.created_at === 'number'
            ? job.created_at * 1000   // Unix timestamp → ms
            : job.created_at
        ).toISOString()
      : new Date().toISOString(),
  }));
}
