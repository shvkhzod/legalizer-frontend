# Quick Start - Frontend Deployment

Deploy your frontend to Railway in 3 minutes.

## Prerequisites

Backend must be deployed first! Get your backend URL from backend deployment.

## 1. Push to GitHub

```bash
cd legalizer-frontend
git init
git add .
git commit -m "Initial frontend"
git remote add origin https://github.com/yourusername/legalizer-frontend.git
git push -u origin main
```

## 2. Deploy Frontend

1. In same Railway project as backend
2. **+ New** → **GitHub Repo** → Select `legalizer-frontend`
3. Click service → **Variables** → Add:
   - `PUBLIC_API_URL`: `https://your-backend-url.railway.app/api`

## 3. Get Frontend URL

**Settings** → **Networking** → **Generate Domain** → Copy URL

## 4. Update Backend CORS

1. Go to Backend service → **Variables**
2. Update `CORS_ORIGIN`: `https://your-frontend-url.railway.app`
3. Backend auto-redeploys

Done! Visit your frontend URL and test the app.
