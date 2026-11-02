"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link"; // Import Link for navigation
import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    beginCheckout,
  } = useCart();

  // Calculate total price
  const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-600" /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <ShoppingBag size={48} className="mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some amazing products to get started!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-xl bg-gray-100" 
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.seller}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-blue-600">{formatPrice(item.price)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Button */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
                </div>
                
                {/* THIS IS THE MAGIC PART: Linking to the Checkout Page */}
                <Link
                  href="/checkout"
                  onClick={() => {
                    beginCheckout();
                    setIsCartOpen(false);
                  }}
                >
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}