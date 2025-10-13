import mongoose, { Schema, Document } from 'mongoose';
import dbConnect from '@/lib/mongodb';

// Database connection will be handled by the API routes

export interface ISnapshot extends Document {
  userEmail: string;
  imageUrl: string;
  glassesId?: string;
  createdAt: Date;
  name?: string;
}

const SnapshotSchema = new Schema<ISnapshot>(
  {
    userEmail: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    glassesId: { type: String },
    name: { type: String, default: 'My Snapshot' },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Check if model exists before creating
const Snapshot = mongoose.models.Snapshot || mongoose.model<ISnapshot>('Snapshot', SnapshotSchema);

export default Snapshot;