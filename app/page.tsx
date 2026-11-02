"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <main className="min-h-screen">
      <Hero />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProductGrid selectedCategory={selectedCategory} />
    </main>
  );
}