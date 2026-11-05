
"use client";

export const dynamic = 'force-dynamic';

import {
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";

import { motion } from "framer-motion";

import {
  Truck,
  CreditCard,
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  Lock,
} from "lucide-react";

import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { useUser } from "@clerk/nextjs";
import { usePaystackPayment } from "react-paystack";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function CheckoutPage() {
  const { checkoutSessionId } = useCart();

  return <CheckoutSession key={checkoutSessionId} />;
}

function CheckoutSession() {
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const paymentLock = useRef(false);
  const orderLock = useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  // CALCULATE TOTALS
  const total = cartItems.reduce(
    (acc, item) =>
      acc + item.price * (item.quantity || 1),
    0
  );

  const deliveryFee = 2000;

  const grandTotal =
    total + (cartItems.length > 0 ? deliveryFee : 0);

  // PAYSTACK CONFIGURATION
  const config = useMemo(
    () => ({
      reference: `FLY-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      email:
        user?.emailAddresses[0]?.emailAddress ||
        "customer@flywears.com",
      amount: grandTotal * 100,
      publicKey:
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    }),
    [grandTotal, user]
  );

  // SAVE ORDER AFTER PAYSTACK SUCCESS
  const onSuccess = useCallback(
    async (response: any) => {
      if (orderLock.current) return;

      orderLock.current = true;
      paymentLock.current = false;

      setIsProcessing(true);

      try {
        const orderItems = cartItems.map((item) => ({
          id: item.id.toString(),
          quantity: item.quantity || 1,
          price: item.price,
        }));

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: orderItems,
            totalAmount: grandTotal,
            deliveryAddress: formData.address,
            phoneNumber: formData.phone,
            paymentReference: response.reference,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(
            result.error || "Failed to save order"
          );
        }

        // ONLY CLEAR CART AFTER ORDER SAVES
        clearCart();

        setOrderPlaced(true);

      } catch (error: any) {
        console.error("Order creation error:", error);

        alert(
          `Payment successful, but we could not save your order: ${error.message}. Please contact support with your payment reference: ${response.reference}`
        );

      } finally {
        setIsProcessing(false);
      }
    },
    [cartItems, grandTotal, formData, clearCart]
  );

  // PAYSTACK CLOSE CALLBACK
  const onClose = useCallback(() => {
    paymentLock.current = false;
    setIsProcessing(false);
  }, []);

  // INITIALIZE PAYSTACK
  const initializePayment = usePaystackPayment(config);

  // HANDLE PAYMENT BUTTON
  const handlePayClick = () => {
    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!formData.address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (paymentLock.current || isProcessing) {
      return;
    }

    if (
      !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    ) {
      alert("Paystack public key is missing.");
      return;
    }

    paymentLock.current = true;
    setIsProcessing(true);

    try {
      initializePayment({
        onSuccess,
        onClose,
      });
    } catch (error) {
      console.error("Payment initialization error:", error);

      paymentLock.current = false;
      setIsProcessing(false);

      alert("Unable to initialize payment. Please try again.");
    }
  };

  // HANDLE INPUT CHANGES
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // PAYMENT SUCCESS SCREEN
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
            }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle
              className="text-green-600"
              size={40}
            />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h2>

          <p className="text-gray-600 mb-8">
            Thank you for shopping with FlyWears.
            Your order has been received.
          </p>

          <Link
            href="/profile"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </Link>
        </motion.div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <ShoppingBag
            className="mx-auto text-gray-400 mb-4"
            size={64}
          />

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>

          <Link
            href="/shop"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors mt-4"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  // MAIN CHECKOUT PAGE
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/shop"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Shop
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* DELIVERY AND PAYMENT FORM */}
          <div className="lg:col-span-2">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl shadow-sm"
            >

              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck
                  className="text-blue-600"
                  size={24}
                />
                Delivery Details
              </h2>

              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>

                    <input
                      name="fullName"
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      name="phone"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="08012345678"
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                    placeholder="House number, Street name, City, State"
                  />
                </div>

              </div>

              {/* PAYMENT METHOD */}
              <div className="mt-8 pt-6 border-t border-gray-200">

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard
                    className="text-blue-600"
                    size={24}
                  />
                  Payment Method
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 text-sm flex items-start gap-3">

                  <Lock
                    size={18}
                    className="mt-0.5 flex-shrink-0"
                  />

                  <p>
                    Your payment is secured by{" "}
                    <strong>Paystack</strong>. For testing,
                    use Paystack test mode.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={handlePayClick}
                disabled={isProcessing}
                className="w-full mt-8 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >

                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay {formatPrice(grandTotal)} Securely
                  </>
                )}

              </button>

            </motion.div>

          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm sticky top-24"
            >

              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />

                    <div className="flex-1">

                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {item.name}
                      </h4>

                      <p className="text-blue-600 font-bold text-sm mt-1">
                        {formatPrice(item.price)}
                      </p>

                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-gray-900 font-bold text-xl pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
