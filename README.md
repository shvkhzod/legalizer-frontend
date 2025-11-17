# Legal Compliance Checker - Frontend

Modern, responsive SvelteKit frontend for the Legal Compliance Checker platform.

## Features

- 🔍 Automated Compliance Scanning
- 🤖 AI-Powered Analysis
- 📊 Detailed Reports
- 🔐 Secure Authentication
- 📱 Fully Responsive (Desktop, Tablet, Mobile)
- 🎨 Modern Dark Theme

## Tech Stack

- **SvelteKit** - Modern web framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Responsive Design** - Mobile-first approach

## Local Development

### Prerequisites
- Node.js 18+
- Backend API running (see [legalizer-backend](https://github.com/yourusername/legalizer-backend))

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
PUBLIC_API_URL=http://localhost:3001/api
```

3. **Start development server**
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Railway Deployment

### Prerequisites
Backend must be deployed first. See [legalizer-backend](https://github.com/yourusername/legalizer-backend) deployment guide.

### Deploy Frontend

1. **Push to GitHub**
Push this repository to GitHub

2. **Create Railway Service**
- In Railway dashboard, click **+ New** → **GitHub Repo**
- Select this repository

3. **Add Environment Variable**
```env
PUBLIC_API_URL=https://your-backend-service.up.railway.app/api
```

To get backend URL:
- Go to Backend Service → **Settings** → **Networking**
- Copy the public URL and add `/api` to the end

4. **Deploy**
Railway will automatically build and deploy

5. **Update Backend CORS**
After deployment, copy your frontend URL and update backend:
- Backend Service → **Variables**
- Update `CORS_ORIGIN` to your frontend URL
- Redeploy backend

## Build Configuration

The app uses `@sveltejs/adapter-node` for production deployment.

Build command: `npm run build`
Start command: `node build`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run SvelteKit checks

## Project Structure

```
legalizer-frontend/
├── src/
│   ├── lib/
│   │   ├── components/  # Reusable Svelte components
│   │   ├── stores/      # State management
│   │   └── api/         # API client
│   ├── routes/          # SvelteKit routes
│   │   ├── +page.svelte           # Home
│   │   ├── scan/+page.svelte      # Scan page
│   │   ├── reports/+page.svelte   # Reports
│   │   ├── login/+page.svelte     # Login
│   │   ├── register/+page.svelte  # Register
│   │   └── about/+page.svelte     # About
│   ├── app.html         # HTML template
│   └── app.css          # Global styles
├── static/              # Static assets
├── railway.json         # Railway config
├── svelte.config.js
└── vite.config.ts
```

## Responsive Breakpoints

- **Desktop:** 1024px+
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px
- **Small Mobile:** < 480px

## Environment Variables

### Required for Railway
- `PUBLIC_API_URL` - Backend API URL (e.g., `https://backend.railway.app/api`)

## Backend Repository

The backend is deployed separately. See: [legalizer-backend](https://github.com/yourusername/legalizer-backend)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
