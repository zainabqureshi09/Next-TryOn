import mongoose, { Schema, models, model } from "mongoose";
import dbConnect from "@/lib/mongodb";

export interface IUser {
	name: string;
	email: string;
	password?: string;
	role: "user" | "admin";
	image?: string;
	phone?: string;
	addresses?: {
		shipping?: {
			street: string;
			city: string;
			state: string;
			zipCode: string;
			country: string;
		};
		billing?: {
			street: string;
			city: string;
			state: string;
			zipCode: string;
			country: string;
		};
	};
	emailVerified?: Date;
	stripeCustomerId?: string;
	wishlist?: string[];
	lastLogin?: Date;
}

const AddressSchema = new Schema({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
	country: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema<IUser>({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
	password: { type: String, required: false },
	role: { type: String, enum: ["user", "admin"], default: "user", index: true },
	image: { type: String, required: false },
	phone: { type: String },
	addresses: {
		shipping: AddressSchema,
		billing: AddressSchema,
	},
	emailVerified: { type: Date },
	stripeCustomerId: { type: String },
	wishlist: [{ type: String, ref: 'Product' }],
	lastLogin: { type: Date },
}, { timestamps: true });

// Connect to the database before accessing the model
const User = models.User || model<IUser>("User", UserSchema);

export default User;
