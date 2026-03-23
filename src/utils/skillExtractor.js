const SKILL_KEYWORDS = {
  coreCS: ['dsa', 'dynamic programming', 'oop', 'dbms', 'operating system', 'os', 'networks', 'networking', 'data structures', 'algorithms'],
  languages: ['java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'go', 'golang', 'rust', 'kotlin'],
  web: ['react', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'rest', 'graphql', 'vue', 'angular', 'svelte'],
  data: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'firestore'],
  cloudDevOps: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'cicd', 'linux', 'terraform', 'ansible'],
  testing: ['selenium', 'cypress', 'playwright', 'junit', 'pytest', 'jasmine', 'mocha', 'rspec', 'testng'],
}

const SKILL_CANONICAL = {
  golang: 'go',
  nextjs: 'next.js',
  nodejs: 'node.js',
  k8s: 'kubernetes',
  cicd: 'ci/cd',
}

const DEFAULT_SKILLS = ['communication', 'problem solving', 'basic coding', 'projects']

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createSkillRegex(skill) {
  return new RegExp(`(^|[^a-z0-9+#.])${escapeRegExp(skill)}([^a-z0-9+#.]|$)`, 'i')
}

const SKILL_PATTERNS = Object.fromEntries(
  Object.entries(SKILL_KEYWORDS).map(([category, keywords]) => [
    category,
    keywords.map((keyword) => ({
      keyword,
      canonical: SKILL_CANONICAL[keyword] || keyword,
      regex: createSkillRegex(keyword),
    })),
  ]),
)

function unique(values = []) {
  return [...new Set(values)]
}

export function extractSkills(jdText) {
  const text = normalizeText(jdText)
  const detected = {}
  const allSkillsFound = []

  Object.entries(SKILL_PATTERNS).forEach(([category, patterns]) => {
    const found = unique(
      patterns
        .filter(({ regex }) => regex.test(text))
        .map(({ canonical }) => canonical),
    )

    if (found.length > 0) {
      detected[category] = found
      allSkillsFound.push(category)
    }
  })

  const isEmpty = allSkillsFound.length === 0
  if (isEmpty) {
    detected.other = DEFAULT_SKILLS
  }

  return {
    coreCS: detected.coreCS || [],
    languages: detected.languages || [],
    web: detected.web || [],
    data: detected.data || [],
    cloudDevOps: detected.cloudDevOps || [],
    testing: detected.testing || [],
    other: detected.other || [],
    categorized: detected,
    allCategories: allSkillsFound,
    isEmpty,
  }
}
