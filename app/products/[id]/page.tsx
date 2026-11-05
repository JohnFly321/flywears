"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  sizes: string[];
  seller: {
    name: string;
  } | null;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-blue-600 font-semibold animate-pulse">
            Loading product...
          </div>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  // Fetch product from database
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      seller: product.seller?.name || 'FlyWears Store',
    });
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-blue-600 font-semibold animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const sellerName = product.seller?.name || 'FlyWears Store';

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-sm"
        >
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Shop
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images[selectedImage] || 'https://via.placeholder.com/800'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg"
              >
                <Heart size={24} className="text-gray-700" />
              </motion.button>
            </div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Seller & Category */}
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                {sellerName}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-full font-semibold transition-all border-2 ${
                        selectedSize === size
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="inline-flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                <motion.button
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-700 transition-colors"
                >
                  <Minus size={20} />
                </motion.button>
                <span className="px-6 text-xl font-semibold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-700 transition-colors"
                >
                  <Plus size={20} />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag size={24} />
              Add to Cart - {formatPrice(product.price * quantity)}
            </motion.button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck size={24} className="mx-auto text-blue-600 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto text-blue-600 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw size={24} className="mx-auto text-blue-600 mb-2" />
                <p className="text-sm text-gray-600 font-medium">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}