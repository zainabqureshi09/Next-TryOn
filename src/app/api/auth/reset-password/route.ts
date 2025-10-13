import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    
    // Parse request body
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { success: true, message: "If your email exists in our system, you will receive reset instructions" },
        { status: 200 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Store reset token in database
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiry,
    });
    
    // In a real application, send email with reset link
    // For this example, we'll just return success
    // sendResetEmail(email, resetToken);
    
    return NextResponse.json(
      { success: true, message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}