import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { sendDueDateReminderEmail } from '@/lib/email';

export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron or an authorized source
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find tasks that are due within the next 24 hours and haven't been notified yet
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingTasks = await Task.find({
      dueDate: { $gte: now, $lte: twentyFourHoursFromNow },
      status: 'pending',
      notificationSent: false,
    }).populate('userId');

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const task of upcomingTasks) {
      if (task.userId && task.userId.email && task.userId.isVerified) {
        const result = await sendDueDateReminderEmail(
          task.userId.email,
          task.title,
          task.dueDate
        );
        
        if (result.success) {
          // Mark notification as sent
          task.notificationSent = true;
          await task.save();
          emailsSent++;
        } else {
          emailsFailed++;
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Reminder emails processed (hourly check)',
        stats: {
          tasksFound: upcomingTasks.length,
          emailsSent,
          emailsFailed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in cron job:', error.message);
    return NextResponse.json(
      { error: 'Cron job failed', details: process.env.NODE_ENV !== 'production' ? error.message : undefined },
      { status: 500 }
    );
  }
}
