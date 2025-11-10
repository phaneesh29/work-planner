// Environment variable validation
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'NEXT_PUBLIC_APP_URL'
];

export function validateEnvVars() {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('Warning: JWT_SECRET should be at least 32 characters for production use');
  }

  // Validate email port
  const emailPort = parseInt(process.env.EMAIL_PORT);
  if (isNaN(emailPort) || emailPort < 1 || emailPort > 65535) {
    throw new Error('EMAIL_PORT must be a valid port number between 1 and 65535');
  }

  console.log('✓ Environment variables validated successfully');
}
