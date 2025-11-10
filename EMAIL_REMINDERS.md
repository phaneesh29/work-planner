# Email Reminder System - Hourly Checks

## Overview

The Work Planner now checks **every hour** for tasks that are due within the next hour and sends urgent reminder emails.

## How It Works

### 1. Hourly Schedule
- Cron job runs at the top of every hour: 1:00, 2:00, 3:00, etc.
- Each run checks for tasks due within the next 60 minutes

### 2. Email Logic
- **Trigger**: Task due date is within 1 hour from now
- **Condition**: Task status = "pending" AND notificationSent = false
- **Action**: Send urgent reminder email
- **Post-action**: Mark task.notificationSent = true

### 3. Email Content
- Subject: "Urgent: Task '[Title]' is Due Soon!"
- Body: Highlights urgency with red colors and clock emoji
- CTA: "Complete Task Now" button

## Testing

### Manual Test
Visit this endpoint to manually trigger the reminder check:
```
http://localhost:3001/api/cron/run-reminders
```

### Create Test Task
1. Create a task with due date set to current time + 30 minutes
2. Wait for the next hourly check, or trigger manually
3. Check your email for the reminder

### Check Logs
The cron job logs:
- How many tasks were found
- How many emails were sent
- Any errors that occurred

## Cron Schedule Examples

Current configuration in `src/lib/cron.js` and `vercel.json`:

```javascript
// Every hour (current)
'0 * * * *'

// Every 30 minutes
'*/30 * * * *'

// Every 15 minutes
'*/15 * * * *'

// Every 2 hours
'0 */2 * * *'

// Specific times: 9 AM, 1 PM, 5 PM
'0 9,13,17 * * *'
```

## Development vs Production

### Development (Local)
- Uses `node-cron` package
- Runs automatically when app starts
- Logs are verbose for debugging

### Production (Vercel)
- Uses Vercel Cron (configured in `vercel.json`)
- Serverless function triggered by Vercel's scheduler
- Logs available in Vercel dashboard

### Other Platforms
- Use external cron service (EasyCron, cron-job.org)
- Or platform-specific schedulers (Railway Cron, Render Cron Jobs)

## Security

The cron endpoint is protected with optional `CRON_SECRET`:

```env
CRON_SECRET=your_random_secret_here
```

If set, requests must include:
```
Authorization: Bearer your_random_secret_here
```

## Database Optimization

Tasks are queried with indexes for performance:
- `dueDate` + `status` + `notificationSent`
- Only verified users receive emails
- Efficient date range query

## Email Delivery

- Non-blocking: Registration succeeds even if email fails
- Error handling: Logs errors but doesn't crash the app
- Rate limiting: One email per task (notificationSent flag)

## Troubleshooting

### Emails Not Sending
1. Check email configuration in `.env`
2. Verify SMTP credentials (Gmail App Password)
3. Check logs for error messages
4. Test email endpoint manually

### Cron Not Running
1. **Local**: Check if app is running
2. **Vercel**: Check Vercel Cron logs in dashboard
3. **Manual**: Trigger `/api/cron/run-reminders` directly

### Wrong Timing
1. Check server timezone
2. Verify cron schedule syntax
3. Test with manual trigger first

## Monitoring

### What to Monitor
- Email delivery rate
- Failed email attempts
- Cron job execution time
- Database query performance

### Recommended Tools
- Vercel Logs (for Vercel deployments)
- Sentry (error tracking)
- MongoDB Atlas alerts
- Email service logs (Gmail, SendGrid, etc.)

## Future Enhancements

Potential improvements:
- [ ] Multiple reminder times (24h, 1h, 30min before)
- [ ] User preferences for reminder timing
- [ ] SMS notifications
- [ ] Push notifications (PWA)
- [ ] Reminder acknowledgement
- [ ] Snooze functionality

---

**Current Configuration:** Checks every hour, sends urgent reminders for tasks due within 1 hour. ⏰
