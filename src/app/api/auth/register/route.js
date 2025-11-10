import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';
import { generateVerificationToken } from '@/lib/jwt';
import { validateEmail, validatePassword, sanitizeString } from '@/lib/validation';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = email.toLowerCase().trim();

    if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email (non-blocking, log errors)
    try {
      await sendVerificationEmail(sanitizedEmail, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      // Continue with registration even if email fails
    }

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email to verify your account.',
        userId: user._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error.message);
    return NextResponse.json(
      { error: 'Registration failed', details: process.env.NODE_ENV !== 'production' ? error.message : undefined },
      { status: 500 }
    );
  }
}
