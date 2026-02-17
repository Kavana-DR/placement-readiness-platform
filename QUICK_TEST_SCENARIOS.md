# Company Intel + Round Mapping - Quick Test Scenarios

## How to Test

1. Go to `/analyze` (Analyze Job Description)
2. Fill in Company Name, Role
3. Paste JD text from scenarios below
4. Click "Analyze"
5. On `/results`, check the new tabs:
   - **🏢 Company Intel** - See company size, industry, hiring focus
   - **📌 Interview Rounds** - See dynamic interview flow

---

## Test Scenario 1: ENTERPRISE + DSA ✅ (5 Rounds)

### Input
**Company Name:** Amazon
**Role:** Senior Software Engineer
**JD Text (copy-paste below):**

```
Senior Software Engineer – Amazon Web Services (AWS)

We are looking for a Senior Software Engineer to join the Amazon Web Services (AWS) team.
You will work on building scalable distributed systems serving millions of customers worldwide.

Required Skills:
- Proficiency in Data Structures and Algorithms (DSA) - This is fundamental
- Strong problem-solving abilities using DSA patterns
- Knowledge of programming languages: Java, Python, C++, or Go
- Understanding of Core Computer Science fundamentals:
  * Operating Systems (processes, memory management, scheduling)
  * Database Management Systems (DBMS) - SQL and NoSQL
  * Networking basics (TCP/IP, DNS, HTTP)
  * System Design and Architecture

Experience Required:
- 5+ years of software development experience
- Demonstrated expertise in designing and building large-scale distributed systems
- Experience with algorithm optimization and complexity analysis
- Strong understanding of microservices and cloud-native architecture

Interview Process:
- Online Assessment: 3-4 DSA problems (60-90 minutes)
- Technical Round 1: DSA + CS fundamentals discussion
- Technical Round 2: System design and architecture
- Technical Round 3: Deep dive into past projects and technical decisions
- HR Round: Behavioral and salary negotiation

Nice to Have:
- AWS services knowledge (EC2, S3, Lambda, DynamoDB)
- Experience with containerization (Docker, Kubernetes)
- Open source contributions
```

### Expected Output

**🏢 Company Intel Tab:**
- ✅ Company: "Amazon"
- ✅ Size: **Enterprise** (purple badge)
- ✅ Industry: "Cloud & E-commerce"
- ✅ Employee Range: "2,000+ employees"
- ✅ Hiring Focus: **"Structured DSA + Core Fundamentals"**
- ✅ Badge: "✓ Known Company" (green)
- ✅ Interview Complexity: "Expect rigorous technical assessments..."

**📌 Interview Rounds Tab (5 Rounds):**
1. **Round 1: Online Assessment** (💻)
   - Details: 60–90 min, 3-4 DSA, Arrays/Strings/Sorting
   - Why: "Filters for baseline DSA at scale"

2. **Round 2: Technical Round 1: DSA + Core CS** (🧠)
   - Details: 45–60 min, 2-3 DSA with explanation, Core CS
   - Why: "Deep dive into algorithmic thinking..."

3. **Round 3: Technical Round 2: Advanced DSA + System Design** (🏗️)
   - Details: 60 min, Hard DSA or Medium System Design
   - Why: "System design reveals ability to architect..."

4. **Round 4: Technical Round 3: Projects & Deep Dive** (🎬)
   - Details: 45–60 min, Project walkthrough, decisions
   - Why: "Demonstrates deep expertise..."

5. **Round 5: Managerial / HR Round** (👥)
   - Details: 30–45 min, Behavioral, salary negotiation
   - Why: "Cultural fit and long-term growth"

---

## Test Scenario 2: MID-SIZE + WEB/NODE ✅ (4 Rounds)

### Input
**Company Name:** Infosys
**Role:** Full Stack Developer
**JD Text (copy-paste below):**

```
Full Stack Developer (Mid-Level) – Infosys Consulting Division

Infosys is seeking an experienced Full Stack Developer to join our cloud services division.
You will build and maintain web applications serving enterprise clients.

Skills Required:
- Frontend: React.js, HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express.js
- Database: SQL (PostgreSQL) and NoSQL (MongoDB)
- API Design: RESTful architecture
- Version Control: Git

Technical Knowledge:
- Understanding of DBMS fundamentals and database design
- Basic knowledge of operating systems and networking
- Familiarity with system design concepts
- Algorithms and problem-solving ability

Experience:
- 3-5 years of web development experience
- Building end-to-end full-stack applications
- Working in agile teams
- Cloud platforms experience (AWS or Azure)

Interview Process:
- Coding Challenge: 2-3 problems (45 min)
- Technical Round: System architecture and tech decisions
- Project Discussion: Your significant projects
- Culture Fit: Team collaboration and growth

Nice to Have:
- Docker and Kubernetes experience
- Microservices architecture
- CI/CD pipelines
```

### Expected Output

**🏢 Company Intel Tab:**
- ✅ Company: "Infosys"
- ✅ Size: **Enterprise** (purple badge) - Known company
- ✅ Industry: "IT Services"
- ✅ Employee Range: "2,000+ employees"
- ✅ Hiring Focus: **"Structured DSA + Core Fundamentals"**
- ✅ Badge: "✓ Known Company"

**📌 Interview Rounds Tab (5 Rounds - Enterprise Pattern):**
1. Online Assessment (DSA + Aptitude)
2. Technical Round 1 (DSA + Core CS)
3. Technical Round 2 (Advanced DSA + System Design)
4. Technical Round 3 (Projects & Deep Dive)
5. HR / Managerial Round

---

## Test Scenario 3: STARTUP + PRACTICAL ✅ (3 Rounds)

### Input
**Company Name:** TechVenture
**Role:** Full Stack Developer
**JD Text (copy-paste below):**

```
Full Stack Developer – TechVenture (Series A Startup)

TechVenture is a Series A fintech startup disrupting digital payments.
We are looking for a Full Stack Developer who can rapidly build and ship features.

Skills:
- React.js for frontend
- Node.js and Express for backend
- MongoDB for database
- Basic DevOps (Docker understanding)

What We Value:
- Ability to ship working features quickly
- End-to-end ownership (frontend to backend to deployment)
- Problem-solving and adaptability
- Learning mindset and curiosity
- Strong communication

Responsibilities:
- Build features from requirements to production
- Own the full feature lifecycle
- Mentor junior developers
- Help scale the platform as we grow
- Work closely with product team

Interview (2-3 rounds, 1 week):
- Practical Coding: Build a real feature (45 min)
- System Discussion: How you'd scale your code
- Culture & Growth Fit: Why you? Why us?

Benefits:
- Flexible work environment
- Equity and upside potential
- Learning opportunities
```

### Expected Output

**🏢 Company Intel Tab:**
- ✅ Company: "TechVenture"
- ✅ Size: **Startup** (emerald badge)
- ✅ Industry: "Fintech & Payments" (inferred from keywords)
- ✅ Employee Range: "<200 employees"
- ✅ Hiring Focus: **"Practical Problem Solving + Stack Depth"**
- ✅ Badge: "Demo Mode: Company intel generated heuristically"
- ✅ Interview Complexity: "Fast-paced process... shipping ability matters"

**📌 Interview Rounds Tab (3 Rounds):**
1. **Round 1: Practical Coding** (💻)
   - Details: 45–60 min, Build feature with React/Node
   - Why: "Validates you can ship working code..."

2. **Round 2: System Architecture Discussion** (🧠)
   - Details: 45 min, Scale, database, caching, deployment
   - Why: "Checks if you can explain approach..."

3. **Round 3: Product & Culture Fit** (👥)
   - Details: 30–45 min, Product thinking, ownership
   - Why: "Founder mentality and adaptability..."

---

## Test Scenario 4: UNKNOWN COMPANY (3 Rounds - Fallback)

### Input
**Company Name:** RandomTechCorp
**Role:** Backend Engineer
**JD Text (copy-paste below):**

```
Backend Engineer – RandomTechCorp

Join RandomTechCorp as a Backend Engineer.
We build software solutions.

Requirements:
- Good programming skills
- Problem solving ability
- Teamwork and communication
```

### Expected Output

**🏢 Company Intel Tab:**
- ✅ Company: "RandomTechCorp"
- ✅ Size: **Startup** (default)
- ✅ Industry: "Technology Services" (default)
- ✅ Employee Range: "<200 employees"
- ✅ Hiring Focus: **"Practical Problem Solving + Stack Depth"**
- ✅ Badge: "Demo Mode: Company intel generated heuristically"

**📌 Interview Rounds Tab (3 Rounds - Fallback):**
1. **Round 1: Technical Screening** (💻)
2. **Round 2: Technical Interview** (🧠)
3. **Round 3: Culture & Growth** (👥)

---

## Test Scenario 5: GOOGLE (Known Enterprise)

### Input
**Company Name:** Google
**Role:** Software Engineer
**JD Text (copy-paste below):**

```
Software Engineer – Google

Google is seeking talented software engineers to build products that impact billions of users.

Required:
- Data Structures and Algorithms expertise
- System design knowledge
- One or more programming languages: Java, Python, C++, Go
- CS fundamentals: Operating systems, databases, networking

You will solve challenging technical problems at scale.
```

### Expected Output

**🏢 Company Intel Tab:**
- ✅ Company: "Google"
- ✅ Size: **Enterprise** (purple badge)
- ✅ Industry: "Search & Cloud"
- ✅ Badge: "✓ Known Company"

**📌 Interview Rounds Tab:**
- 5 rounds following Enterprise + DSA pattern

---

## Verification Checklist

After each test, verify:

- [ ] Company Intel tab shows correct company info
- [ ] Size badge color is correct (Startup=emerald, Mid-size=blue, Enterprise=purple)
- [ ] Hiring focus matches company size
- [ ] Round count matches company size (3 for startup, 4-5 for larger)
- [ ] Round titles make sense for the company context
- [ ] Click to expand a round and verify "Why It Matters" section
- [ ] Demo mode note appears only for unknown companies
- [ ] Known company badge appears only for recognized companies
- [ ] No console errors
- [ ] Responsive on small screens

---

## Comparing Scenarios

| Aspect | Amazon (Ent. + DSA) | Infosys (Ent.) | TechVenture (Startup) |
|--------|-------------------|----------------|-----------------------|
| Rounds | 5 | 5 | 3 |
| Round 1 | Online Test | Online Test | Practical Coding |
| Focus | Rigorous, algorithmic | Structured, CS-heavy | Ship-fast, practical |
| HR Round? | Yes (Round 5) | Yes (Round 5) | Yes (Round 3) |
| System Design? | Round 3 | Round 3 | Round 2 |
| Project Discussion? | Round 4 | Round 4 | Round 2 |

---

## Common Issues & Answers

**Q: Why is Infosys showing "Enterprise"?**
A: Infosys is a known company in the system and is classified as Enterprise (2000+ employees). This is correct.

**Q: Can I change company size detection?**
A: No, the system infers from a predefined list or defaults to Startup. This prevents incorrect assumptions.

**Q: Why only 3 rounds for startup?**
A: Startups have faster, leaner hiring processes. More rounds for mid-size (4) and enterprise (5) due to additional technical depth required.

**Q: Does skills affect round count?**
A: Yes! DSA detection in Enterprise adds an extra Advanced DSA round. Web detection changes Round 2 focus for mid-size companies.

---

## Performance Notes

- All data generated client-side (no server calls)
- Company intel lookup: O(n) where n = 25 known companies (instant)
- Round generation: O(1) based on fixed rules (instant)
- Data persisted in localStorage (no latency)

---

## Build & Run Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs at: **http://localhost:5173**

---

Generate a thorough test by running through each scenario. Total estimated time: 5-10 minutes per scenario.
