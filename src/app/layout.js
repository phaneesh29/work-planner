import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Work Planner",
  description: "A simple work planner with task management and email notifications",
};

// Validate environment variables and initialize cron on server startup
if (typeof window === 'undefined') {
  try {
    const { validateEnvVars } = require("@/lib/env-validation");
    validateEnvVars();
    
    const { startEmailCronJob } = require("@/lib/cron");
    startEmailCronJob();
  } catch (error) {
    console.error('Startup error:', error.message);
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
