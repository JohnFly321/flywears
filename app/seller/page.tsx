"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, CheckCircle, AlertCircle, Sparkles, Package } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";


export default function SellerDashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-blue-600 font-semibold">Loading...</div></div>;
  if (!isSignedIn) { router.push('/sign-in'); return null; }

  const handleAiGenerate = async () => {
    const nameInput = (document.querySelector('input[name="name"]') as HTMLInputElement)?.value;
    const categoryInput = (document.querySelector('select[name="category"]') as HTMLSelectElement)?.value;
    
    if (!nameInput || !categoryInput) {
      setMessage({ type: 'error', text: 'Please enter a Product Name and select a Category first!' });
      return;
    }

    setIsAiLoading(true);
    setMessage({ type: 'success', text: '✨ AI is writing your description...' });
    
    try {
      const res = await fetch('/api/ai-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, category: categoryInput }),
      });
      const data = await res.json();
      
      if (data.description) {
        const textarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = data.description;
          setMessage({ type: 'success', text: '✅ Description generated successfully!' });
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to generate description.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      price: formData.get("price"),
      description: formData.get("description"),
      category: formData.get("category"),
      images: uploadedImages.join(","),
      sizes: formData.get("sizes"),
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product uploaded successfully!' });
        (e.target as HTMLFormElement).reset();
        setUploadedImages([]);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
          <Link href="/seller/orders" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6">
            <Package size={18} />
            View My Orders
          </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-full"><Upload className="text-blue-600" size={24} /></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">List your wears for thousands of buyers to see.</p>
            </div>
          </div>

          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g., Classic Leather Bag" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₦)</label>
                <input name="price" type="number" required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g., 45000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select name="category" required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                  <option value="">Select Category</option>
                  <option value="Bags">Bags</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Sportswear">Sportswear</option>
                </select>
              </div>
            </div>

            {/* --- AI DESCRIPTION SECTION --- */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiLoading}
                  className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-md disabled:opacity-50"
                >
                  <Sparkles size={14} /> {isAiLoading ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea 
                name="description" 
                required 
                rows={4} 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" 
                placeholder="Describe the product or let AI do it for you..." 
              />
            </div>
            {/* --------------------------------- */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center">
                <UploadButton
                  endpoint="productImage"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((file) => file.url);
                    setUploadedImages(urls);
                    setMessage({ type: 'success', text: `Successfully uploaded ${res.length} image(s)!` });
                  }}
                  onUploadError={(error: Error) => {
                    setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
                  }}
                  className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:text-white ut-button:font-semibold ut-button:rounded-full"
                />
                {uploadedImages.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {uploadedImages.map((url, i) => (
                      <img key={i} src={url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sizes <span className="text-gray-400 font-normal">(Comma separated)</span></label>
              <input name="sizes" required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="e.g., S, M, L" />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoading || uploadedImages.length === 0} className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>) : (<><Upload size={20} /> Publish Product</>)}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}