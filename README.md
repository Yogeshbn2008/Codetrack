# CodeTrack

A full-stack MERN application for tracking coding practice and DSA (Data Structures & Algorithms) progress. Users can log problems they've solved or attempted, organize them by topic and difficulty, search and filter their history, and track progress on a stats dashboard.

**Live App:** https://codetrack-henna.vercel.app
**Backend API:** https://codetrack-server.onrender.com
**Backend Repo:** https://github.com/Yogeshbn2008/codetrack-server

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

---

## Features

- **Authentication** — secure registration and login with JWT-based sessions and bcrypt password hashing
- **Per-user data isolation** — every user only sees and manages their own problems
- **Full CRUD** — add, view, edit, and delete coding problems
- **Search & filtering** — search by title, filter by topic, difficulty, and status
- **Progress dashboard** — total solved/attempted counts, breakdown by difficulty and topic, and a recent-activity feed
- **Persistent sessions** — stays logged in across page refreshes via localStorage
- **Fully deployed** — live frontend (Vercel) connected to a live backend (Render) and a cloud database (MongoDB Atlas)

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
│   ├── pages/          # Route-level pages (Dashboard, Problems, AddProblem, EditProblem, Login, Register)
│   ├── services/       # Centralized API calls (api.js)
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
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## API Reference

| Method | Route | Description | Auth Required |
|--------|-------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |
| GET | `/api/problems` | Get all problems for the logged-in user (supports `search`, `topic`, `difficulty`, `status` query params) | Yes |
| POST | `/api/problems` | Add a new problem | Yes |
| GET | `/api/problems/:id` | Get a single problem | Yes |
| PUT | `/api/problems/:id` | Update a problem | Yes |
| DELETE | `/api/problems/:id` | Delete a problem | Yes |
| GET | `/api/problems/stats/summary` | Get dashboard stats (totals, breakdowns, recent activity) | Yes |

Protected routes require an `Authorization: Bearer <token>` header, obtained from the login response.

---

## What I Learned Building This

This project was built incrementally, feature by feature, rather than from a single tutorial — which meant running into (and debugging) real issues along the way:

- Diagnosing and resolving port conflicts from stale background processes
- Fixing `.env` parsing issues (formatting, missing keys, encoding special characters in passwords)
- Reconciling `id` vs MongoDB's `_id` after migrating from in-memory data to a real database
- Implementing JWT-based authentication and scoping API queries per authenticated user
- Configuring CORS, environment variables, and client-side routing rewrites for a production deployment split across two separate hosting platforms

---

## Future Improvements

- Debounced search input to reduce redundant API calls
- Coding streak tracker and daily goals
- Public user profiles and a leaderboard
- Direct links to problems on their original platform (LeetCode, Codeforces, etc.)
