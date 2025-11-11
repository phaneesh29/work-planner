import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/jwt';
import { validateTaskTitle, validateTaskDescription, validateDate, sanitizeString } from '@/lib/validation';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const tasks = await Task.find({ userId: decoded.userId }).sort({ dueDate: 1 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { title, description, dueDate, dueTime } = await request.json();

    if (!title || !dueDate) {
      return NextResponse.json(
        { error: 'Title and due date are required' },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedDescription = description ? sanitizeString(description) : '';

    if (!validateTaskTitle(sanitizedTitle)) {
      return NextResponse.json(
        { error: 'Title must be between 1 and 200 characters' },
        { status: 400 }
      );
    }

    if (!validateTaskDescription(sanitizedDescription)) {
      return NextResponse.json(
        { error: 'Description must be less than 1000 characters' },
        { status: 400 }
      );
    }

    if (!validateDate(dueDate)) {
      return NextResponse.json(
        { error: 'Invalid due date' },
        { status: 400 }
      );
    }

    await dbConnect();

    const task = await Task.create({
      userId: decoded.userId,
      title: sanitizedTitle,
      description: sanitizedDescription,
      dueDate: new Date(dueDate),
      dueTime: dueTime || '09:00',
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
