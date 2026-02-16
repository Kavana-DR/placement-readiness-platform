export function generateChecklist(skillsCategories, isEmpty) {
  const rounds = [
    {
      round: 1,
      title: 'Aptitude / Basics',
      items: [
        'Quantitative aptitude (percentages, averages, ratios)',
        'Logical reasoning (puzzles, patterns)',
        'Verbal communication',
        'Time management practice',
        'Mock aptitude test',
        'Review weak areas',
        'Confidence building exercises'
      ]
    },
    {
      round: 2,
      title: 'DSA + Core CS',
      items: [
        'Master array and string algorithms',
        'Binary search and sorting optimizations',
        'Linked list and tree traversals',
        'Graph algorithms (BFS/DFS)',
        'Dynamic programming fundamentals',
        'System design basics (scalability)',
        'Database indexing and query optimization'
      ]
    },
    {
      round: 3,
      title: 'Tech Interview (Projects + Stack)',
      items: [
        'Showcase portfolio projects',
        'Practice live coding sessions',
        'Deep dive into tech stack',
        'API design and REST principles',
        'Caching strategies',
        'Deployment and DevOps concepts',
        'Code review and best practices'
      ]
    },
    {
      round: 4,
      title: 'Managerial / HR',
      items: [
        'Personal introduction and story',
        'Career goals and aspirations',
        'Handling failure and learning from mistakes',
        'Teamwork and collaboration examples',
        'Leadership qualities',
        'Salary expectations and negotiations',
        'Company culture and fit assessment'
      ]
    }
  ]

  if (!isEmpty) {
    // Adapt checklist based on detected skills
    if (skillsCategories.includes('web')) {
      rounds[2].items.push('Frontend frameworks (React, Vue)')
      rounds[2].items.push('State management patterns')
    }
    if (skillsCategories.includes('data')) {
      rounds[2].items.push('Query optimization and indexing')
      rounds[2].items.push('Data modeling and normalization')
    }
    if (skillsCategories.includes('cloudDevOps')) {
      rounds[2].items.push('Containerization (Docker, K8s)')
      rounds[2].items.push('CI/CD pipeline setup')
    }
  }

  return rounds
}

export function generate7DayPlan(skillsCategories, isEmpty) {
  const basePlan = [
    {
      day: 1,
      title: 'Basics & Core CS Foundations',
      focus: 'Review fundamentals',
      tasks: [
        'Data structures basics (arrays, linked lists)',
        'Time complexity and Big O notation',
        'OS basics (processes, threads, memory)',
        'DBMS fundamentals (ACID, normalization)',
        '2–3 easy coding problems'
      ]
    },
    {
      day: 2,
      title: 'Core CS Deep Dive',
      focus: 'Strengthen fundamentals',
      tasks: [
        'OOP principles and design patterns',
        'Networking basics (TCP/IP, DNS)',
        'Database queries and indexing',
        'Revision of Day 1 concepts',
        '3–4 medium coding problems'
      ]
    },
    {
      day: 3,
      title: 'DSA Practice – Part 1',
      focus: 'Arrays and strings',
      tasks: [
        'String manipulation (reverse, palindrome)',
        'Array problems (rotation, rearrangement)',
        'Two-pointer techniques',
        'Sorting and searching optimization',
        '4–5 medium to hard problems'
      ]
    },
    {
      day: 4,
      title: 'DSA Practice – Part 2',
      focus: 'Trees and graphs',
      tasks: [
        'Binary tree traversals (DFS, BFS)',
        'Graph problems (shortest path, cycle detection)',
        'Backtracking and recursion',
        'Dynamic programming intro',
        '3–4 hard problems'
      ]
    },
    {
      day: 5,
      title: 'Project & Resume Alignment',
      focus: 'Showcase and prepare',
      tasks: [
        'Document 2–3 key projects',
        'Align tech stack with JD requirements',
        'Prepare project demo script',
        'Highlight achievements and impact',
        'Mock interview Q&A practice'
      ]
    },
    {
      day: 6,
      title: 'Mock Interviews & LLD',
      focus: 'System design and soft skills',
      tasks: [
        'Low-level design practice',
        'High-level system design intro',
        'Mock HR questions',
        'Video recording practice (communication)',
        'Confidence building'
      ]
    },
    {
      day: 7,
      title: 'Revision & Weak Areas',
      focus: 'Final review',
      tasks: [
        'Review weak areas identified during practice',
        'Final mock interview (full round simulation)',
        'Confidence check and motivation',
        'Resume polish and final checks',
        'Rest and mental preparation'
      ]
    }
  ]

  // Adapt plan based on detected skills
  if (!isEmpty) {
    if (skillsCategories.includes('web')) {
      basePlan[4].tasks.push('Frontend framework project showcase')
      basePlan[5].tasks.push('State management design discussions')
    }
    if (skillsCategories.includes('data')) {
      basePlan[1].tasks.push('Advanced SQL queries practice')
      basePlan[4].tasks.push('Database design from JD insights')
    }
    if (skillsCategories.includes('cloudDevOps')) {
      basePlan[5].tasks.push('DevOps tools and CI/CD discussion')
      basePlan[6].tasks.push('Infrastructure design review')
    }
    if (skillsCategories.includes('testing')) {
      basePlan[4].tasks.push('Automated testing framework discussion')
      basePlan[5].tasks.push('QA and testing strategy conversation')
    }
  }

  return basePlan
}

export function generateInterviewQuestions(skillsCategories) {
  const baseQuestions = [
    'Walk us through your approach to problem-solving.',
    'Tell us about a challenging project and how you overcame it.',
    'How do you stay updated with the latest tech trends?',
    'Describe your experience with teamwork and collaboration.',
    'What are your strengths and areas of improvement?',
    'Why are you interested in this role and company?',
    'How do you handle tight deadlines and pressure?',
    'What is your learning style and how do you approach new technologies?',
    'Describe a situation where you had to debug complex code.',
    'What is your ideal work environment?'
  ]

  const skillSpecificQuestions = []

  if (skillsCategories.includes('coreCS')) {
    skillSpecificQuestions.push('Explain the difference between array and linked list. When would you use each?')
    skillSpecificQuestions.push('How would you optimize a search in a sorted array?')
    skillSpecificQuestions.push('What are the benefits of indexing in databases?')
  }
  if (skillsCategories.includes('languages')) {
    skillSpecificQuestions.push('Compare and contrast two programming languages you are proficient in.')
    skillSpecificQuestions.push('Explain garbage collection and memory management in your preferred language.')
    skillSpecificQuestions.push('What are the different types of inheritance?')
  }
  if (skillsCategories.includes('web')) {
    skillSpecificQuestions.push('Explain different state management options in modern web development.')
    skillSpecificQuestions.push('How does the virtual DOM improve performance in React?')
    skillSpecificQuestions.push('What are the differences between REST and GraphQL APIs?')
  }
  if (skillsCategories.includes('data')) {
    skillSpecificQuestions.push('Explain ACID properties and their importance.')
    skillSpecificQuestions.push('What is database normalization and why is it important?')
    skillSpecificQuestions.push('How would you optimize a slow-running SQL query?')
  }
  if (skillsCategories.includes('cloudDevOps')) {
    skillSpecificQuestions.push('Explain the benefits of containerization and orchestration.')
    skillSpecificQuestions.push('What is the CI/CD pipeline and how does it improve development?')
    skillSpecificQuestions.push('How would you ensure high availability and disaster recovery?')
  }
  if (skillsCategories.includes('testing')) {
    skillSpecificQuestions.push('Explain the difference between unit testing and integration testing.')
    skillSpecificQuestions.push('How would you structure an automated testing strategy?')
    skillSpecificQuestions.push('What are the challenges of testing microservices?')
  }

  // Return top 10 questions: base + skill-specific
  const allQuestions = [...baseQuestions, ...skillSpecificQuestions]
  return allQuestions.slice(0, 10)
}
