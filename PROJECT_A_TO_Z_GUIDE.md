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
This project uses a frontend-focused stack chosen to keep development fast, the UI responsive, and the product easy to demo without backend deployment complexity.

- React 18
  - Used to build the full UI as reusable components.
  - Why it is used: React makes it easier to split the platform into pages, cards, hooks, and utilities while keeping state-driven updates predictable. It is a strong fit for dashboard-heavy products where many sections update from shared data.

- React DOM
  - Used to mount and run the React application in the browser.
  - Why it is used: It is the standard runtime bridge between React components and the actual DOM rendered to users.

- Vite
  - Used as the development server and build tool.
  - Why it is used: Vite gives very fast startup and hot reload, which is useful when iterating on many UI pages, charts, and form-driven workflows. It also keeps production builds simple with minimal configuration.

- React Router DOM
  - Used for client-side routing across the landing page, dashboard pages, analysis flow, history, applications, and the embedded resume builder.
  - Why it is used: The platform behaves like a multi-page SaaS product, but it is still delivered as one single-page application. React Router provides that app-like navigation without page reloads.

- Recharts
  - Used for visual analytics such as readiness charts and radar/summary visualizations.
  - Why it is used: Placement readiness is easier to understand when users can see progress visually instead of only reading raw numbers. Recharts integrates cleanly with React and is good for dashboard-style data views.

- Lucide React
  - Used for icons across actions, stats, navigation, and UI feedback.
  - Why it is used: It provides a clean and consistent icon set that keeps the interface modern without needing custom SVG management for every icon.

- pdfjs-dist
  - Used to extract readable text from uploaded PDF resumes.
  - Why it is used: Most student resumes are shared as PDFs. This library enables the resume parsing flow to work directly in the browser without a backend parsing service.

- Mammoth
  - Used to extract content from DOCX resume files.
  - Why it is used: Some students maintain resumes in Word format instead of PDF. Mammoth expands file compatibility so the parser supports more real-world upload cases.

- localStorage
  - Used as the main persistence layer for resume data, job history, progress tracking, theme state, and dashboard inputs.
  - Why it is used: The project is intentionally backend-free in its current form. localStorage keeps the application functional, demo-ready, and easy to run on any machine without databases or APIs.

- Custom event-driven sync (`prp:data-updated`)
  - Used to notify pages and hooks when stored data changes.
  - Why it is used: Since multiple pages depend on the same browser-stored data, this event removes the need for manual refresh and keeps the dashboard reactive after actions like resume parsing, assessment completion, or job saves.

- Custom design system with CSS variables
  - Used for tokens, reusable cards, layout shells, spacing, typography, and theme handling.
  - Why it is used: A custom design system gives stronger consistency across the main dashboard than page-level styling alone. CSS variables also make dark mode and future theming easier to maintain.

- Tailwind CSS + PostCSS + Autoprefixer
  - Tailwind is available in the project, while PostCSS and Autoprefixer support the styling pipeline.
  - Why they are used: Tailwind helps where utility-first styling is helpful, but the project has intentionally evolved toward a reusable design-system approach for the main product UI. PostCSS and Autoprefixer help maintain browser-friendly CSS output.

- ESLint
  - Used for code quality checks during development.
  - Why it is used: The project contains multiple pages, hooks, and utility modules, so linting helps catch mistakes early and keeps the codebase maintainable as features grow.

No backend is required for current operation. That choice keeps setup simple, but it also means data is local to the browser unless a future backend/export workflow is added.

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

## 11) Special features
These are the standout capabilities that make the project more than a simple dashboard UI:

- Resume parsing from PDF and DOCX
  - Users can upload an existing resume and extract structured text/data directly in the browser.
  - This reduces manual re-entry and makes the resume builder and ATS flow more practical.

- Resume builder as a built-in sub-application
  - The project includes a dedicated resume builder mounted inside the main platform instead of treating resume editing as a separate product.
  - This creates a stronger end-to-end workflow: build resume -> improve score -> analyze fit -> track readiness.

- ATS/readiness scoring pipeline
  - The app does not only store data; it converts user activity into readiness signals.
  - This makes the platform feel advisory, not just informational, because it answers "how ready am I now?"

- JD analysis and skill extraction
  - Users can paste a job description and get skills, action items, and preparation guidance from it.
  - This helps students translate a vague job post into a concrete preparation plan.

- Skill-based job/internship recommendations
  - The recommendation logic compares user skills with opportunity requirements and estimates relevance.
  - This gives users direction on where to apply instead of browsing opportunities blindly.

- Reactive dashboard updates without refresh
  - When users complete actions like parsing a resume, saving a profile, finishing practice, or applying to a role, the dashboard updates automatically.
  - This is one of the strongest architectural features in the project because it improves the product experience across pages.

- Practice, assessments, resources, and applications in one workflow
  - The platform combines preparation, tracking, and application management in one place.
  - This is valuable because placement preparation usually gets fragmented across many tools; this project unifies them.

- Theme persistence and reusable SaaS-style UI system
  - The app supports dark mode persistence and shared UI building blocks.
  - This improves usability, consistency, and maintainability at the same time.

## 12) Main product pages (what each page does)
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

## 13) How to run locally
From project root:
- `npm install`
- `npm run dev`

Build:
- `npm run build`

Preview production build:
- `npm run preview`

---

## 14) Known constraints
- No backend: all persistence is localStorage and browser-only.
- Data is device/browser-specific unless exported manually.
- Some legacy pages/utilities still contain older lint issues unrelated to core runtime flow.

---

## 15) If you return after 5 years (quick restart checklist)
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

## 16) Safe extension plan
When adding new features:
- Keep localStorage keys explicit and version-friendly.
- Dispatch `prp:data-updated` after every write.
- Add a dedicated hook for derived state instead of heavy component logic.
- Reuse design-system components for visual consistency.
- Avoid hardcoded colors; use CSS variables.

---

## 17) Suggested next cleanup tasks
- Replace template README with project-specific README using this guide.
- Add one architecture diagram (route map + data flow + storage).
- Add a migration/version strategy for localStorage schemas.
- Normalize remaining legacy pages to design-system-only styling.

---

## 18) One-line project summary (resume/interview)
"Built a React-based placement readiness platform with resume parsing, JD analysis, ATS/readiness scoring, job matching, and reactive dashboard updates using a localStorage + event-driven architecture."
