"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, Mail } from "lucide-react";
import useTranslation from "@/hooks/use-translation";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
    </div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Dummy simulation for order details
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              {t("checkout.success")}
            </h1>
            <p className="text-gray-600">{t("checkout.successDesc")}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>{t("checkout.emailSent")}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Package className="w-5 h-5" />
              <span>{t("checkout.orderProcessed")}</span>
            </div>
          </div>

          {sessionId && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <strong>{t("checkout.orderId")}:</strong> {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link href="/account/orders">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                {t("checkout.viewOrders")}
              </Button>
            </Link>

            <Link href="/shop">
              <Button variant="outline" className="w-full">
                {t("checkout.continueShopping")}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
