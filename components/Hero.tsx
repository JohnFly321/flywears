"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 1. Stunning Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80" 
          alt="FlyWears Fashion Background" 
          className="w-full h-full object-cover"
        />
        {/* 2. Elegant Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* 3. Glassmorphism Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-400 uppercase bg-blue-900/30 border border-blue-500/30 rounded-full backdrop-blur-md">
            Premium Fashion Marketplace
          </span>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Everyday Style
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
            Discover curated collections from top independent sellers. 
            Premium bags, clothing, shoes, and accessories delivered to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              >
                Shop Now <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/sellers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg backdrop-blur-md hover:bg-white/20 transition-all"
              >
                Start Selling
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}