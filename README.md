# Pulse — Mini Social Post Application

A small social feed app (signup → login → post → like → comment), inspired by the
Social page in the TaskPlanet app. Built with the MERN stack.

```
social-app/
├── backend/   Node.js + Express + MongoDB API
└── frontend/  React (Vite) + React-Bootstrap client
```

## Features

- Email/password signup and login, with passwords hashed (bcrypt) and sessions
  handled via JWT.
- Create a post with text, an image, or both — neither field is mandatory on
  its own, but at least one is required.
- Public feed of all posts, newest first, with pagination ("Load more").
- Like (toggle) and comment on any post. Usernames of everyone who liked or
  commented are stored and shown, and counts update instantly in the UI.
- Two MongoDB collections only: `users` and `posts` (likes/comments are
  embedded inside each post document).

## Tech stack

| Layer    | Choice                                              |
|----------|------------------------------------------------------|
| Frontend | React (Vite), React Router, React-Bootstrap, Axios  |
| Backend  | Node.js, Express, Mongoose, JWT, bcrypt, Multer      |
| Database | MongoDB (Atlas in production)                       |

## Running locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

You need a MongoDB connection string. Either:
- Run MongoDB locally and use `mongodb://localhost:27017/social-app`, or
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and
  use the connection string it gives you.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000 for local dev
npm run dev              # starts on http://localhost:5173
```

Open `http://localhost:5173`, sign up, and start posting.

## API overview

| Method | Endpoint                  | Auth | Description                          |
|--------|----------------------------|------|---------------------------------------|
| POST   | `/api/auth/signup`         | No   | Create an account                     |
| POST   | `/api/auth/login`          | No   | Log in, returns a JWT                 |
| GET    | `/api/posts?page=&limit=`  | Yes  | Paginated feed, newest first          |
| POST   | `/api/posts`                | Yes  | Create a post (multipart form, fields: `text`, `image`) |
| POST   | `/api/posts/:id/like`       | Yes  | Toggle a like on a post               |
| POST   | `/api/posts/:id/comment`    | Yes  | Add a comment (`{ text }`)            |

All authenticated requests send `Authorization: Bearer <token>`.

## Deployment

### Database — MongoDB Atlas
1. Create a free cluster, add a database user, and allow network access from
   anywhere (0.0.0.0/0) for simplicity, or Render's specific IPs for tighter
   security.
2. Copy the connection string for use as `MONGO_URI`.

### Backend — Render
1. Push this repo to GitHub.
2. On Render, create a **Web Service**, point it at the `backend` folder
   (Root Directory: `backend`).
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`
   (set this to your Vercel/Netlify frontend URL once you have it).
5. Note: Render's free instances use an ephemeral filesystem, so files saved
   to `/uploads` by Multer will be lost on redeploy or restart. For a
   persistent setup, swap the storage in `backend/middleware/upload.js` for a
   provider like Cloudinary or AWS S3.

### Frontend — Vercel or Netlify
1. Import the repo, set the project root to `frontend`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Add environment variable `VITE_API_URL` pointing at your deployed Render
   backend URL (e.g. `https://your-app.onrender.com`).
4. Redeploy the backend afterward with `CLIENT_ORIGIN` set to this frontend's
   final URL so CORS allows it.

## Design notes

The UI borrows the single-column, card-based feed layout common to mobile
social apps (avatar + name + timestamp header, image below text, a like/
comment action row, and inline comments) as a nod to the TaskPlanet Social
page, built from scratch with its own color palette and type system rather
than copying any specific screen.

## Possible next steps

- Cloud image storage (Cloudinary/S3) for persistence across deploys.
- Edit/delete for a user's own posts and comments.
- Real-time updates via WebSockets instead of optimistic UI + refetch.
