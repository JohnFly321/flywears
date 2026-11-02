export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: string;
  seller: string;
  description: string;
  sizes: string[];
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Leather Bag",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop",
    ],
    category: "Bags",
    seller: "StyleHub",
    description: "Premium handcrafted leather bag with spacious interior and elegant design. Perfect for both casual and formal occasions.",
    sizes: ["Small", "Medium", "Large"],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Premium Running Shoes",
    price: 65000,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
    ],
    category: "Shoes",
    seller: "SneakerWorld",
    description: "Lightweight and durable running shoes designed for maximum comfort and performance. Features advanced cushioning technology.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    rating: 4.9,
    reviews: 256,
  },
  {
    id: 3,
    name: "Designer Jacket",
    price: 95000,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-57dd263e59db?w=800&h=800&fit=crop",
    ],
    category: "Clothes",
    seller: "FashionForward",
    description: "Stylish designer jacket made from premium materials. Features a modern cut and versatile design suitable for any season.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 4,
    name: "Minimalist Backpack",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop",
    ],
    category: "Bags",
    seller: "BagMasters",
    description: "Sleek and functional minimalist backpack. Perfect for daily commute, school, or travel with multiple compartments.",
    sizes: ["One Size"],
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 5,
    name: "Casual Sneakers",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop",
    ],
    category: "Shoes",
    seller: "SneakerWorld",
    description: "Comfortable casual sneakers for everyday wear. Features a breathable upper and flexible sole for all-day comfort.",
    sizes: ["39", "40", "41", "42", "43", "44"],
    rating: 4.5,
    reviews: 312,
  },
  {
    id: 6,
    name: "Cotton T-Shirt",
    price: 15000,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop",
    ],
    category: "Clothes",
    seller: "StyleHub",
    description: "Soft, breathable 100% cotton t-shirt. Features a classic fit and durable fabric that maintains its shape wash after wash.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviews: 445,
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}