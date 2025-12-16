# 🎓 EduRank

**EduRank** is a web-based professor and course rating platform designed for ADA University students. It allows students to anonymously review and rate courses and instructors, helping others make informed decisions when selecting classes.

---

## 📖 About the Project

### Problem
ADA University currently lacks a transparent system where students can share feedback about professors and courses before registration. While students complete course evaluations each semester, these are only accessible to instructors and administrators—leaving new students, freshmen, and exchange students without guidance when choosing courses.

### Solution
EduRank bridges this gap by providing:
- **Anonymous course and professor reviews** based on clear criteria (workload, teaching quality, grading fairness)
- **Verified access** through ADA University email authentication (@ada.edu.az)
- **Real-time rating statistics** to help students understand grading patterns and course difficulty
- **Professor feedback insights** enabling instructors to improve teaching methods
- **Administrative moderation** to maintain review quality and platform integrity

### Key Features
- 🔐 **Secure Authentication**: Login restricted to verified ADA University emails
- ⭐ **Structured Rating System**: Rate courses on workload, teaching clarity, and overall experience (1-5 scale)
- 💬 **Anonymous Reviews**: Write detailed feedback without revealing your identity
- 🔍 **Search & Filter**: Find courses by name, department, or rating
- 📊 **Analytics Dashboard**: View top-rated professors and popular courses
- 🛡️ **Content Moderation**: Admin tools to manage inappropriate or biased reviews
- ✏️ **Review Management**: Edit or delete your own reviews within 30 days

---

## 🏗️ Tech Stack

- **Frontend**: React.js, HTML, CSS
- **Backend**: Python with FastAPI *(or Java Spring Boot depending on team expertise)*
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Email-based verification (ADA domain)
- **Platform**: Web-based SaaS (accessible via any modern browser)
- **Development Model**: Modified Waterfall

---

## 👥 Team

**Team 9** — ADA University, Fall 2025

| Member             | Role & Contributions                                      |
|--------------------|-----------------------------------------------------------|
| Lala Huseynova     | Project overview, non-functional requirements, documentation |
| Zahra Shahbazli    | Functional requirements, sequence diagrams, project management |
| Maisa Babayeva     | User characteristics, project features, data analysis     |
| Nariman Mammadov   | Use cases, constraints, backend development               |

**Instructor**: Kamila Ismayilova  
**Course**: CSCI 3509 - Intro to Software Engineering

---

## 🚀 Getting Started (macOS Setup)

### Prerequisites
- macOS (Apple Silicon or Intel)
- Node.js ≥ 18
- Docker Desktop
- Homebrew

### Quick Setup

1. **Install Homebrew** (if not installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install dependencies**:
```bash
brew install node dos2unix
```

3. **Install Docker Desktop**:  
   Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) and launch the app.

4. **Clone and setup**:
```bash
git clone <YOUR_REPO_URL>
cd EduRank
npm install
```

5. **Prepare the database**:
```bash
dos2unix edurank_fixed.sql  # Critical: converts SQL to UTF-8 Unix format
docker compose up           # Start PostgreSQL in Docker
```

6. **Generate Prisma Client** (in a new terminal):
```bash
npm run db:generate
```

7. **Start the development server**:
```bash
npm run dev
```

8. **Open in browser**:
```
http://localhost:3000
```

### Useful Commands
| Command                  | Description                      |
|--------------------------|----------------------------------|
| `npm run dev`            | Start development server         |
| `npm run db:studio`      | Open Prisma Studio (DB viewer)   |
| `npm run db:generate`    | Generate Prisma client           |
| `docker compose down -v` | Reset database                   |

---

## 📊 Project Structure

```
EduRank/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── styles/          # CSS files
│   └── utils/           # Helper functions
├── edurank_fixed.sql    # Database seed file
├── docker-compose.yml   # Docker configuration
└── package.json         # Dependencies
```

---

## 📋 Use Cases

### Primary Users (Students)
- Register and login with ADA email
- Browse courses and professors
- Submit anonymous ratings and reviews
- Edit/delete own reviews (within 30 days)
- Search and filter by department, rating, workload
- Report inappropriate reviews

### Secondary Users (Professors)
- View aggregated feedback on their courses
- Identify areas for teaching improvement

### Administrative Users
- Manage course and professor database
- Moderate flagged reviews
- Analyze feedback trends
- Ensure data integrity

---

## 🔒 Security & Privacy

- ✅ All passwords encrypted before storage
- ✅ Reviews are completely anonymous
- ✅ ADA email domain authentication required
- ✅ Session timeout after 60 minutes of inactivity
- ✅ Review eligibility verified (only students who took the course can review)
- ✅ Admin moderation for inappropriate content

---


## 🐛 Troubleshooting

### Docker daemon not running
```bash
open -a Docker  # Wait for Docker to show "running" status
```

### Database connection errors
```bash
docker compose down -v
dos2unix edurank_fixed.sql
docker compose up
npm run db:generate
```

### UTF-8 encoding issues
⚠️ **Never open `edurank_fixed.sql` in TextEdit**. Always use `dos2unix` to convert the file.

---

## 📚 Documentation

- [Project Proposal](./Homework%201%202.pdf) - Initial project plan and deliverables
- [Software Requirements Specification](./Homework%202%202.pdf) - Detailed functional and non-functional requirements
- [Use Case Diagrams](./Homework%202%202.pdf) - Visual representation of system interactions

---

## 🎯 Project Goals

1. ✅ Create a user-friendly, responsive web interface
2. ✅ Ensure accurate, verified data from university users
3. ✅ Enable real-time access to reviews and ratings
4. ✅ Maintain data privacy and anonymity
5. ✅ Facilitate informed decision-making for course selection

---

## 📖 References

- Pressman, R.S. (2010). *Software Engineering: A Practitioner's Approach* (7th ed.)
- Tsui, F., Karam, O., & Bernal, B. (2018). *Essentials of Software Engineering* (4th ed.)
- [KAIST OTL Portal](https://otl.kaist.ac.kr/) - Reference platform
- [Functional vs Non-Functional Requirements](https://www.geeksforgeeks.org/software-engineering/functional-vs-non-functional-requirements/)

---
