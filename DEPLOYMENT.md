# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables set in production
- [ ] MongoDB connection string updated for production
- [ ] JWT_SECRET changed to a strong random string (min 32 characters)
- [ ] Email credentials configured
- [ ] NEXT_PUBLIC_APP_URL set to production domain
- [ ] Database indexes created
- [ ] Test all features in staging environment

## Deploying to Vercel (Recommended)

### 1. Prepare Your Repository

```bash
# Commit all changes
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `NEXT_PUBLIC_APP_URL` (will be your Vercel domain)
5. Click "Deploy"

### 3. Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` with your Vercel domain
2. Test email verification flow
3. Test task creation and notifications

### Important Notes for Vercel

⚠️ **Cron Jobs**: Vercel's serverless functions don't support long-running processes. For the email reminder cron job, you have two options:

**Option A: Use Vercel Cron (Recommended)**

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/run-reminders",
    "schedule": "0 * * * *"
  }]
}
```

This runs the reminder check every hour.

**Option B: Use External Cron Service**

Use services like:
- [EasyCron](https://www.easycron.com/)
- [Cron-job.org](https://cron-job.org/)
- [GitHub Actions](https://github.com/features/actions)

Configure them to hit: `https://your-domain.vercel.app/api/cron/run-reminders` every hour.

## Deploying to Other Platforms

### Railway

1. Connect your GitHub repo to Railway
2. Add environment variables
3. Railway auto-detects Next.js and deploys

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variables

### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables

## Environment Variables for Production

```env
# MongoDB (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workplanner?retryWrites=true&w=majority

# JWT (generate a strong secret)
JWT_SECRET=<generate-with: openssl rand -base64 64>

# Email (Gmail App Password)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# App URL (your production domain)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Generate Strong JWT Secret

```bash
# Linux/Mac
openssl rand -base64 64

# Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere) for serverless
5. Get connection string and add to env vars

## Gmail App Password Setup

1. Enable 2-Factor Authentication on Google account
2. Go to Google Account → Security → App passwords
3. Generate new app password for "Mail"
4. Use the generated password (without spaces) in EMAIL_PASS

## Performance Optimizations

✅ Database indexes added for faster queries
✅ Lazy loading for email transporter
✅ Password hashing with bcrypt (salt rounds: 12)
✅ Input validation and sanitization
✅ Security headers configured
✅ Error messages don't expose sensitive info in production

## Security Best Practices

✅ Passwords hashed with bcrypt
✅ JWT tokens with expiration
✅ Email verification required
✅ Input validation and sanitization
✅ HTTPS enforced with security headers
✅ Rate limiting (implement if needed)
✅ Environment variables for sensitive data
✅ No sensitive data in error messages (production)

## Monitoring & Logging

Consider adding:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay
- [Vercel Analytics](https://vercel.com/analytics) for performance monitoring

## Backup Strategy

1. Enable automated backups in MongoDB Atlas
2. Set up periodic exports
3. Test restore procedures

## Scaling Considerations

- MongoDB Atlas auto-scales with traffic
- Vercel serverless functions scale automatically
- Consider caching frequently accessed data
- Implement rate limiting for API routes

## Support & Maintenance

- Monitor error logs regularly
- Keep dependencies updated: `npm outdated`
- Security updates: `npm audit fix`
- Test critical paths after updates

---

## Quick Deploy Commands

```bash
# Build locally to check for errors
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel --prod
```

Good luck with your deployment! 🚀
