// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import User from "./models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Admin login
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { 
            id: "admin", 
            name: "Admin", 
            email: process.env.ADMIN_EMAIL,
            role: "admin"
          };
        }

        // For now, allow any email/password combination for demo
        // In production, you should hash passwords and store them in database
        try {
          await dbConnect();
          
          // Check if user exists, if not create one
          let user = await User.findOne({ email: credentials.email });
          if (!user) {
            user = await User.create({
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'user'
            });
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || (user.email === process.env.ADMIN_EMAIL ? "admin" : "user");
        token.id = user.id;
      }
      
      // Handle Google OAuth
      if (account?.provider === "google" && user) {
        try {
          await dbConnect();
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email!,
              name: user.name,
              image: user.image,
              role: 'user'
            });
          }
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        } catch (error) {
          console.error("Google auth error:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
