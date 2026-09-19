# CodeTrack

A full-stack MERN application for tracking coding practice and DSA (Data Structures & Algorithms) progress. Users can log problems they've solved or attempted, tag them by topic and pattern, auto-fetch problem details from LeetCode links, attach approach photos, track a daily solving streak, get revision reminders on a schedule they choose, and see personalized insights on a stats dashboard.

**Live App:** https://codetrack-henna.vercel.app
**Backend API:** https://codetrack-server.onrender.com
**Backend Repo:** https://github.com/Yogeshbn2008/codetrack-server

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

---

## Features

- **Authentication** — secure registration and login with JWT-based sessions and bcrypt password hashing
- **Per-user data isolation** — every user only sees and manages their own problems
- **Full CRUD** — add, view, edit, and delete coding problems
- **Auto-fetch problem details** — paste a LeetCode link and the title, platform, and difficulty are pulled in automatically via LeetCode's GraphQL API, with a generic fallback for other platforms; manual entry always stays available if fetching fails
- **Topic & pattern tagging** — tag problems by topic (Array, DP, Tree...) and by underlying technique/pattern (Sliding Window, Two Pointers, Binary Search...), with autocomplete suggestions while typing
- **Approach photos** — optionally attach a photo of your handwritten approach or whiteboard solution, uploaded via Cloudinary
- **Dynamic search & filtering** — debounced title search, plus filter dropdowns for topic, pattern, difficulty, and status that are generated from your own data rather than a fixed list, so they grow as your tagging vocabulary does
- **Coding streak tracking** — current streak, longest streak, and a 7-day activity row, computed from actual problem-logging dates
- **Weak-topic insight** — automatically surfaces the topic with your lowest solve rate (among topics with enough attempts to be meaningful) as a focus-area suggestion
- **Customizable revision reminders** — set your own revision interval (in days) per problem, mark a problem as revised, and see what's due next on both the Problems page and the Dashboard
- **Progress dashboard** — total solved/attempted counts, breakdowns by difficulty/topic/pattern, streak, focus area, due-for-revision list, and a recent-activity feed
- **Landing page** — an animated, 3D-tilt hero page shown to logged-out visitors, separate from the authenticated Dashboard
- **Persistent sessions** — stays logged in across page refreshes via localStorage
- **Fully deployed** — live frontend (Vercel) connected to a live backend (Render), a cloud database (MongoDB Atlas), and cloud image storage (Cloudinary)

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- Mongoose (MongoDB ODM)

**Database**
- MongoDB Atlas

**Auth & Security**
- JSON Web Tokens (JWT)
- bcrypt password hashing

**Media Storage**
- Cloudinary (unsigned client-side image uploads)

**External APIs**
- LeetCode GraphQL API (problem metadata auto-fetch)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

**Tooling**
- Git & GitHub
- Nodemon (dev auto-restart)
- Thunder Client (API testing)

---

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI (Navbar, ProblemCard)
│   ├── pages/          # Route-level pages (Landing, Dashboard, Problems, AddProblem, EditProblem, Login, Register)
│   ├── services/       # Centralized API calls (api.js, cloudinary.js)
│   ├── App.jsx
│   └── main.jsx
├── vercel.json          # SPA routing rewrite rule for deployment
└── package.json
```

The backend lives in a separate repository: [codetrack-server](https://github.com/Yogeshbn2008/codetrack-server), structured as:

```
server/
├── models/       # Mongoose schemas (User, Problem)
├── routes/       # Auth routes
├── middleware/   # JWT auth middleware
├── server.js
└── package.json
```

---

## Running Locally

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string (or local MongoDB instance)
- A free Cloudinary account with an unsigned upload preset (for photo uploads)

### 1. Clone both repositories
```bash
git clone https://github.com/Yogeshbn2008/Codetrack.git client
git clone https://github.com/Yogeshbn2008/codetrack-server.git server
```

### 2. Set up the backend
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run it:
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 3. Set up the frontend
```bash
cd client
npm install
```
In `client/src/services/cloudinary.js`, set your own Cloudinary cloud name and unsigned upload preset name.
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## API Reference

| Method | Route | Description | Auth Required |
|--------|-------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |
| GET | `/api/problems` | Get all problems for the logged-in user (supports `search`, `topic`, `pattern`, `difficulty`, `status`, `revision` query params) | Yes |
| POST | `/api/problems` | Add a new problem | Yes |
| GET | `/api/problems/:id` | Get a single problem | Yes |
| PUT | `/api/problems/:id` | Update a problem | Yes |
| PATCH | `/api/problems/:id/revise` | Mark a problem as revised (resets its revision clock) | Yes |
| DELETE | `/api/problems/:id` | Delete a problem | Yes |
| POST | `/api/problems/fetch-meta` | Fetch title/platform/difficulty from a pasted problem link | Yes |
| GET | `/api/problems/meta/options` | Get the distinct topics and patterns the user has used, for filter dropdowns | Yes |
| GET | `/api/problems/stats/summary` | Get dashboard stats (totals, breakdowns, streak, weak-topic insight, due-for-revision list, recent activity) | Yes |

Protected routes require an `Authorization: Bearer <token>` header, obtained from the login response.

---

## What I Learned Building This

This project was built incrementally, feature by feature, rather than from a single tutorial — which meant running into (and debugging) real issues along the way:

- Diagnosing and resolving port conflicts from stale background processes
- Fixing `.env` parsing issues (formatting, missing keys, encoding special characters in passwords)
- Reconciling `id` vs MongoDB's `_id` after migrating from in-memory data to a real database
- Implementing JWT-based authentication and scoping API queries per authenticated user
- Configuring CORS, environment variables, and client-side routing rewrites for a production deployment split across two separate hosting platforms
- Working around a platform's anti-scraping protection by using its own public GraphQL API instead of parsing HTML
- Computing streaks and per-problem revision schedules from raw timestamps, including handling variable, user-defined intervals rather than a single fixed rule
- Debouncing a search input to cut down on redundant network requests
- Building dynamic, data-driven filter options instead of a hardcoded list that would go stale as new tags get used

---

## Future Improvements

- Public user profiles and a leaderboard
- Semantic search over problem notes using embeddings and a RAG pipeline
- Daily goal tracking alongside the existing streak
- Direct in-app problem-solving stats synced from LeetCode's public API, beyond just metadata fetching