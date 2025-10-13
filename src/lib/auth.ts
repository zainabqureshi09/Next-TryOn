// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare, hash } from "bcryptjs";
import User from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    // ✅ Credentials-based authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.");
          }

          // ✅ Handle Admin Login
          if (
            credentials.email === process.env.ADMIN_EMAIL &&
            credentials.password === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: "admin",
              name: "Admin",
              email: process.env.ADMIN_EMAIL,
              role: "admin",
            };
          }

          await dbConnect();

          // ✅ Find user by email
          const user = await User.findOne({ email: credentials.email });

          // ✅ Auto-register new user (optional)
          if (!user) {
            const hashedPassword = await hash(credentials.password, 10);
            const newUser = await User.create({
              email: credentials.email,
              name: credentials.email.split("@")[0],
              password: hashedPassword,
              role: "user",
            });

            return {
              id: newUser._id.toString(),
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
            };
          }

          // ✅ Validate password
          const isValidPassword = await compare(credentials.password, user.password);
          if (!isValidPassword) throw new Error("Invalid password.");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ Error during authorize:", error);
          return null;
        }
      },
    }),

    // ✅ Google OAuth (optional)
    ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  // ✅ Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // When user logs in via Credentials or OAuth
      if (user) {
        token.id = (user as any).id;
        token.role =
          (user as any).role ||
          (user.email === process.env.ADMIN_EMAIL ? "admin" : "user");
      }

      // ✅ Handle Google OAuth registration or lookup
      if (account?.provider === "google" && user?.email) {
        try {
          await dbConnect();
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              name: user.name || user.email.split("@")[0],
              password: await hash(Math.random().toString(36).slice(-8), 10),
              role: "user",
              image: (user as any).image,
            });
          }

          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        } catch (err) {
          console.error("⚠️ Google Auth DB Error:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  // ✅ Custom Pages
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
