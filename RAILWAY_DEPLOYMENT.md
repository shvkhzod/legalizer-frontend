# Railway Deployment Guide - Frontend

Step-by-step guide to deploy the Legal Compliance Checker frontend on Railway.

## Prerequisites

- GitHub account
- Railway account with deployed backend
- Backend URL from backend deployment
- Frontend repository pushed to GitHub

## Step 1: Push Frontend to GitHub

1. Initialize git repository:
```bash
cd legalizer-frontend
git init
git add .
git commit -m "Initial frontend setup"
```

2. Create a new repository on GitHub named `legalizer-frontend`

3. Push to GitHub:
```bash
git remote add origin https://github.com/yourusername/legalizer-frontend.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Frontend to Railway

1. Go to your Railway project (the same one with your backend)
2. Click **+ New** → **GitHub Repo**
3. Select your `legalizer-frontend` repository
4. Railway will automatically detect it as a Node.js project

## Step 3: Configure Environment Variables

1. Click on the Frontend service
2. Go to **Variables** tab
3. Add the following variable:

```env
PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

**Important:**
- Replace `your-backend-url` with your actual backend URL from backend deployment
- Make sure to include `/api` at the end
- Example: `https://legalizer-backend-production.up.railway.app/api`

## Step 4: Generate Domain

1. Click on Frontend service
2. Go to **Settings** → **Networking**
3. Click **Generate Domain**
4. Copy the generated URL (e.g., `https://legalizer-frontend-production.up.railway.app`)

## Step 5: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to **Backend Service** → **Variables**
2. Update the `CORS_ORIGIN` variable:
```env
CORS_ORIGIN=https://your-frontend-url.railway.app
```
3. Backend will automatically redeploy

## Step 6: Test Your Application

1. Visit your frontend URL
2. Test the following:
   - ✓ Homepage loads correctly
   - ✓ Registration works
   - ✓ Login works
   - ✓ Scan functionality works
   - ✓ Reports display correctly
   - ✓ Responsive design on mobile

## Environment Variables Reference

### Required
- `PUBLIC_API_URL` - Backend API URL with `/api` suffix

### Optional
- `PORT` - Railway sets this automatically

## Troubleshooting

### Frontend Can't Connect to Backend?

Check these:
1. Verify `PUBLIC_API_URL` is correct and includes `/api`
2. Verify backend CORS is set to frontend URL
3. Both URLs should use `https://`
4. Check browser console for CORS errors

### Build Failed?

1. Check logs in **Deployments** → Click deployment → **View Logs**
2. Verify all dependencies are in `package.json`
3. Ensure `svelte.config.js` uses `@sveltejs/adapter-node`

### Page Not Loading?

1. Check if backend is running (visit backend `/health` endpoint)
2. Verify environment variables are set correctly
3. Check deployment logs for errors
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Mobile Not Responsive?

This should work out of the box, but verify:
1. Viewport meta tag exists in `src/app.html`
2. CSS media queries are present in components
3. Test on actual mobile device or browser dev tools

## Custom Domain (Optional)

To use your own domain:

1. Click on Frontend service
2. Go to **Settings** → **Networking**
3. Click **Custom Domain**
4. Follow Railway's instructions to add DNS records

Don't forget to update backend CORS with your new domain!

## Monitoring

- **Logs**: Deployments → Click deployment → View Logs
- **Metrics**: Click service → Metrics tab
- **Performance**: Monitor response times and errors

## Auto-Deploy

Railway automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Railway will detect the push and redeploy automatically.

## Cost

With Frontend service:
- Free tier: $5/month credit (shared with backend)
- After credit: ~$3-5/month for frontend
- Total (DB + Backend + Frontend): ~$10-13/month

## Production Checklist

- [ ] Backend URL configured correctly
- [ ] CORS updated on backend
- [ ] Environment variables set
- [ ] Domain generated
- [ ] All features tested
- [ ] Mobile responsive verified
- [ ] No console errors
- [ ] API calls working

## Next Steps

Your app is now live! Consider:
- Setting up a custom domain
- Implementing email verification
- Adding monitoring/alerting
- Setting up backups for database
- Implementing rate limiting

Congratulations!
