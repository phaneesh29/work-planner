# Quick Setup Guide

Follow these steps to get your Work Planner running:

## 1. Setup Environment Variables

Copy the example environment file and configure it:

```bash
# This file already exists, just edit it with your details
```

Edit `.env` file with:
- Your MongoDB connection string (local or MongoDB Atlas)
- A secure JWT secret key
- Your email credentials (Gmail recommended)

## 2. Start MongoDB

### Local MongoDB:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Or use MongoDB Atlas:
1. Create a free cluster at mongodb.com/atlas
2. Get your connection string
3. Add it to `.env` as MONGODB_URI

## 3. Setup Email (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Go to: Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Add to `.env`:
   - EMAIL_USER: your Gmail address
   - EMAIL_PASS: the generated app password

## 4. Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## 5. Initialize Cron Job

After the app starts, visit this URL once:
```
http://localhost:3000/api/cron/start
```

This activates the daily email reminder system.

## 6. Start Using the App

1. Go to http://localhost:3000
2. Register a new account
3. Check your email for verification link
4. Login and start managing tasks!

## Features Available:

✅ User registration with email verification
✅ Secure login with JWT authentication
✅ Create, edit, delete tasks
✅ Set due dates for tasks
✅ Mark tasks as complete/pending
✅ Visual indicators for overdue tasks
✅ Automatic email reminders for upcoming due dates
✅ Clean, dark-themed UI

## Need Help?

Check the main README.md for detailed documentation, troubleshooting, and customization options.
