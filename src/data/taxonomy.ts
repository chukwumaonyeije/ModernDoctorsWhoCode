export const CONTROLLED_TOPICS = [
  {
    id: 'physician-developer-foundations',
    label: 'Physician-Developer Foundations',
    terms: ['beginner', 'coding', 'disposable software', 'git', 'github', 'json', 'markdown', 'physician-developer'],
  },
  {
    id: 'clinical-ai',
    label: 'Clinical AI',
    terms: ['agent', 'ai', 'artificial intelligence', 'chatgpt', 'clinical judgment', 'llm', 'local model', 'prompt', 'rag'],
  },
  {
    id: 'healthcare-data-and-fhir',
    label: 'Healthcare Data and FHIR',
    terms: ['api', 'data', 'database', 'fhir', 'interoperability', 'json', 'postgres', 'smart on fhir'],
  },
  {
    id: 'clinical-workflow-automation',
    label: 'Clinical Workflow Automation',
    terms: ['automation', 'burnout', 'documentation', 'human checkpoint', 'workflow'],
  },
  {
    id: 'building-and-shipping',
    label: 'Building and Shipping',
    terms: ['app', 'calculator', 'deployment', 'devops', 'infrastructure', 'software', 'testing', 'version control'],
  },
  {
    id: 'maternal-fetal-medicine-systems',
    label: 'Maternal-Fetal Medicine Systems',
    terms: ['fetal', 'gestational', 'maternal', 'mfm', 'obstetric', 'placenta', 'preeclampsia', 'pregnancy'],
  },
  {
    id: 'physician-entrepreneurship',
    label: 'Physician Entrepreneurship',
    terms: ['business', 'distribution', 'entrepreneur', 'leadership', 'open source', 'ownership'],
  },
] as const;

export const ARTICLE_FORMATS = [
  { id: 'tutorial', label: 'Tutorial' },
  { id: 'build-note', label: 'Build Note' },
  { id: 'clinical-analysis', label: 'Clinical Analysis' },
  { id: 'essay', label: 'Essay' },
] as const;

function normalize(value: string) {
  return value.toLowerCase().replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function includesTerm(haystack: string, term: string) {
  const normalizedTerm = normalize(term);

  if (normalizedTerm.length > 3 || normalizedTerm.includes(' ')) {
    return haystack.includes(normalizedTerm);
  }

  const escapedTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escapedTerm}\\b`).test(haystack);
}

interface ArticleTaxonomyInput {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export function classifyArticleTopics(article: ArticleTaxonomyInput) {
  const haystack = normalize([
    article.title,
    article.description,
    article.category,
    ...article.tags,
  ].join(' '));

  return CONTROLLED_TOPICS
    .map((topic) => ({
      id: topic.id,
      score: topic.terms.reduce((score, term) => score + Number(includesTerm(haystack, term)), 0),
    }))
    .filter((topic) => topic.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((topic) => topic.id);
}

export function classifyArticleFormat(article: ArticleTaxonomyInput) {
  const haystack = normalize([article.title, article.description, article.category, ...article.tags].join(' '));

  if (/tutorial|complete guide|how to|getting started|your first|practical guide/.test(haystack)) return 'tutorial';
  if (/i built|building|build note|project|tech stack|deployment/.test(haystack)) return 'build-note';
  if (/clinical|patient|pregnan|obstetric|maternal|fetal|preeclampsia|medicine/.test(haystack)) return 'clinical-analysis';
  return 'essay';
}

export function normalizeCategory(category: string) {
  const value = normalize(category);
  if (/\bai\b|artificial intelligence/.test(value)) return 'Clinical AI';
  if (value.includes('maternal') || value.includes('obstetric')) return 'Maternal-Fetal Medicine';
  if (value.includes('physician')) return 'Physician Development';
  if (value.includes('clinical informatics')) return 'Clinical Informatics';
  return category.trim() || 'Technology';
}
