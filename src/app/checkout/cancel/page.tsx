"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, ShoppingCart } from "lucide-react";
import useTranslation from "@/hooks/use-translation";

export default function CheckoutCancel() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-700 mb-2">{t('checkout.cancelled')}</h1>
            <p className="text-gray-600">
              {t('checkout.cancelledDesc')}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              {t('checkout.contactSupport')}
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/cart">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('checkout.returnToCart')}
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                {t('checkout.continueShopping')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}