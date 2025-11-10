import { NextResponse } from 'next/server';
import { startEmailCronJob } from '@/lib/cron';

export async function GET() {
  try {
    startEmailCronJob();
    return NextResponse.json(
      { message: 'Cron job started successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error starting cron job:', error);
    return NextResponse.json(
      { error: 'Failed to start cron job' },
      { status: 500 }
    );
  }
}
