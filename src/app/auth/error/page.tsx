"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-6">
            There was an error signing you in. This could be due to:
          </p>
          <ul className="text-left text-sm text-gray-500 space-y-2 mb-6">
            <li>• Invalid credentials</li>
            <li>• Network connection issues</li>
            <li>• Server configuration problems</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <Link href="/auth/signin">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

