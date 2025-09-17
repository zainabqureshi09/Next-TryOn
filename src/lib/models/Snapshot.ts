import mongoose, { Schema, model, models } from "mongoose";

export interface ISnapshot {
  userEmail: string;
  url: string;
}

const SnapshotSchema = new Schema<ISnapshot>(
  {
    userEmail: { type: String, required: true, index: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const Snapshot = (models.Snapshot as mongoose.Model<ISnapshot>) || model<ISnapshot>("Snapshot", SnapshotSchema);

export default Snapshot;










