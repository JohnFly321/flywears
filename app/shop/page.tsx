"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation"; // NEW: Import this
import ProductGrid from "@/components/ProductGrid";

const categories = ["All", "Bags", "Clothes", "Shoes", "Accessories", "Sportswear"];

export default function ShopPage() {
  const searchParams = useSearchParams(); // NEW: Hook to read URL
  
  // NEW: Automatically set the category based on the link clicked
  const categoryFromUrl = searchParams.get('category') || "All";
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState("");

  // Update category if the URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            The FlyWears Shop
          </h1>
          <p className="text-xl text-gray-600">
            Discover our latest collections and best sellers.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-12 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        <ProductGrid selectedCategory={selectedCategory} searchTerm={searchTerm} />
        
      </div>
    </div>
  );
}