"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
  phoneNumber: string;
  items: Array<{
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

export default function SellerOrdersPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    fetchOrders();
  }, [isLoaded, isSignedIn, router]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        const revenue = data.orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-blue-600 font-semibold animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Package className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg font-medium">No orders yet</p>
                <p className="text-sm mt-2">Orders will appear here when customers purchase your products.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Package size={16} />
                        <span>{order.items.length} item(s)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{order.phoneNumber}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Delivery Address:</p>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}