"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import useTranslation from "@/hooks/use-translation";

export default function SignInPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("auth.invalidCredentials"));
      } else if (session?.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(t("auth.errorOccurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError(t("auth.googleSignInFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <CardContent className="space-y-6">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              {t("auth.signInTitle")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                {t("auth.continueAsGuest")}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("auth.emailAddress")}
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.enterEmail")}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("auth.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.enterPassword")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? t("auth.signingIn") : t("auth.signIn")}
              </Button>

              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading
                    ? t("auth.signingIn")
                    : t("auth.signInWithGoogle")}
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>{t("auth.demoCredentials")}:</p>
              <p>Email: admin@lensvision.com</p>
              <p>Password: (check your .env file)</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
