import axios from 'axios';
import { NormalizedJob, RemotiveResponse } from '../types';
import { extractSkillsFromText } from './skills.extractor';

const REMOTIVE_URL = 'https://remotive.io/api/remote-jobs';

export async function fetchRemotiveJobs(): Promise<NormalizedJob[]> {
  const response = await axios.get<RemotiveResponse>(REMOTIVE_URL, {
    timeout: 10_000,
  });

  return response.data.jobs.map((job) => ({
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    skills:
      job.tags.length > 0
        ? job.tags.map((t) => t.toLowerCase())
        : extractSkillsFromText(job.title),
    salary: job.salary || null,
    location: job.candidate_required_location || 'Remote',
    source: 'remotive' as const,
    url: job.url,
    created_at: job.publication_date || new Date().toISOString(),
  }));
}
