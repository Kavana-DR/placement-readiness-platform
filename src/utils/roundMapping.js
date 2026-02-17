/**
 * Round Mapping Engine
 * Generates dynamic interview round flow based on company size and detected skills
 */

export function generateRoundMapping(companySize, detectedSkills, jdText = '') {
  const dsaDetected = detectedSkills.includes('coreCS')
  const webDetected = detectedSkills.includes('web')
  const dataDetected = detectedSkills.includes('data')
  const cloudDetected = detectedSkills.includes('cloudDevOps')

  const rounds = generateBaseRounds(companySize, dsaDetected, webDetected, dataDetected, cloudDetected)

  // Add context and explanations
  return rounds.map(round => ({
    ...round,
    whyItMatters: getWhyItMatters(round.type, companySize),
    estimatedDuration: getEstimatedDuration(round.type)
  }))
}

function generateBaseRounds(companySize, dsaDetected, webDetected, dataDetected, cloudDetected) {
  if (companySize === 'Enterprise') {
    // Enterprise: Structured, comprehensive rounds
    if (dsaDetected) {
      return [
        {
          round: 1,
          title: 'Online Assessment',
          type: 'online-test',
          details: [
            '60–90 minutes',
            '3-4 DSA problems (Easy to Hard)',
            'Focus: Arrays, Strings, Sorting, Searching'
          ]
        },
        {
          round: 2,
          title: 'Technical Round 1: DSA + Core CS',
          type: 'technical-dsa',
          details: [
            '45–60 minutes',
            '2-3 DSA problems with live explanation',
            'Core CS fundamentals (OS, DBMS, Networks)',
            'Optimization and complexity analysis'
          ]
        },
        {
          round: 3,
          title: 'Technical Round 2: Advanced DSA + System Design',
          type: 'technical-advanced',
          details: [
            '60 minutes',
            '1-2 Hard DSA or Medium System Design',
            'Scalability, distributed systems concepts',
            'Database design and optimization'
          ]
        },
        {
          round: 4,
          title: 'Technical Round 3: Projects & Deep Dive',
          type: 'technical-projects',
          details: [
            '45–60 minutes',
            'Discuss significant projects in detail',
            'Architecture decisions and trade-offs',
            'Tech stack justification'
          ]
        },
        {
          round: 5,
          title: 'Managerial / HR Round',
          type: 'hr-round',
          details: [
            '30–45 minutes',
            'Behavioral: Teamwork, conflict resolution, growth mindset',
            'Salary negotiation',
            'Culture fit and long-term vision'
          ]
        }
      ]
    }

    // Enterprise with web/data focus
    return [
      {
        round: 1,
        title: 'Online Test: Core Coding',
        type: 'online-test',
        details: [
          '60–90 minutes',
          '3-4 DSA problems (focus on your stack)',
          webDetected ? 'May include optimization challenges' : 'General DSA focus'
        ]
      },
      {
        round: 2,
        title: 'Technical: Web Stack + DSA',
        type: 'technical-dsa',
        details: [
          '60 minutes',
          webDetected ? 'React/Node architecture questions' : 'Core DSA',
          'API design, database queries',
          'Performance optimization'
        ]
      },
      {
        round: 3,
        title: 'System Design Round',
        type: 'technical-advanced',
        details: [
          '60 minutes',
          'Design scalable system (e.g., URL shortener, cache)',
          'Database selection and trade-offs',
          'Caching, load balancing strategies'
        ]
      },
      {
        round: 4,
        title: 'Projects & Tech Deep Dive',
        type: 'technical-projects',
        details: [
          '45–60 minutes',
          'Walk through complex projects',
          cloudDetected ? 'DevOps and deployment experience' : 'Architecture and design patterns'
        ]
      },
      {
        round: 5,
        title: 'HR / Managerial',
        type: 'hr-round',
        details: [
          '30–45 minutes',
          'Leadership and growth potential',
          'Cultural alignment'
        ]
      }
    ]
  }

  if (companySize === 'Mid-size') {
    // Mid-size: Balanced rounds
    if (dsaDetected) {
      return [
        {
          round: 1,
          title: 'Coding Round: DSA Fundamentals',
          type: 'online-test',
          details: [
            '45–60 minutes',
            '2-3 DSA problems (Easy to Medium)',
            'Focus on clarity and optimization'
          ]
        },
        {
          round: 2,
          title: 'Technical: System & Stack Knowledge',
          type: 'technical-dsa',
          details: [
            '60 minutes',
            webDetected ? 'Your web stack + system concepts' : 'Core CS + practical problem-solving',
            'Real-world scenario problem-solving'
          ]
        },
        {
          round: 3,
          title: 'Project & Growth Potential',
          type: 'technical-projects',
          details: [
            '45 minutes',
            'Significant projects you\'ve built',
            'Learning ability and tech curiosity'
          ]
        },
        {
          round: 4,
          title: 'Culture Fit & HR',
          type: 'hr-round',
          details: [
            '30 minutes',
            'Team collaboration',
            'Alignment with company goals'
          ]
        }
      ]
    }

    // Mid-size with web focus
    return [
      {
        round: 1,
        title: 'Practical Coding Challenge',
        type: 'online-test',
        details: [
          '45–60 minutes',
          webDetected ? 'Real-world feature implementation in your stack' : 'DSA coding problems',
          'Testing and edge case handling'
        ]
      },
      {
        round: 2,
        title: 'Technical Discussion',
        type: 'technical-dsa',
        details: [
          '60 minutes',
          webDetected ? 'Architecture of your projects' : 'System design basics',
          'Technology decisions and trade-offs'
        ]
      },
      {
        round: 3,
        title: 'Product & Growth Discussion',
        type: 'technical-projects',
        details: [
          '45 minutes',
          'Impact of features you\'ve shipped',
          'Product thinking and user perspective'
        ]
      },
      {
        round: 4,
        title: 'Team Fit & Expectations',
        type: 'hr-round',
        details: [
          '30 minutes',
          'Working style and collaboration',
          'Growth opportunities'
        ]
      }
    ]
  }

  // Startup (default)
  if (webDetected) {
    return [
      {
        round: 1,
        title: 'Practical Coding',
        type: 'online-test',
        details: [
          '45–60 minutes',
          'Build a feature with your stack (React, Node, etc.)',
          'From requirements to working code'
        ]
      },
      {
        round: 2,
        title: 'System Architecture Discussion',
        type: 'technical-dsa',
        details: [
          '45 minutes',
          'How would you scale this feature?',
          'Database, caching, deployment decisions'
        ]
      },
      {
        round: 3,
        title: 'Product & Culture Fit',
        type: 'hr-round',
        details: [
          '30–45 minutes',
          'Your product thinking and initiative',
          'Team collaboration and ownership mindset'
        ]
      }
    ]
  }

  // Startup with DSA focus
  if (dsaDetected) {
    return [
      {
        round: 1,
        title: 'Practical Problem Solving',
        type: 'online-test',
        details: [
          '45–60 minutes',
          '1-2 DSA problems (Medium difficulty)',
          'Optimized solution + code quality'
        ]
      },
      {
        round: 2,
        title: 'System & Product Discussion',
        type: 'technical-dsa',
        details: [
          '45 minutes',
          'How to apply learnings to real products',
          'Quick decision-making on tech stack'
        ]
      },
      {
        round: 3,
        title: 'Culture Fit & Growth',
        type: 'hr-round',
        details: [
          '30 minutes',
          'Startup mindset and adaptability',
          'Learning and self-improvement'
        ]
      }
    ]
  }

  // Fallback
  return [
    {
      round: 1,
      title: 'Technical Screening',
      type: 'online-test',
      details: [
        '45–60 minutes',
        'Coding or system knowledge assessment',
        'Problem-solving approach'
      ]
    },
    {
      round: 2,
      title: 'Technical Interview',
      type: 'technical-dsa',
      details: [
        '45–60 minutes',
        'Deep dive into technical knowledge',
        'Architecture and design decisions'
      ]
    },
    {
      round: 3,
      title: 'Culture & Growth',
      type: 'hr-round',
      details: [
        '30 minutes',
        'Team fit and future growth',
        'Expectations alignment'
      ]
    }
  ]
}

function getWhyItMatters(roundType, companySize) {
  const explanations = {
    'online-test': {
      Enterprise: '🔍 Filters for baseline DSA and problem-solving ability at scale. Many candidates drop here.',
      'Mid-size': '📋 Quick assessment of coding fundamentals. Ensures you can code cleanly under pressure.',
      Startup: '⚡ Validates you can ship working code quickly. Practical ability matters most.'
    },
    'technical-dsa': {
      Enterprise: '🧠 Deep dive into algorithmic thinking and CS fundamentals. Shows if you\'ll scale with complexity.',
      'Mid-size': '💡 Evaluates how well you apply concepts to real problems. Communication is key.',
      Startup: '🎯 Checks if you can explain your approach and adapt solutions quickly.'
    },
    'technical-advanced': {
      Enterprise: '🏗️ System design reveals your ability to architect for scale, reliability, and maintainability.',
      'Mid-size': 'Often skipped; if included, tests scalability thinking.',
      Startup: 'Rarely included; focus stays on practical product impact.'
    },
    'technical-projects': {
      Enterprise: '🎬 Demonstrates deep expertise, architectural decisions, and impact on real systems.',
      'Mid-size': '📊 Shows what you\'ve actually built and learned. Growth trajectory matters.',
      Startup: '🚀 Your portfolio and shipped features are your proof of ability.'
    },
    'hr-round': {
      Enterprise: '👥 Cultural fit, leadership potential, and long-term growth. Compensation negotiation.',
      'Mid-size': '🤝 Team dynamics, collaboration style, and alignment with company mission.',
      Startup: '⭐ Founder mentality, adaptability, and intrinsic motivation matter most.'
    }
  }

  return explanations[roundType]?.[companySize] || 'Essential round in the interview process.'
}

function getEstimatedDuration(roundType) {
  const durations = {
    'online-test': '45–90 minutes',
    'technical-dsa': '45–60 minutes',
    'technical-advanced': '60 minutes',
    'technical-projects': '45–60 minutes',
    'hr-round': '30–45 minutes'
  }
  return durations[roundType] || '30–60 minutes'
}
