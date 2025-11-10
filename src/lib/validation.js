// Input validation and sanitization utilities

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // At least 6 characters
  return password && password.length >= 6;
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  // Remove any HTML tags and trim
  return str.replace(/<[^>]*>/g, '').trim();
}

export function validateTaskTitle(title) {
  return title && sanitizeString(title).length > 0 && sanitizeString(title).length <= 200;
}

export function validateTaskDescription(description) {
  const sanitized = sanitizeString(description);
  return sanitized.length <= 1000;
}

export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
