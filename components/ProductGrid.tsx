"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  seller: { name: string } | null;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

interface ProductGridProps {
  selectedCategory: string;
  searchTerm?: string;
}

export default function ProductGrid({ selectedCategory, searchTerm = "" }: ProductGridProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Build URL with both category and search
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const url = `/api/products?${params.toString()}`;
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sellerName = product.seller?.name || 'FlyWears Store';

    addToCart({
      id: product.id, 
      name: product.name,
      price: product.price,
      image: product.images[0],
      seller: sellerName,
    });
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white min-h-[400px] flex items-center justify-center">
        <div className="text-blue-600 font-semibold animate-pulse">Loading amazing products...</div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500 text-lg">No products found in this category.</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600">
            Curated picks from our top sellers
          </p>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const sellerName = product.seller?.name || 'FlyWears Store';
            
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <motion.img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart size={20} className="text-gray-700" />
                    </motion.button>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {sellerName}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingBag size={18} />
                        Add
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}