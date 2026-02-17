const SKILL_KEYWORDS = {
  coreCS: { keywords: ['dsa', 'dynamic programming', 'oop', 'dbms', 'os', 'operating system', 'networks', 'networking', 'data structures', 'algorithms'], name: 'Core CS' },
  languages: { keywords: ['java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'go', 'golang', 'rust', 'kotlin'], name: 'Languages' },
  web: { keywords: ['react', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'rest', 'graphql', 'vue', 'angular', 'svelte'], name: 'Web' },
  data: { keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'firestore'], name: 'Data' },
  cloudDevOps: { keywords: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'cicd', 'linux', 'terraform', 'ansible'], name: 'Cloud/DevOps' },
  testing: { keywords: ['selenium', 'cypress', 'playwright', 'junit', 'pytest', 'jasmine', 'mocha', 'rspec', 'testng'] , name: 'Testing' },
}

// Default skills when no specific skills detected
const DEFAULT_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects']

export function extractSkills(jdText) {
  const text = jdText.toLowerCase()
  const detected = {}
  const allSkillsFound = []

  Object.entries(SKILL_KEYWORDS).forEach(([key, val]) => {
    const found = []
    val.keywords.forEach(kw => {
      if (text.includes(kw)) {
        found.push(kw)
      }
    })
    if (found.length > 0) {
      detected[key] = found
      allSkillsFound.push(key)
    }
  })

  // If no skills detected, populate "other" with defaults
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
    isEmpty
  }
}
