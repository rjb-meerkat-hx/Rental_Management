# RentFlow Pro

Rental management app with a Vite/React frontend and an Express/SQLite API.

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` for the frontend:

   ```bash
   VITE_API_BASE_URL=
   ```

   Keep it empty for local Vite proxy support, or set it to `http://localhost:3001`.

3. Start both local servers:

   ```bash
   npm run dev:all
   ```

   Frontend: `http://localhost:3000`

   Backend: `http://localhost:3001/api/health`

## Production Environment Variables

### Backend on Render

Set these on the Render web service:

```bash
NODE_ENV=production
SQLITE_DB_PATH=/var/data/rentflow.db
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Use the persistent disk mounted at `/var/data` so SQLite data survives deploys.

### Frontend on Vercel

Set this on the Vercel project:

```bash
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Do not include a trailing slash.

## Deploy Backend to Render

1. Push this repo to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Use these settings:

   ```bash
   Build Command: npm install
   Start Command: npm start
   Health Check Path: /api/health
   ```

4. Add a persistent disk:

   ```bash
   Mount Path: /var/data
   Size: 1 GB
   ```

5. Add the backend environment variables listed above.
6. Deploy and copy the Render service URL.

The included `render.yaml` can also be used as a Render Blueprint.

## Deploy Frontend to Vercel

1. Import the same GitHub repo into Vercel.
2. Use these settings:

   ```bash
   Framework Preset: Vite
   Build Command: npm run build:frontend
   Output Directory: dist
   ```

3. Add `VITE_API_BASE_URL` with your Render backend URL.
4. Deploy.
5. After Vercel gives you the frontend URL, update Render's `CORS_ORIGIN` to that exact URL and redeploy the backend.

## Useful Commands

```bash
npm run build
npm start
npm run server:dev
```
