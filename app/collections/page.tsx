"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Shirt, Footprints, ArrowRight } from "lucide-react";
import Link from "next/link";

const collections = [
  {
    name: "Bags",
    description: "Discover our premium collection of handbags, backpacks, and totes.",
    icon: ShoppingBag,
    color: "bg-pink-100 text-pink-600",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
  },
  {
    name: "Clothes",
    description: "Stylish and comfortable apparel for every occasion and season.",
    icon: Shirt,
    color: "bg-blue-100 text-blue-600",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"
  },
  {
    name: "Shoes",
    description: "Step out in style with our curated selection of footwear.",
    icon: Footprints,
    color: "bg-green-100 text-green-600",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated categories. Find exactly what you are looking for.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/shop?category=${collection.name}`}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <motion.img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className={`w-12 h-12 rounded-full ${collection.color} flex items-center justify-center mb-4`}>
                      <collection.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{collection.name}</h3>
                    <p className="text-gray-600 flex-1">{collection.description}</p>
                    
                    {/* Professional Button */}
                    <div className="mt-6">
                      <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold group-hover:bg-blue-700 transition-all group-hover:translate-x-1 shadow-md hover:shadow-lg">
                        Shop {collection.name} <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}