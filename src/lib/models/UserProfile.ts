import mongoose, { Schema, model, models } from "mongoose";

export interface IUserProfile {
  userEmail: string;
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

const UserProfileSchema = new Schema<IUserProfile>({
  userEmail: { type: String, required: true, unique: true, index: true },
  name: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
}, { timestamps: true });

const UserProfile = models.UserProfile || model<IUserProfile>("UserProfile", UserProfileSchema);

export default UserProfile;

