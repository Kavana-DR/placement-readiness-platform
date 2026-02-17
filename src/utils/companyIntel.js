/**
 * Company Intelligence Engine
 * Heuristically infers company details from name
 */

const KNOWN_COMPANIES = {
  // Enterprise - 2000+
  'amazon': { size: 'Enterprise', industry: 'Cloud & E-commerce', founded: 1994, hq: 'Seattle, WA' },
  'google': { size: 'Enterprise', industry: 'Search & Cloud', founded: 1998, hq: 'Mountain View, CA' },
  'microsoft': { size: 'Enterprise', industry: 'Software & Cloud', founded: 1975, hq: 'Redmond, WA' },
  'apple': { size: 'Enterprise', industry: 'Hardware & Software', founded: 1976, hq: 'Cupertino, CA' },
  'meta': { size: 'Enterprise', industry: 'Social Media & VR', founded: 2004, hq: 'Menlo Park, CA' },
  'facebook': { size: 'Enterprise', industry: 'Social Media', founded: 2004, hq: 'Menlo Park, CA' },
  'netflix': { size: 'Enterprise', industry: 'Streaming & Media', founded: 1997, hq: 'Los Gatos, CA' },
  'tesla': { size: 'Enterprise', industry: 'Automotive & Energy', founded: 2003, hq: 'Austin, TX' },
  'oracle': { size: 'Enterprise', industry: 'Database & Software', founded: 1977, hq: 'Austin, TX' },
  'ibm': { size: 'Enterprise', industry: 'IT Services & Cloud', founded: 1911, hq: 'Armonk, NY' },
  'infosys': { size: 'Enterprise', industry: 'IT Services', founded: 1981, hq: 'Bangalore, India' },
  'tcs': { size: 'Enterprise', industry: 'IT Services', founded: 1968, hq: 'Mumbai, India' },
  'wipro': { size: 'Enterprise', industry: 'IT Services', founded: 1980, hq: 'Bangalore, India' },
  'accenture': { size: 'Enterprise', industry: 'IT Services & Consulting', founded: 1989, hq: 'Dublin, Ireland' },
  'cognizant': { size: 'Enterprise', industry: 'IT Services', founded: 1994, hq: 'New Jersey, USA' },
  'capgemini': { size: 'Enterprise', industry: 'IT Services & Consulting', founded: 1967, hq: 'Paris, France' },
  'deloitte': { size: 'Enterprise', industry: 'Consulting & Professional Services', founded: 1845, hq: 'London, UK' },
  'mckinsey': { size: 'Enterprise', industry: 'Management Consulting', founded: 1926, hq: 'New York, USA' },
  'goldman sachs': { size: 'Enterprise', industry: 'Financial Services', founded: 1869, hq: 'New York, USA' },
  'jpmorgan': { size: 'Enterprise', industry: 'Financial Services', founded: 1871, hq: 'New York, USA' },
  'tesla': { size: 'Enterprise', industry: 'Automotive', founded: 2003, hq: 'Austin, TX' },
  'linkedin': { size: 'Enterprise', industry: 'Professional Network', founded: 2002, hq: 'Sunnyvale, CA' },
  'airbnb': { size: 'Enterprise', industry: 'Travel & Hospitality', founded: 2008, hq: 'San Francisco, CA' },
  'uber': { size: 'Enterprise', industry: 'Transportation & Mobility', founded: 2009, hq: 'San Francisco, CA' },
  'stripe': { size: 'Enterprise', industry: 'Fintech & Payments', founded: 2010, hq: 'San Francisco, CA' },
  'slack': { size: 'Enterprise', industry: 'Workplace Communication', founded: 2013, hq: 'San Francisco, CA' },
  'zoom': { size: 'Enterprise', industry: 'Video Communication', founded: 2011, hq: 'San Jose, CA' },
  'twitter': { size: 'Enterprise', industry: 'Social Media', founded: 2006, hq: 'San Francisco, CA' },
}

const INDUSTRY_KEYWORDS = {
  'Technology Services': ['tech', 'software', 'platform', 'cloud', 'data', 'ai', 'ml', 'network', 'security'],
  'Financial Services': ['fintech', 'bank', 'finance', 'investment', 'trading', 'payment', 'crypto'],
  'E-commerce': ['ecommerce', 'retail', 'shop', 'market', 'seller', 'buyer'],
  'Healthcare': ['health', 'medical', 'biotech', 'pharma', 'hospital', 'clinic'],
  'Manufacturing': ['manufacturing', 'industrial', 'iot', 'automation', 'robotics'],
  'Education': ['education', 'learning', 'course', 'training', 'edtech'],
  'Media & Entertainment': ['media', 'entertainment', 'streaming', 'gaming', 'video', 'content'],
  'Transportation': ['transport', 'logistics', 'delivery', 'mobility', 'ride'],
  'Real Estate': ['real estate', 'property', 'construction', 'realty'],
  'Energy': ['energy', 'renewable', 'power', 'oil', 'utilities'],
}

export function getCompanyIntel(companyName) {
  if (!companyName || companyName.trim() === '') {
    return {
      name: 'Unknown Company',
      size: 'Startup',
      industry: 'Technology Services',
      sizeCategory: '<200 employees',
      knownCompany: false,
      hiringFocus: getHiringFocus('Startup', [])
    }
  }

  const lowerName = companyName.toLowerCase().trim()

  // Check if known
  let companyInfo = null
  for (const [key, info] of Object.entries(KNOWN_COMPANIES)) {
    if (lowerName.includes(key)) {
      companyInfo = info
      break
    }
  }

  if (companyInfo) {
    return {
      name: companyName,
      size: companyInfo.size,
      industry: companyInfo.industry,
      sizeCategory: getSizeCategory(companyInfo.size),
      knownCompany: true,
      founded: companyInfo.founded,
      hq: companyInfo.hq,
      hiringFocus: getHiringFocus(companyInfo.size, [])
    }
  }

  // Infer from keywords
  let industry = 'Technology Services' // default
  for (const [ind, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      industry = ind
      break
    }
  }

  // Default to Startup if unknown
  return {
    name: companyName,
    size: 'Startup',
    industry,
    sizeCategory: '<200 employees',
    knownCompany: false,
    hiringFocus: getHiringFocus('Startup', [])
  }
}

export function getSizeCategory(size) {
  switch (size) {
    case 'Startup':
      return '<200 employees'
    case 'Mid-size':
      return '200–2,000 employees'
    case 'Enterprise':
      return '2,000+ employees'
    default:
      return '<200 employees'
  }
}

export function getHiringFocus(companySize, detectedSkills) {
  if (companySize === 'Enterprise') {
    return {
      title: 'Structured DSA + Core Fundamentals',
      focus: [
        '✓ Data Structures & Algorithms (DSA) excellence',
        '✓ Strong Core CS fundamentals (OS, DBMS, Networks)',
        '✓ System design and scalability concepts',
        '✓ Best practices and code quality',
        '✓ Large-scale project experience valued'
      ],
      description: 'Enterprise companies prioritize algorithmic thinking and foundational knowledge for building robust, scalable systems.'
    }
  }

  if (companySize === 'Mid-size') {
    return {
      title: 'Balanced DSA + Tech Stack Depth',
      focus: [
        '✓ Good DSA skills with practical application',
        '✓ Deep expertise in specific tech stack',
        '✓ End-to-end project ownership experience',
        '✓ Problem-solving and quick learning ability',
        '✓ Startup-like ownership mindset'
      ],
      description: 'Mid-size companies seek developers who can contribute across the stack while maintaining strong CS fundamentals.'
    }
  }

  // Startup (default)
  return {
    title: 'Practical Problem Solving + Stack Depth',
    focus: [
      '✓ Practical coding and rapid prototyping',
      '✓ Deep expertise in chosen tech stack',
      '✓ Full-stack capability (frontend + backend)',
      '✓ Ability to wear multiple hats',
      '✓ Product-focused and growth mindset'
    ],
    description: 'Startups value practical skills, versatility, and the ability to ship features quickly with minimal guidance.'
  }
}

export function detectCompanySize(companyName) {
  const intel = getCompanyIntel(companyName)
  return intel.size
}
