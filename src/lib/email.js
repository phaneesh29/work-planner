// Create transporter lazily to avoid initialization errors
async function getTransporter() {
  // Dynamic import to handle Next.js webpack bundling
  const nodemailer = (await import('nodemailer')).default;
  
  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
  
  return nodemailer.createTransport(config);
}

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Work Planner',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Thank you for registering with Work Planner!</p>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
      </div>
    `,
  };

  try {
    const transporter = await getTransporter();
    const result = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Verification email sent:', result.messageId);
    }
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    return { success: false, error: error.message };
  }
}

export async function sendDueDateReminderEmail(email, taskTitle, dueDate) {
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Urgent: Task "${taskTitle}" is Due Soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">⏰ Urgent Task Reminder</h2>
        <p style="color: #dc2626; font-weight: bold;">Your task is due within the next hour!</p>
        <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #991b1b;">${taskTitle}</h3>
          <p style="margin: 0; color: #7f1d1d;">Due: ${formattedDate}</p>
        </div>
        <p>Don't forget to complete this task before it's overdue!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Complete Task Now
        </a>
      </div>
    `,
  };

  try {
    const transporter = await getTransporter();
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending reminder email:', error.message);
    return { success: false, error: error.message };
  }
}
