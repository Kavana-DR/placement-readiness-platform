# Placement Readiness Platform - A to Z Project Guide

## 1) What this project is
Placement Readiness Platform is a frontend-first SaaS-style web app that helps a student prepare for placements by combining:
- Resume parsing and resume building
- Job Description (JD) analysis
- ATS/readiness scoring
- Practice and assessment tracking
- Learning resource recommendations
- Job/internship recommendations and application tracking

This app is built as a single React + Vite application with client-side routing and localStorage persistence.

---

## 2) Primary objective
The product objective is to answer one question:
"How ready am I for placements right now, and what should I do next?"

The system supports this by continuously updating dashboard metrics from user actions:
- Parse resume -> updates ATS score and extracted skills
- Complete practice/assessments -> updates readiness
- Save/apply jobs -> updates applications and recommendations
- Edit profile -> updates completeness and score context

---

## 3) Tech stack
- React 18
- Vite
- React Router DOM
- Recharts (charts/radar)
- Lucide React (icons)
- pdfjs-dist + mammoth (resume text extraction helpers)
- Tailwind available, but major dashboard UI now uses custom design-system CSS variables

No backend is required for current operation.

---

## 4) High-level architecture
There are two major UI domains:
- Main app (`src/`)
- Resume builder sub-app (`resume-builder/src/`) mounted under `/resume-builder`

The app is data-driven through:
- localStorage as persistence
- custom browser event `prp:data-updated` for reactive cross-page updates
- shared hooks for derived metrics and synchronization

---

## 5) Route map
Main routes (see `src/App.jsx`):
- `/` -> LandingPage
- `/dashboard` -> DashboardHome
- `/dashboard/practice` -> PracticePage
- `/dashboard/assessments` -> AssessmentsPage
- `/dashboard/resources` -> ResourcesPage
- `/dashboard/profile` -> ProfilePage
- `/analyze` -> AnalyzePage
- `/history` -> HistoryPage
- `/applications` -> ApplicationsPage
- `/results/:id` -> ResultsPage
- `/resume-builder/*` -> Resume builder pages

Support/proof routes:
- `/prp/07-test`
- `/prp/08-ship`
- `/prp/proof`

---

## 6) UI system (important)
The app now uses a reusable SaaS design system:
- Tokens: colors, spacing, typography (`src/design-system/tokens/*`)
- Components: Button, Card, SectionCard, StatCard, ProgressCard
- Layout: PageContainer, PageHeader, DashboardLayout shell

Dark mode is implemented using CSS variables and persisted in localStorage:
- key: `kpb-theme`
- hook: `src/hooks/useTheme.js`
- toggle component: `src/components/ThemeToggleButton.jsx`

---

## 7) Core data flow
1. User performs an action (parse resume, complete assessment, save profile, apply job).
2. A utility writes normalized data to localStorage.
3. Utility dispatches `prp:data-updated` event with scope/key metadata.
4. Hooks listening to storage + custom event refresh local state.
5. Dashboard and dependent pages re-render with updated metrics.

This pattern removes manual refresh dependency.

---

## 8) Storage keys (single source of truth)
Main app keys:
- `placement_history` -> JD analyses history
- `resumeBuilderData` -> resume form/profile data
- `resumeBuilderParsedData` -> parsed resume structured output
- `prp_practice_progress` -> practice progress stats
- `prp_assessments` -> assessments state and attempts
- `prp_resource_progress` -> resource completion progress
- `internshipApplications` -> applied jobs/internships
- `savedJobs` -> saved job entries
- `kpb-theme` -> `light` or `dark`

Resume-builder specific support keys also exist for proof/checklist features.

---

## 9) Key modules and responsibilities
`src/hooks/useDashboardMetrics.js`
- Aggregates ATS, readiness, skills count, applications count, practice stats.
- Subscribes to storage + app update event.

`src/hooks/useAssessmentData.js`
- Loads, summarizes, and updates assessment progress.

`src/hooks/useProfileData.js`
- Combines resume form data with dashboard stats for profile page.

`src/hooks/useJobRecommendations.js`
- Computes job recommendations and reacts to skill/profile/application changes.

`src/utils/historyManager.js`
- Stores and manages JD analysis entries.

`src/utils/practiceProgress.js`
- Stores and updates practice completion logic.

`src/utils/assessmentData.js`
- Assessment catalog/state and summary logic.

`src/utils/resourceProgress.js`
- Resource catalog and progress persistence.

`src/utils/jobMatcher.js`
- Match score calculations between user skills and job requirements.

`src/utils/internshipRecommendations.js`
- Application save/retrieve and related storage helpers.

`resume-builder/src/utils/resumeParsing.js`
- Resume parsing pipeline and extraction heuristics.

---

## 10) ATS + readiness logic (current model)
- ATS score is derived from resume quality and extracted signals.
- Readiness score combines multiple inputs:
  - ATS signal
  - practice completion
  - assessment score/accuracy
  - application activity
- Job matching score is percentage overlap between user skills and required job skills.

Formula example used in matcher:
- `match = (matchedSkills / requiredSkills) * 100`

---

## 11) Main product pages (what each page does)
Dashboard:
- Single view of readiness, ATS, skills, applications, practice, radar chart, and job recommendations.

Analyze JD:
- Validates JD input, extracts skill requirements, generates checklist/plan/questions, stores analysis history.

History:
- Lists past analyses, supports view/delete/clear.

Applications:
- Lists all applied jobs tracked from recommendation actions.

Practice:
- Topic-wise progress, target tracking, completion actions.

Assessments:
- Mock test tracker with status, score, accuracy, weak topics, and external test links.

Resources:
- Recommended learning resources with filters, search, category, and completion progress.

Profile:
- Editable user info, completeness score, stats summary, ATS history.

Resume Builder:
- Parse uploaded resume and apply parsed data to builder form; preview and print/export workflow.

---

## 12) How to run locally
From project root:
- `npm install`
- `npm run dev`

Build:
- `npm run build`

Preview production build:
- `npm run preview`

---

## 13) Known constraints
- No backend: all persistence is localStorage and browser-only.
- Data is device/browser-specific unless exported manually.
- Some legacy pages/utilities still contain older lint issues unrelated to core runtime flow.

---

## 14) If you return after 5 years (quick restart checklist)
1. Read this file fully once.
2. Open `src/App.jsx` to understand routes.
3. Open `src/hooks/useDashboardMetrics.js` for central data logic.
4. Open `src/utils/*` for storage model and scoring helpers.
5. Run app and test this flow:
   - Parse resume
   - Analyze JD
   - Complete one practice topic
   - Complete one assessment
   - Save one job
6. Confirm dashboard updates without refresh.

---

## 15) Safe extension plan
When adding new features:
- Keep localStorage keys explicit and version-friendly.
- Dispatch `prp:data-updated` after every write.
- Add a dedicated hook for derived state instead of heavy component logic.
- Reuse design-system components for visual consistency.
- Avoid hardcoded colors; use CSS variables.

---

## 16) Suggested next cleanup tasks
- Replace template README with project-specific README using this guide.
- Add one architecture diagram (route map + data flow + storage).
- Add a migration/version strategy for localStorage schemas.
- Normalize remaining legacy pages to design-system-only styling.

---

## 17) One-line project summary (resume/interview)
"Built a React-based placement readiness platform with resume parsing, JD analysis, ATS/readiness scoring, job matching, and reactive dashboard updates using a localStorage + event-driven architecture."
