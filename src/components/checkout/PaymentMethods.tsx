"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  frame?: string;
}

interface PaymentMethodsProps {
  items: CartItem[];
  customerEmail: string;
  total: number;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentMethods({
  items,
  customerEmail,
  total,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
}: PaymentMethodsProps) {
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "paypal">("stripe");

  // Handle Stripe Payment
  const handleStripeCheckout = async () => {
    if (!items.length) {
      onPaymentError?.("No items in cart");
      return;
    }

    try {
      setIsProcessingStripe(true);
      onPaymentStart?.();

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.image || "",
            frame: item.frame || "",
          })),
          customerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      onPaymentError?.(error.message || "Payment processing failed");
    } finally {
      setIsProcessingStripe(false);
    }
  };

  // PayPal Payment Options
  const paypalCreateOrder = async () => {
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.image || "",
            frame: item.frame || "",
          })),
          customerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create PayPal order");
      }

      return data.orderID;
    } catch (error: any) {
      console.error("PayPal create order error:", error);
      onPaymentError?.(error.message || "Failed to create PayPal order");
      throw error;
    }
  };

  const paypalCaptureOrder = async (orderID: string) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to capture PayPal payment");
      }

      onPaymentSuccess?.(data);
      
      // Redirect to success page
      window.location.href = `/checkout/success?payment=paypal&order_id=${data.mongoOrderId}`;
    } catch (error: any) {
      console.error("PayPal capture error:", error);
      onPaymentError?.(error.message || "Failed to capture PayPal payment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedMethod("stripe")}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === "stripe"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Credit/Debit Card</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Secure payment with Stripe
              </p>
            </button>

            <button
              onClick={() => setSelectedMethod("paypal")}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === "paypal"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.36-.207-.766-.382-1.228-.525 0 .025-.007.052-.013.079-.383 1.96-1.072 3.35-2.41 4.287-.24.168-.52.31-.816.429-.515.2-1.17.337-1.966.337h-.34c-.081-.015-.175-.015-.175-.015-.633-.074-1.065-.495-1.065-.495s-.917.8-.917.8c-.633.633-.917 1.065-.917 1.065s-.8.917-.8.917c-.633.633-1.065.917-1.065.917s-.917.8-.917.8L4.5 21.337H7.076z"/>
                </svg>
                <span className="font-medium">PayPal</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Pay with your PayPal account
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Buttons */}
      <Card>
        <CardContent className="pt-6">
          {selectedMethod === "stripe" ? (
            <div className="space-y-4">
              <Button
                onClick={handleStripeCheckout}
                disabled={isProcessingStripe || !items.length}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                {isProcessingStripe ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${total.toFixed(2)} with Stripe
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                You will be redirected to Stripe for secure payment processing
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  currency: "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "paypal",
                  }}
                  createOrder={paypalCreateOrder}
                  onApprove={(data) => paypalCaptureOrder(data.orderID)}
                  onError={(error) => {
                    console.error("PayPal error:", error);
                    onPaymentError?.("PayPal payment failed");
                  }}
                  onCancel={() => {
                    console.log("PayPal payment cancelled");
                  }}
                />
              </PayPalScriptProvider>
              <p className="text-xs text-gray-500 text-center">
                Pay securely with your PayPal account or credit card
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Total Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}