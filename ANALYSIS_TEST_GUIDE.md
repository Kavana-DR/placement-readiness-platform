# Placement Readiness Platform - Analysis Logic Testing Guide

## System Deployed ✅

All analysis logic implemented and ready for testing. Dev server running at http://localhost:5174/

## How to Use

### 1. Navigate to Analyze Page
- Go to Dashboard
- Click "Analyze JD" in sidebar (or navigate to http://localhost:5174/analyze)

### 2. Fill Form
- **Company** (optional): e.g., "Google"
- **Role** (optional): e.g., "Senior Software Engineer"
- **Job Description** (required): Paste the job description text

### 3. Click "Analyze"
- System will:
  - Extract skills by keyword matching across 6 categories
  - Calculate readiness score (35 base + bonuses)
  - Generate 4-round interview checklist
  - Create 7-day personalized prep plan
  - Generate 10 skill-specific interview questions
  - Save to localStorage automatically

### 4. View Results
- Results displayed with tabs: Skills, Checklist, 7-Day Plan, Interview Qs
- Readiness score shown prominently

### 5. View History
- Click "History" in sidebar
- All past analyses listed with scores
- Click "View" to re-open any analysis
- Persist across browser refresh

## Test JD (Sample)

Copy and paste this into the Analyzer:

---

**Senior Full Stack Engineer**

We're looking for a talented Senior Full Stack Engineer to join our growing team. You should have deep expertise in React, Node.js, and system design.

**Requirements:**
- 5+ years with Java, Python, or JavaScript
- Strong DSA and algorithm fundamentals
- Experience with PostgreSQL, MongoDB, and Redis
- Docker and Kubernetes proficiency for deployment
- REST API design and GraphQL experience
- AWS or Azure cloud infrastructure
- CI/CD pipeline setup (Jenkins, GitHub Actions)
- Linux command line fluency
- Strong DBMS and OS concepts

**Nice to Have:**
- System Design experience
- Microservices architecture knowledge
- Experience with Selenium or Cypress testing
- OOP and SOLID principles mastery
- Communication and mentoring skills

---

## Expected Results for Sample JD

**Skill Categories Detected:**
- Core CS: DSA, DBMS, OS, OOP, algorithms
- Languages: Java, Python, JavaScript
- Web: React, Node.js, Express, REST, GraphQL
- Data: PostgreSQL, MongoDB, Redis
- Cloud/DevOps: Docker, Kubernetes, AWS, Azure, CI/CD, Linux
- Testing: Selenium, Cypress

**Readiness Score Calculation:**
- Base: 35
- Category bonus: 6 categories × 5 = 30
- Company provided: 0 (not filled in demo)
- Role provided: 10
- JD length > 800 chars: 10
- **Total: 85**

**Generated Content:**
- 4-round checklist tailored to detected skills
- 7-day plan with React, DevOps, and SQL tasks
- 10 interview questions specific to skills detected

## localStorage Verification

1. Open Browser DevTools (F12)
2. Go to Application → Local Storage
3. URL: http://localhost:5174
4. Key: `placement_history`
5. Value: JSON array of all analyzed entries

**Each entry contains:**
```json
{
  "id": "1234567890",
  "createdAt": "2026-02-16T...",
  "company": "Google",
  "role": "Senior Full Stack Engineer",
  "jdText": "...",
  "extractedSkills": { /* categorized keywords */ },
  "checklist": [ /* 4 rounds */ ],
  "plan": [ /* 7 days */ ],
  "questions": [ /* 10 questions */ ],
  "readinessScore": 85
}
```

## Refresh Test

1. Analyze a JD (creates entry in localStorage)
2. Refresh page (F5)
3. Click "History" → entry should still be there
4. Click "View" → all analysis data intact

## Features Confirmed ✅

- [x] Skill extraction from JD text
- [x] Keyword detection across 6 categories
- [x] Readiness score calculation (0–100)
- [x] Template-based checklist generation
- [x] 7-day personalized prep plan
- [x] 10 skill-specific interview questions
- [x] localStorage persistence
- [x] History page listing all entries
- [x] Results page display with tabs
- [x] Navigation integrated into sidebar
- [x] No external APIs
- [x] Works completely offline

## Support for Different JDs

The system adapts based on detected skills:

**For React/Frontend:**
- Adds state management checklist items
- Includes frontend framework questions
- Day 5 includes frontend project showcase

**For Data Engineering:**
- Emphasizes SQL optimization
- Adds database design questions
- Includes data modeling tasks

**For DevOps:**
- Adds containerization tasks
- Includes CI/CD questions
- Container orchestration emphasis

**For General/Fresher:**
- Falls back to baseline plan
- Still generates all content
- Message: "General fresher stack" shown
