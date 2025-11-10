# Work Planner

A modern, production-ready work planner application built with Next.js, featuring user authentication, email verification, and automated due date reminders.

## ✨ Features

- **User Authentication**
  - Secure registration with email verification
  - JWT-based authentication
  - Protected routes and API endpoints

- **Task Management**
  - Create, read, update, and delete tasks
  - Set due dates for tasks
  - Mark tasks as completed or pending
  - Visual indicators for overdue tasks
  - Task descriptions and titles

- **Email Notifications**
  - Email verification on registration
  - Automated reminder emails for tasks due within 1 hour
  - Cron job checks every hour for upcoming tasks

- **Modern UI**
  - Clean dark theme interface
  - Responsive design with Tailwind CSS
  - Intuitive task management dashboard
  - Modal-based task creation and editing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Email**: Nodemailer
- **Scheduled Tasks**: node-cron

## �️ Production Ready

This application is production-ready with:

- ✅ **Security**: Input validation, sanitization, bcrypt hashing, JWT auth, security headers
- ✅ **Performance**: Database indexes, optimized queries, lazy loading
- ✅ **Error Handling**: Comprehensive try-catch blocks, proper error messages
- ✅ **Scalability**: Serverless-ready, connection pooling, efficient queries
- ✅ **Best Practices**: Environment validation, proper logging, clean code structure

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for complete details and [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## �📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd work-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/workplanner
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/workplanner

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_very_secure_random_jwt_secret_key_change_this

# Email Configuration (Gmail example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configure Email (Gmail Example)

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in the `EMAIL_PASS` field

### 5. Start MongoDB

If using local MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Start the Email Cron Job

After the app is running, trigger the cron job initialization by visiting:

```
http://localhost:3000/api/cron/start
```

This only needs to be done once to start the background email reminder service.

## 📂 Project Structure

```
work-planner/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.js
│   │   │   │   ├── register/route.js
│   │   │   │   └── verify-email/route.js
│   │   │   ├── tasks/
│   │   │   │   ├── [id]/route.js
│   │   │   │   └── route.js
│   │   │   └── cron/
│   │   │       └── start/route.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── register/
│   │   │   └── page.js
│   │   ├── verify-email/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── lib/
│   │   ├── mongodb.js
│   │   ├── jwt.js
│   │   ├── email.js
│   │   └── cron.js
│   └── models/
│       ├── User.js
│       └── Task.js
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with token

### Tasks

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Cron

- `GET /api/cron/start` - Initialize email reminder cron job

## 🎯 Usage

### Registration Flow

1. Navigate to `/register`
2. Fill in name, email, and password
3. Check your email for verification link
4. Click the verification link
5. Login at `/login`

### Task Management

1. After logging in, you'll be redirected to `/dashboard`
2. Click "Add New Task" to create a task
3. Fill in title, description (optional), and due date
4. Tasks appear in the list with their status
5. Use the checkbox to mark tasks as complete/pending
6. Edit or delete tasks using the respective buttons
7. Overdue tasks are highlighted in red

### Email Reminders

- The system automatically checks for tasks due within 1 hour
- Reminder emails are sent every hour (on the hour: 1:00, 2:00, 3:00, etc.)
- Only pending tasks trigger reminders
- Each task only receives one reminder email

## 🔧 Customization

### Changing Cron Schedule

Edit `src/lib/cron.js` to modify when reminders are checked:

```javascript
// Current: Every hour
cron.schedule('0 * * * *', async () => {
  // ...
});

// Examples:
// '*/30 * * * *' - Every 30 minutes
// '*/15 * * * *' - Every 15 minutes
// '0 */2 * * *' - Every 2 hours
// '0 9,17 * * *' - At 9 AM and 5 PM
```

**Note:** Also update `vercel.json` if deploying to Vercel.

### Styling

The app uses Tailwind CSS. Customize colors and theme in:
- `tailwind.config.js` - Theme configuration
- `src/app/globals.css` - Global styles and CSS variables

## 🐛 Troubleshooting

### Email not sending

- Verify EMAIL_USER and EMAIL_PASS in `.env`
- For Gmail, ensure you're using an App Password (not your regular password)
- Check that 2FA is enabled on your Google account
- Verify EMAIL_HOST and EMAIL_PORT are correct

### MongoDB connection issues

- Ensure MongoDB is running
- Check MONGODB_URI is correctly formatted
- For MongoDB Atlas, ensure IP whitelist includes your IP
- Verify database user has proper permissions

### Cron job not running

- Visit `/api/cron/start` to initialize the cron job
- Check server logs for any errors
- Ensure the application stays running (cron jobs only work while the app is active)

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/workplanner` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_random_secret_key` |
| `EMAIL_USER` | Email address for sending emails | `yourapp@gmail.com` |
| `EMAIL_PASS` | Email password or app password | `your_app_password` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note**: For production, you'll need a hosted MongoDB (MongoDB Atlas) and may need to set up a separate service for cron jobs (Vercel Cron or external service).

### Other Platforms

The application can be deployed to any platform that supports Node.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS, GCP, Azure

## 📜 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you have any questions or need help, please open an issue in the repository.

---

Built with ❤️ using Next.js and Tailwind CSS
