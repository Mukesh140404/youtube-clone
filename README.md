<div align="center">

<img src="https://via.placeholder.com/120x120/FF0000/FFFFFF?text=▶" alt="YouTube Clone Logo" width="80" height="80" style="border-radius: 20px"/>

# YouTube Clone

A full-stack YouTube clone with video uploads, subscriptions, playlists, comments, and a responsive UI — built on React 19, Express.js 5, and MongoDB.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

[Live Demo](#) · [Report Bug](https://github.com/your-username/youtube-clone/issues) · [Request Feature](https://github.com/your-username/youtube-clone/issues)

</div>

---

## 📸 Preview

![YouTube Clone Preview](https://via.placeholder.com/1000x500.png?text=Add+Your+Screenshot+Here)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | JWT-based sign up, login, and protected routes |
| 🎥 **Videos** | Upload, edit, delete, and stream videos via Cloudinary |
| 📢 **Subscriptions** | Subscribe/unsubscribe to channels; view subscriber lists |
| 👍 **Likes** | Like or dislike videos, comments, and tweets |
| 💬 **Comments** | Add, edit, and delete comments on videos |
| 📋 **Playlists** | Create and manage playlists; add/remove videos |
| 🐦 **Community** | Post, edit, delete, and like channel tweets/updates |
| 👤 **Profile** | Manage avatar, cover image, and channel page |
| 📱 **Responsive** | Mobile-first layout with bottom nav and swipeable tabs |
| 🌙 **Dark Mode** | Seamless light/dark mode toggle |

---

## 🛠️ Tech Stack

### Frontend
- **Framework** — React 19 + TypeScript, built with Vite
- **Styling** — TailwindCSS v4 + Tailwind Merge
- **Routing** — TanStack Router (file-based)
- **Data Fetching** — TanStack React Query v5 + Axios
- **State** — Zustand
- **Icons** — Lucide React + React Icons

### Backend
- **Runtime** — Node.js (v18+)
- **Framework** — Express.js 5
- **Database** — MongoDB + Mongoose + Aggregate Paginate v2
- **Auth** — JSON Web Tokens + bcrypt
- **Uploads** — Multer (local temp) → Cloudinary (cloud storage)

---

## 📁 Project Structure

```
youtube-clone/
├── backend/
│   └── src/
│       ├── controllers/     # Business logic per resource
│       ├── db/              # MongoDB connection
│       ├── middlewares/     # Auth + Multer middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express route definitions
│       ├── utils/           # API response, error classes, Cloudinary
│       ├── app.js           # Express app config
│       └── index.js         # Server entry point
│
└── frontend/
    └── src/
        ├── assets/          # Static assets
        ├── client/          # Axios API wrappers
        ├── components/      # Reusable UI components
        ├── hooks/           # Custom React hooks
        ├── routes/          # TanStack file-based routes
        ├── store/           # Zustand global state
        ├── types/           # TypeScript interfaces
        └── utils/           # Helper functions
```

---

## 🚀 Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/youtube-clone.git
cd youtube-clone
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file (refer to `.env.sample`):

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
```

```bash
npm run dev
# Server runs at http://localhost:8000
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

```bash
npm run dev
# App runs at http://localhost:5173
```

---

## ☁️ Deployment

> Full step-by-step deployment instructions: **[Backend → Render](#)** | **[Frontend → Vercel](#)**

### Backend (Render)

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
5. Add all environment variables from `.env.sample` in the Render dashboard.
6. Deploy. Copy the live URL (e.g. `https://your-app.onrender.com`).

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
2. Set **Root Directory** to `frontend`.
3. Vercel auto-detects Vite — no build config changes needed.
4. Add environment variable: `VITE_API_BASE_URL=https://your-app.onrender.com/api/v1`
5. Deploy. ✅

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after idle may take ~30 seconds.

---

## 📜 API Reference

All endpoints are under `/api/v1`.

| Resource | Endpoint | Operations |
|---|---|---|
| Users | `/users` | Register, login, logout, profile update, watch history |
| Videos | `/videos` | Upload, edit, delete, fetch all, get by ID |
| Tweets | `/tweets` | Create, update, delete, get user tweets |
| Subscriptions | `/subscriptions` | Toggle subscribe, get subscribers/subscribed |
| Comments | `/comments` | Add, edit, delete, get comments for a video |
| Likes | `/likes` | Toggle like on video, comment, or tweet |
| Playlists | `/playlist` | Create, add/remove video, delete, update, get user playlists |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Check the [issues page](https://github.com/your-username/youtube-clone/issues).

1. Fork the project
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">
Made with ❤️ — <a href="https://github.com/your-username">your-username</a>
</div>