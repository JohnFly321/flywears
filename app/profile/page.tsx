"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Camera, Save, Trash2, Package, Clock, CheckCircle, Truck, ShoppingBag, LogOut } from "lucide-react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "PROCESSING": return "bg-blue-100 text-blue-700 border-blue-200";
    case "SHIPPED": return "bg-purple-100 text-purple-700 border-purple-200";
    case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
    case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING": return <Clock size={16} />;
    case "PROCESSING": return <Package size={16} />;
    case "SHIPPED": return <Truck size={16} />;
    case "DELIVERED": return <CheckCircle size={16} />;
    default: return <Package size={16} />;
  }
};

export default function ProfilePage() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);
  const [pictureError, setPictureError] = useState("");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (activeTab === "orders" && isLoaded) {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const res = await fetch("/api/orders");
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-blue-600 font-semibold animate-pulse">Loading profile...</div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = async (file?: File) => {
    if (!user || !file) return;
    setIsUpdatingPicture(true);
    setPictureError("");
    try {
      await user.setProfileImage({ file });
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      setPictureError("Failed to update profile picture. Please try again.");
    } finally {
      setIsUpdatingPicture(false);
    }
  };

  const handleProfilePictureRemove = async () => {
    if (!user) return;
    setIsUpdatingPicture(true);
    setPictureError("");
    try {
      await user.setProfileImage({ file: null });
    } catch (error) {
      console.error("Failed to remove profile picture:", error);
      setPictureError("Failed to remove profile picture. Please try again.");
    } finally {
      setIsUpdatingPicture(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Tab Navigation */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-2 font-semibold text-sm sm:text-base transition-colors relative flex items-center gap-2 ${
              activeTab === "profile" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={18} /> Profile Details
            {activeTab === "profile" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-2 font-semibold text-sm sm:text-base transition-colors relative flex items-center gap-2 ${
              activeTab === "orders" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package size={18} /> My Orders
            {activeTab === "orders" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* ================= PROFILE TAB ================= */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32" />
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl overflow-hidden">
                    <img src={user?.imageUrl || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                </div>
                <div className="-mt-2 mb-6 flex flex-wrap justify-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100">
                    <Camera size={16} />
                    {isUpdatingPicture ? "Updating..." : user?.hasImage ? "Change picture" : "Add picture"}
                    <input type="file" accept="image/*" className="sr-only" disabled={isUpdatingPicture} onChange={(event) => { void handleProfilePictureChange(event.target.files?.[0]); event.target.value = ""; }} />
                  </label>
                  {user?.hasImage && (
                    <button type="button" onClick={handleProfilePictureRemove} disabled={isUpdatingPicture} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">
                      <Trash2 size={16} /> Remove picture
                    </button>
                  )}
                </div>
                {pictureError && <p role="alert" className="mb-6 text-center text-sm text-red-600">{pictureError}</p>}

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.firstName || "User"} {user?.lastName || ""}</h1>
                  <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>

                {!isEditing ? (
                  <button onClick={() => { setFormData({ firstName: user?.firstName || "", lastName: user?.lastName || "", phone: (user?.unsafeMetadata as any)?.phone || "", address: (user?.unsafeMetadata as any)?.address || "", city: (user?.unsafeMetadata as any)?.city || "" }); setIsEditing(true); }} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-6">
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"><User size={16} className="inline mr-2" /> First Name</label>
                        <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"><User size={16} className="inline mr-2" /> Last Name</label>
                        <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2"><Phone size={16} className="inline mr-2" /> Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="08012345678" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin size={16} className="inline mr-2" /> Address</label>
                      <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none" placeholder="House number, Street name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin size={16} className="inline mr-2" /> City</label>
                      <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" placeholder="Lagos, Abuja, etc." />
                    </div>
                    <div className="flex gap-4">
                      <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-lg font-bold text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Account Status</p>
                      <p className="text-lg font-bold text-green-600">Active</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Email Verified</p>
                      <p className="text-lg font-bold text-green-600">Yes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {isLoadingOrders ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <div className="text-blue-600 font-semibold animate-pulse">Loading your orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see them here!</p>
                <Link href="/shop">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">Go to Shop</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Order ID</p>
                        <p className="font-mono text-sm text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                        <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString("en-NG", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</p>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img src={item.product.images?.[0] || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                          </div>
                          <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-4 bg-blue-50/50 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-2">
                      <Truck size={16} className="text-blue-600" />
                      <span>Delivering to: <strong>{order.deliveryAddress}</strong> | Phone: {order.phoneNumber}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}