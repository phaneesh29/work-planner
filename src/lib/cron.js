import cron from 'node-cron';

let cronJobStarted = false;

export function startEmailCronJob() {
  if (cronJobStarted) {
    return;
  }

  // Only run cron in development or self-hosted environments
  // In Vercel, use Vercel Cron instead
  if (process.env.VERCEL) {
    console.log('Running on Vercel - use Vercel Cron instead of node-cron');
    return;
  }

  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running due date reminder cron job...');
    
    try {
      // Call the cron endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/run-reminders`, {
        headers: process.env.CRON_SECRET ? {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        } : {}
      });

      const data = await response.json();
      console.log('Cron job completed:', data);
    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });

  cronJobStarted = true;
  console.log('Email reminder cron job started - runs every hour');
}
