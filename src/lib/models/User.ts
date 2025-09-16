import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
	name: string;
	email: string;
	password?: string;
	role: "user" | "admin";
}

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
	password: { type: String, required: false },
	role: { type: String, enum: ["user", "admin"], default: "user", index: true },
}, { timestamps: true });

const User = models.User || model<IUser>("User", UserSchema);

export default User;
