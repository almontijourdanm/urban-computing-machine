/**
 * Keyword-based skill extractor.
 * Used as a fallback when an API provides no structured tags.
 */

const KNOWN_SKILLS = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'go', 'golang', 'rust',
  'ruby', 'php', 'c#', 'c++', 'swift', 'kotlin', 'scala', 'elixir',
  // Frontend
  'react', 'vue', 'angular', 'next.js', 'nuxt', 'svelte', 'tailwind',
  'html', 'css', 'sass', 'webpack', 'vite',
  // Backend
  'node.js', 'express', 'fastapi', 'django', 'flask', 'rails', 'spring',
  'nestjs', 'laravel', 'graphql', 'rest', 'grpc',
  // Cloud / Infra
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
  'linux', 'nginx', 'ci/cd', 'github actions', 'jenkins',
  // Data
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
  'kafka', 'rabbitmq', 'sqlite', 'dynamodb', 'cassandra',
  // ML / Data
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'spark',
  'pandas', 'numpy', 'sql',
  // Practices
  'devops', 'agile', 'scrum', 'tdd', 'microservices', 'git',
];

export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill));
}
