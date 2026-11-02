"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut, Package, Settings } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useClerk, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const cartItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleSignOut = () => {
    signOut();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 z-50">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Fly<span className="text-blue-600">Wears</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
            <Link href="/shop" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Shop</Link>
            <Link href="/collections" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Collections</Link>
            <Link href="/sellers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Sellers</Link>
          </div>

          {/* Right Side Icons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="text-gray-700" size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {isSignedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition-colors" />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={20} />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                          {user?.imageUrl ? (
                            <img src={user.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="text-blue-600" size={20} />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="font-semibold text-gray-900 truncate">{user?.firstName || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link href="/seller" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-gray-700" onClick={() => setIsProfileOpen(false)}>
                            <Package size={18} /><span className="font-medium">Seller Dashboard</span>
                          </Link>
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-gray-700" onClick={() => setIsProfileOpen(false)}>
                            <Settings size={18} /><span className="font-medium">Profile Settings</span>
                          </Link>
                          <button type="button" onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-left border-t border-gray-100 mt-1">
                            <LogOut size={18} /><span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/sign-in">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User className="text-gray-700" size={24} />
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="text-gray-700" size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button 
              type="button"
              className="p-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} className="text-gray-800" /> : <Menu size={24} className="text-gray-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            {/* Added max-h and overflow-y-auto so it scrolls on small screens */}
            <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
              
              {/* Main Links */}
              <Link href="/" className="block py-3.5 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-blue-50 active:bg-blue-200 active:scale-95 transition-all" onClick={() => setIsMenuOpen(false)}>
                🏠 Home
              </Link>
              <Link href="/shop" className="block py-3.5 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-blue-50 active:bg-blue-200 active:scale-95 transition-all" onClick={() => setIsMenuOpen(false)}>
                🛍️ Shop
              </Link>
              <Link href="/collections" className="block py-3.5 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-blue-50 active:bg-blue-200 active:scale-95 transition-all" onClick={() => setIsMenuOpen(false)}>
                 Collections
              </Link>
              <Link href="/sellers" className="block py-3.5 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-blue-50 active:bg-blue-200 active:scale-95 transition-all" onClick={() => setIsMenuOpen(false)}>
                💼 Sellers
              </Link>
              
              {isSignedIn ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {/* User Info Box */}
                  <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-blue-50 rounded-xl border border-blue-100">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <User className="text-blue-700" size={20} />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">{user?.firstName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </div>

                  {/* Account Links */}
                  <Link href="/seller" className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 font-medium bg-gray-50 hover:bg-blue-50 active:bg-blue-200 active:scale-95 transition-all mb-2" onClick={() => setIsMenuOpen(false)}>
                    <Package size={20} className="text-blue-600" /> Seller Dashboard
                  </Link>
                  
                  {/* PROFILE SETTINGS - Made Very Obvious */}
                  <Link href="/profile" className="flex items-center gap-3 py-3 px-4 rounded-xl text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 active:bg-blue-200 active:scale-95 transition-all border border-blue-100 mb-2" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={20} /> Profile Settings
                  </Link>

                  <button 
                    type="button"
                    onClick={handleSignOut} 
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-600 font-medium bg-red-50 hover:bg-red-100 active:bg-red-200 active:scale-95 transition-all text-left"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/sign-in" className="block py-3.5 px-4 rounded-xl bg-blue-600 text-white text-center font-bold hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all mt-4 shadow-md" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}