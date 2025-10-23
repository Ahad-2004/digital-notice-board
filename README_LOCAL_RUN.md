# Run & Deploy - Digital Notice Board (local & cloud)

Short guide to run the frontend and backend locally and deploy to Vercel and Render.

Prerequisites
- Node.js 18+
- npm (or yarn)
- Firebase project and a service account for the backend (if using real Firestore)

Local dev

1. Install deps

   cd frontend
   npm install

   cd ../backend
   npm install

2. Start servers (in separate terminals)

   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   # create a .env from .env.example and fill in FIREBASE_* values
   npm run dev

   Helper: generate .env from Firebase service account

   If you have the Firebase service account JSON, you can generate a properly escaped `.env` using the included helper script (PowerShell):

   ```powershell
   cd backend\scripts
   node generateEnvFromServiceAccount.js "..\service-account.json" --out "..\.env"
   ```

   Replace `..\service-account.json` with the path to your downloaded service account JSON. This will create `backend/.env` with the PRIVATE_KEY escaped so Node/`firebase-admin` can parse it.

Building for production

- Frontend: from `frontend/` run `npm run build`. The dist output will be in `frontend/dist`.
- Backend: build isn't required; ensure `NODE_ENV=production` and `npm ci` on the server.

Deploy

- Vercel (frontend): The repository contains a `vercel.json` configuration at the repository root that points to `frontend/package.json`. Connect your GitHub repo to Vercel; Vercel will run `npm run build` in the frontend folder and serve the static files.
- Render (backend): The `backend/render.yaml` is provided. Ensure environment variables (FIREBASE_*) are set in Render; Render will run `npm start` which uses `process.env.PORT`.

Notes
- Backend already uses `process.env.PORT` and exposes routes under `/api/*`.
- Frontend expects Vite and environment variables prefixed with `VITE_` (see `frontend/.env.example`).

If anything fails, open an issue and include the server logs (port bind errors, missing env vars).
