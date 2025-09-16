"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Package, Settings, ShoppingBag } from "lucide-react";
import useTranslation from "@/hooks/use-translation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const accountMenuItems = [
    {
      title: t('account.profile'),
      description: t('account.profileDesc'),
      icon: User,
      href: "/account/profile",
    },
    {
      title: t('account.orders'),
      description: t('account.ordersDesc'),
      icon: Package,
      href: "/account/orders",
    },
    {
      title: t('account.gallery'),
      description: t('account.galleryDesc'),
      icon: ShoppingBag,
      href: "/account/gallery",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">{t('account.title')}</h1>
        <p className="text-gray-600">
          {t('account.welcome')}, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountMenuItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <item.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {(session.user as any)?.role === "admin" && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Admin Panel</h2>
          <Link href="/admin">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
