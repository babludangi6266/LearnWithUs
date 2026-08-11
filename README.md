# 🚀 LearnWithUs — EdTech Platform & Developer Ecosystem

> **Empowering Developers, Freelancers & Small Engineering Agencies to Learn, Build & Scale.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-v4.18-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

---

## 🌟 Overview & Platform Vision

**LearnWithUs** is an enterprise-grade **EdTech Platform & Developer Ecosystem** designed to bridge the gap between structured technical education and real-world engineering productivity.

Whether you are a **student mastering backend Java & Spring Boot microservices**, an **independent freelancer looking for client contract gigs**, or a **small engineering agency calculating project scopes**, LearnWithUs provides a unified, ultra-premium workspace.

---

## 📂 Repository Architecture

This repository is structured as a **clean monorepo with two decoupled core applications**:

```
LearnWithUse_/
├── Frontend/                 # Vite + React + TypeScript + Tailwind CSS Web Application
│   ├── src/
│   │   ├── components/       # Modern UI components (CodePlayground, Navbar, MarkdownRenderer)
│   │   ├── pages/            # Page Views (HomePage, CommunityPage, NotesPage, EstimatorPage, etc.)
│   │   ├── services/         # Axios API Client & TypeScript Interfaces
│   │   ├── context/          # JWT Authentication State Context
│   │   └── App.tsx           # Application Routing System
│   ├── tailwind.config.ts    # Custom Design Tokens & Neon Shadows
│   └── package.json
│
└── LearnWithUs/              # Node.js + Express.js + MongoDB REST API Backend
    ├── controllers/          # Business Logic (notesController, communityController, etc.)
    ├── models/               # Mongoose Data Schemas (Note, CommunityItem, Student, Admin)
    ├── routes/               # API Router Definitions (/api/student, /api/admin, /api/community)
    ├── config/               # Database Connection & JWT Configuration
    ├── server.js             # Express Server Entry Point
    └── package.json
```

---

## 🚀 Key Modules & Features

### 1. ⚡ Live Interactive Code Sandbox & Execution Playground
- **Multi-Language Execution Engine**: Run and test **Java 21**, **Spring Boot 3**, **JavaScript (ES6)**, **TypeScript**, and **Python 3** code directly inside the browser.
- **Real-Time High-Tech Terminal**: Displays stdout output, compilation status, execution timing (`⚡ 12ms`), and memory allocation metrics.
- **1-Click Integration**: Available across the Notes Hub allowing developers to execute code snippets with 1 click.

### 2. 🌐 Developer Community Hub
- **💡 Tech Ideas**: Submit architectural proposals, crowdsource community upvotes, and find co-founders.
- **💼 Freelance & Agency Gigs**: Small agencies and clients post deliverables with custom budget ranges (`$1,000 - $3,500 USD`) and direct author contact buttons.
- **🚨 Incident & Outage Watch**: Track real-time tech stack vulnerabilities, ORM memory leak warnings, and emergency patches with severity badges (`Low`, `Medium`, `High`, `Critical`).

### 3. 💼 Agency Scope & Cost Estimator (`/estimator`)
- **Interactive Deliverables Calculator**: Select project type (*Fullstack App, Backend Microservices API, Frontend UI, Security Audit*) and feature modules (*OAuth2 JWT, Payments, WebSockets, 3D WebGL*).
- **Instant Live Breakdown**: Computes **Total Development Hours**, **Project Duration in Weeks**, and **Budget Range ($USD)**.
- **1-Click Gig Publishing**: Converts calculated project scopes directly into live community freelance posts.

### 4. 🛠️ Boilerplate Entity & Schema Generator (`/generator`)
- **Multi-Target Schema Builder**: Visually define entity fields and generate:
  - ☕ **Java 21 Spring Boot `@Entity`** classes with JPA annotations.
  - 🍃 **Express.js Mongoose Schemas** with timestamp flags.
  - 🐘 **PostgreSQL / MySQL DDL Tables** with data types and nullability constraints.
- **1-Click Copy Code** button for rapid developer productivity.

### 5. 📚 Documentation & Notes Studio (`/notes`)
- **Workstation Studio Layout**: Independent dual-pane view with fixed guide directory sidebar and scrollable note reader.
- **Rich Markdown Renderer**: Renders syntax-highlighted code blocks, tables, callouts, and clean technical docs.
- **Focus Mode**: Full-screen distraction-free reader overlay.

### 6. 🎯 Phase Quiz & Assessment Engine (`/quiz/:phaseId`)
- Timed multiple-choice assessments evaluating core Java, JVM internals, Spring Boot, and REST API concepts.
- Immediate score evaluation and progress tracking saved to student profiles.

### 7. 🔒 Admin Management Control Center (`/admin/dashboard`)
- Manage learning phases, quiz questions, published notes, and student feedback reports.
- Admin authentication with JWT session persistence.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Three.js / WebGL |
| **Backend** | Node.js, Express.js, MongoDB Atlas (Mongoose ORM), JWT Authentication, CORS |
| **Styling & Theme** | Modern Glassmorphism, Space Grotesk + Plus Jakarta Sans + Fira Code Typography |
| **Deployment** | Render Cloud (Backend API), Vercel / Netlify (Frontend App) |

---

## ⚙️ Getting Started & Local Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection URI

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/LearnWithUs.git
cd LearnWithUs
```

---

### Step 2: Set Up Backend (`LearnWithUs`)

1. Navigate to the backend directory:
   ```bash
   cd LearnWithUs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `LearnWithUs/` root:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/learnwithus?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm start
   # Or for development with nodemon:
   npx nodemon server.js
   ```
   *Backend running at: `http://localhost:5000`*

---

### Step 3: Set Up Frontend (`Frontend`)

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend running at: `http://localhost:3000` (or `3001` / `3002` if port is occupied)*

---

## 🔌 API Endpoint Reference

### Public & Community Endpoints
- `GET /api/community` — Fetch community items (filter by `type=idea|freelance|incident`)
- `POST /api/community` — Submit a new idea, freelance gig, or incident report
- `POST /api/community/:id/upvote` — Increment upvotes for a post

### Notes & Documentation Endpoints
- `GET /api/student/notes` — Fetch all published documentation notes
- `GET /api/student/notes/languages` — Get list of distinct programming languages

### Phases & Quiz Endpoints
- `GET /api/student/phases` — Get all learning phases
- `GET /api/student/phases/:phaseId/questions` — Fetch quiz questions for a phase
- `POST /api/student/quiz/submit` — Submit quiz answers & record score

### Admin Portal Endpoints
- `POST /api/admin/login` — Admin authentication & JWT token issuance
- `POST /api/admin/phases` — Create a new learning phase
- `POST /api/admin/questions` — Add a new quiz question
- `POST /api/admin/notes` — Publish documentation notes

---

## 🌐 Deployment Instructions

### Deploy Backend to Render Cloud:
1. Create a **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository and set the Root Directory to `LearnWithUs`.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT=5000`).

### Deploy Frontend to Vercel / Netlify:
1. Create a project on [Vercel](https://vercel.com) or Netlify.
2. Set Root Directory to `Frontend`.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`

---

## 📄 License & Author

Developed with ❤️ for the developer community. Distributed under the **MIT License**.
