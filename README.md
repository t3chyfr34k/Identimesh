# Idenflow Social Search

A full-stack app with React + Vite + TypeScript + Tailwind on the frontend and Node.js (Express) + MongoDB (Mongoose) on the backend. Realtime updates are delivered via Socket.IO.

## Quick Start
1) Install dependencies
```powershell
Set-Location "d:\idenflow-social-search-main"; npm install
Set-Location "d:\idenflow-social-search-main\server"; npm install
```
2) Configure environment (server/.env)
```bash
MONGODB_URI=mongodb+srv://admin:Identi%40200412@identimesh.azt10bj.mongodb.net/?retryWrites=true&w=majority&appName=identimesh
JWT_SECRET=change_this_in_prod
PORT=3001
```
3) Start dev
```powershell
Set-Location "d:\idenflow-social-search-main\server"; npm start
Set-Location "d:\idenflow-social-search-main"; npm run dev
```
Open http://localhost:8080 and test http://localhost:8080/api/health

## Environment
- Backend: `server/.env` (see example above)
- Frontend: set `VITE_API_URL` for production build when backend is hosted elsewhere
  - Local dev uses Vite proxy. In production, set
    ```bash
    VITE_API_URL=https://your-backend-host
    ```

## API
Base path: `/api`
- POST `/api/auth/signup` → `{ name, email, password }`
- POST `/api/auth/login` → `{ email, password }`
- GET `/api/auth/me` (Authorization: Bearer <token>)
- POST `/api/search-results` (Authorization: Bearer <token>)
- GET `/api/search-results/:id` (Authorization: Bearer <token>)
- GET `/api/search-results` (Authorization: Bearer <token>)

## Data Models (Mongoose)
- User: `{ name, email(unique, lowercase), passwordHash }`
- Search: `{ userId(ObjectId), searchDate, sourceProfile, matches[], searchTerm, totalMatches }`
Collections are created automatically on first write.

## Realtime
Socket.IO server broadcasts `search-result:created` with `{ id, userId }` on new search results.

## Deployment
Recommended: Frontend on Vercel, Backend on Railway or Render (free tiers).

1) Backend (Railway/Render)
- Set env vars: `MONGODB_URI`, `JWT_SECRET`, `PORT` (3001)
- Start command: `node src/index.js`
- Expose public URL, e.g. `https://idenflow-api.onrender.com`

2) Frontend (Vercel)
- Build command: `npm run build`
- Output: `dist`
- Env var: `VITE_API_URL=https://idenflow-api.onrender.com`

3) Local production preview
```powershell
Set-Location "d:\idenflow-social-search-main"; npm run build; npm run preview
```

## Notes
- No fake users are present in code; users are created via `/api/auth/signup`.
- Collections are created on demand; no manual migration is required.
- To purge data, temporarily add an admin route or use MongoDB Atlas UI to drop collections.