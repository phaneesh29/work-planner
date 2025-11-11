import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
  },
  description: {
    type: String,
    default: '',
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date'],
  },
  dueTime: {
    type: String,
    default: '09:00',
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for faster queries
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ dueDate: 1, status: 1, notificationSent: 1 });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
