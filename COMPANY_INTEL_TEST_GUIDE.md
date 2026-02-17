# Company Intel + Round Mapping - Test Guide

## Overview
This document provides test scenarios to validate the Company Intel and Round Mapping features added to the Placement Readiness Platform.

---

## Feature Summary

### 1. **Company Intel Block** (/results page)
- Displays company name, industry, estimated size
- Infers hiring focus based on company size
- Shows "Typical Hiring Focus" with relevant bullet points
- Displays "Demo Mode" note for unknown companies
- New tab: **🏢 Company Intel**

### 2. **Round Mapping Engine** (/results page)
- Generates dynamic interview rounds based on:
  - Company size (Startup, Mid-size, Enterprise)
  - Detected skills (DSA, Web, Data, Cloud/DevOps)
- Shows vertical timeline with 3-5 rounds
- Each round includes:
  - Round number, title, estimated duration
  - What to expect (bulleted details)
  - "Why This Round Matters" explanation
  - Preparation tips
- New tab: **📌 Interview Rounds**

### 3. **Data Persistence**
- Company intel and round mapping data persisted in history entries
- Data survives page refresh and revisits

---

## Test Scenarios

### **Scenario 1: Enterprise Company + DSA-Heavy JD**

**Setup:**
- Company Name: `Amazon`
- Role: `Senior Software Engineer`
- JD Text (paste below):
```
We are looking for a Senior Software Engineer to join Amazon Web Services.
Strong background in Data Structures and Algorithms is essential.
Experience with system design and distributed systems.
Knowledge of Java, Python, or C++ required.
Must understand databases (SQL, MongoDB), operating systems fundamentals.
AWS services and cloud architecture experience valued.
```

**Expected Results:**

#### Company Intel:
- ✅ Company: "Amazon"
- ✅ Size: "Enterprise" (purple badge)
- ✅ Industry: "Cloud & E-commerce"
- ✅ Size Category: "2,000+ employees"
- ✅ Hiring Focus Title: "Structured DSA + Core Fundamentals"
- ✅ Focus points include DSA, Core CS, System design
- ✅ Badge: "✓ Known Company" (green)

#### Round Mapping (5 rounds):
1. **Round 1: Online Assessment** (💻)
   - 60–90 minutes, DSA + Aptitude
   - Why: "Filters for baseline DSA..."

2. **Round 2: Technical Round 1: DSA + Core CS** (🧠)
   - 45–60 minutes
   - Core CS fundamentals
   - Why: "Deep dive into algorithmic thinking..."

3. **Round 3: Technical Round 2: Advanced DSA + System Design** (🏗️)
   - 60 minutes
   - Hard DSA or Medium System Design
   - Why: "System design reveals ability to architect..."

4. **Round 4: Technical Round 3: Projects & Deep Dive** (🎬)
   - 45–60 minutes
   - Discuss significant projects
   - Why: "Demonstrates deep expertise..."

5. **Round 5: Managerial / HR Round** (👥)
   - 30–45 minutes
   - Behavioral and salary negotiation
   - Why: "Cultural fit, leadership potential..."

---

### **Scenario 2: Startup + Web/React Stack**

**Setup:**
- Company Name: `TechStartup`
- Role: `Full Stack Developer`
- JD Text (paste below):
```
We are a fast-growing fintech startup looking for a Full Stack Developer.
You will build features end-to-end using React and Node.js.
Experience with MongoDB and Redis for data caching.
Familiarity with Docker and basic DevOps helpful.
We value practical problem-solving and shipping quickly.
```

**Expected Results:**

#### Company Intel:
- ✅ Company: "TechStartup"
- ✅ Size: "Startup" (emerald badge)
- ✅ Industry: "Fintech & Payments" (inferred from keywords)
- ✅ Size Category: "<200 employees"
- ✅ Hiring Focus Title: "Practical Problem Solving + Stack Depth"
- ✅ Focus points: practical coding, stack expertise, full-stack, shipping
- ✅ Badge: "Demo Mode: Company intel generated heuristically" (amber)

#### Round Mapping (3 rounds):
1. **Round 1: Practical Coding** (💻)
   - 45–60 minutes
   - Build feature with React, Node.js
   - Why: "Validates you can ship working code quickly..."

2. **Round 2: System Architecture Discussion** (🧠)
   - 45 minutes
   - Database, caching, deployment
   - Why: "Checks if you can explain approach and adapt solutions..."

3. **Round 3: Product & Culture Fit** (👥)
   - 30–45 minutes
   - Product thinking, initiative, ownership
   - Why: "Startup mindset and adaptability..."

---

### **Scenario 3: Mid-size IT Services + Balanced Skills**

**Setup:**
- Company Name: `Infosys`
- Role: `Software Developer`
- JD Text (paste below):
```
Infosys is seeking a Software Developer for our consulting division.
Skills required: Java, SQL, good understanding of DBMS and OOP.
Some experience with Spring framework.
Exposure to AWS is a plus.
Good communication and teamwork essential.
```

**Expected Results:**

#### Company Intel:
- ✅ Company: "Infosys"
- ✅ Size: "Enterprise" (purple badge) - Known company
- ✅ Industry: "IT Services"
- ✅ Hiring Focus: "Structured DSA + Core Fundamentals"
- ✅ Badge: "✓ Known Company"

Note: Infosys is known as Enterprise in our system, so it will generate Enterprise-level rounds.

#### Round Mapping (5 rounds - Enterprise pattern):
- Follows Enterprise with DSA focus pattern

---

### **Scenario 4: Unknown Company + No Skills Detected**

**Setup:**
- Company Name: `Random Corp`
- Role: `Developer`
- JD Text:
```
We need a developer. Good communication required.
```

**Expected Results:**

#### Company Intel:
- ✅ Company: "Random Corp"
- ✅ Size: "Startup" (default for unknown)
- ✅ Industry: "Technology Services" (default)
- ✅ Size Category: "<200 employees"
- ✅ Badge: "Demo Mode: Company intel generated heuristically"

#### Round Mapping (3 rounds - Startup fallback):
1. **Round 1: Technical Screening**
2. **Round 2: Technical Interview**
3. **Round 3: Culture & Growth**

---

## Testing Checklist

### Company Intel Rendering
- [ ] Company name displays correctly
- [ ] Industry is inferred or defaults to "Technology Services"
- [ ] Size category matches company size
- [ ] Hiring focus section appears with 5 bullet points
- [ ] Complex copy displays cleanly without overflow
- [ ] "Demo Mode" note appears for unknown companies
- [ ] "Known Company" badge appears for known companies

### Round Mapping Rendering
- [ ] Correct number of rounds (3-5) based on company size
- [ ] Vertical timeline layout with connecting lines
- [ ] Round icons display with gradient colors
- [ ] Round titles and estimated durations visible
- [ ] "What to Expect" details expand when clicked
- [ ] "Why This Round Matters" explanation appears in expanded view
- [ ] Preparation tips display with 💡 icon
- [ ] Timeline summary and next steps card appears at bottom

### Round Mapping Logic
- [ ] **Enterprise + DSA**: 5 rounds (Online → DSA → Advanced → Projects → HR)
- [ ] **Enterprise + Web**: 5 rounds with Web/Stack focus in Round 2-3
- [ ] **Mid-size + DSA**: 4 rounds (Online → System → Projects → HR)
- [ ] **Mid-size + Web**: 4 rounds with practical coding focus
- [ ] **Startup + Web**: 3 rounds (Practical → Architecture → Culture)
- [ ] **Startup + DSA**: 3 rounds (Problem solving → System → Culture)
- [ ] **Unknown/Fallback**: 3 rounds (default pattern)

### Data Persistence
- [ ] Navigate away from /results and back
- [ ] Company intel data persists
- [ ] Round mapping data persists
- [ ] History page shows the entry
- [ ] Clicking "View" returns to /results with data intact

### Navigation & UX
- [ ] Tabs: Overview, Company Intel, Interview Rounds, Checklist, 7-Day Plan, Interview Qs
- [ ] Tab switching works smoothly
- [ ] No console errors
- [ ] Responsive on mobile/tablet

---

## Test Data Examples

### Copy-Paste Ready JD for Enterprise + DSA Test:
```
We are looking for a Senior Software Engineer to join Amazon Web Services.
Strong background in Data Structures and Algorithms is essential.
Experience with system design and distributed systems.
Knowledge of Java, Python, or C++ required.
Must understand databases (SQL, MongoDB), operating systems fundamentals, networking basics.
DSA Interview: 2-3 coding problems, complexity analysis required.
AWS services and cloud architecture experience valued.
```

### Copy-Paste Ready JD for Startup + Web Test:
```
We are a fast-growing fintech startup looking for a Full Stack Developer.
You will build features end-to-end using React and Node.js.
Experience with MongoDB and Redis for data caching.
Familiarity with Docker and basic DevOps helpful.
We ship fast and value practical problem-solving.
Your projects should demonstrate full-stack capabilities.
```

---

## Known Limitations & Notes

1. **No External Scraping**: Company intel is generated heuristically from known company list or keywords.
2. **Skills Detection**: Based on keyword matching in JD text (case-insensitive).
3. **Round Count**: Varies 3-5 rounds based on company size and skills detected.
4. **Demo Mode**: Unknown companies show a clear disclaimer that intel is heuristically generated.

---

## Success Criteria

✅ All test scenarios pass without errors
✅ Company intel displays correctly for known and unknown companies
✅ Round mapping dynamically changes based on company size and skills
✅ Data persists after page navigation
✅ Premium design maintained (no visual regressions)
✅ No routes changed
✅ All existing features preserved
✅ Build completes successfully with no errors
