"use client";

import { motion } from "framer-motion";
import { Store, TrendingUp, Users, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Massive Audience",
    description: "Reach thousands of potential buyers looking for premium fashion.",
    icon: Users,
  },
  {
    title: "Easy Management",
    description: "Upload products, manage orders, and track your sales effortlessly.",
    icon: Store,
  },
  {
    title: "Secure Payments",
    description: "Get paid reliably and securely for every item you sell.",
    icon: Shield,
  },
  {
    title: "Grow Your Brand",
    description: "Build your reputation and grow your fashion business with us.",
    icon: TrendingUp,
  },
];

export default function SellersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Become a FlyWears Seller
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Turn your fashion passion into profit. Join our marketplace and start selling to thousands of customers today.
            </p>
            <Link href="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:bg-gray-100 transition-colors shadow-xl"
              >
                Start Selling Today <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Sell on FlyWears?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to run a successful online fashion business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of sellers already making money on FlyWears.
          </p>
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Create Seller Account
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}