"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = ["All", "Bags", "Clothes", "Shoes"];

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => onSelectCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-semibold text-lg transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}