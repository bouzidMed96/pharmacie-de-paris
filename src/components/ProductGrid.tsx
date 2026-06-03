/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Product, ProductCategory } from "../types";
import { PRODUCTS_LIST } from "../data/products";
import ProductCard from "./ProductCard";
import { SlidersHorizontal, ArrowUpDown, Sparkles, AlertCircle, X, Check } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string;
  onSelectCategory: (category: ProductCategory | "all" | "promo") => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  cartQuantities: Record<string, number>;
}

export default function ProductGrid({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  cartQuantities
}: ProductGridProps) {
  // Filters state
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [selectedConcern, setSelectedConcern] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "price-asc" | "price-desc">("rating");
  const [searchQueryLocal, setSearchQueryLocal] = useState("");

  // Extract all available brands
  const brands = useMemo(() => {
    const list = PRODUCTS_LIST.map((p) => p.brand);
    return ["all", ...Array.from(new Set(list))];
  }, []);

  // Extract all unique concerns
  const concerns = useMemo(() => {
    const list = PRODUCTS_LIST.flatMap((p) => p.concern);
    return ["all", ...Array.from(new Set(list))];
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_LIST];

    // 1. Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "promo") {
        result = result.filter((p) => p.oldPrice !== undefined);
      } else {
        result = result.filter((p) => p.category === selectedCategory);
      }
    }

    // 2. Filter by brand
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // 3. Filter by skin concern
    if (selectedConcern !== "all") {
      result = result.filter((p) => p.concern.includes(selectedConcern));
    }

    // 4. Filter by price
    result = result.filter((p) => p.price <= maxPrice);

    // 5. Search local query
    if (searchQueryLocal.trim()) {
      const q = searchQueryLocal.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, selectedBrand, selectedConcern, maxPrice, sortBy, searchQueryLocal]);

  const clearAllFilters = () => {
    setSelectedBrand("all");
    setSelectedConcern("all");
    setMaxPrice(50);
    setSearchQueryLocal("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      
      {/* Category Jumbotron intro */}
      <div className="mb-6 bg-emerald-50/50 rounded-3xl p-5 sm:p-7 border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-emerald-950 capitalize leading-none mb-1.5">
            {selectedCategory === "all" ? "Catalogue Complet" : selectedCategory === "promo" ? "Offres Spéciales Étoiles ✨" : selectedCategory}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Découvrez nos gammes pharmaceutiques certifiées. Origine France garantie, traçabilité pharmaceutique.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start md:self-auto text-xs bg-white py-1 px-3.5 border border-emerald-100 text-emerald-800 rounded-full font-bold shadow-xs">
          <span>{filteredProducts.length} articles trouvés</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filters Sidebar panel */}
        <div className="space-y-5 bg-white p-5 rounded-2xl border border-gray-100/90 shadow-md h-fit">
          
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-black text-emerald-950 text-xs uppercase tracking-wider">
              <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-600" />
              <span>Filtres de recherche</span>
            </div>
            {(selectedBrand !== "all" || selectedConcern !== "all" || maxPrice !== 50 || searchQueryLocal !== "") && (
              <button 
                onClick={clearAllFilters}
                className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Local Search input */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Recherche interne</span>
            <input
              type="text"
              placeholder="Filtrer dans la liste..."
              value={searchQueryLocal}
              onChange={(e) => setSearchQueryLocal(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 rounded-xl py-2 px-3 focus:outline-none transition font-medium"
            />
          </div>

          {/* Brand Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Marques de confiance</span>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === "all" ? "Toutes les marques" : b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Concern Filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Cibles & Besoins</span>
            <div className="relative">
              <select
                value={selectedConcern}
                onChange={(e) => setSelectedConcern(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {concerns.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "Tous les besoins" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Prix maximum</span>
              <span className="text-emerald-700 font-bold font-mono text-xs">{maxPrice}€</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[9px] text-gray-400 font-semibold uppercase">
              <span>2€</span>
              <span>25€</span>
              <span>50€</span>
            </div>
          </div>

        </div>

        {/* Outer Product Listings column */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Sorting row */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 gap-3">
            <span className="text-xs text-gray-500 font-medium">Affichage de <strong>{filteredProducts.length}</strong> produits correspondants</span>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold border border-gray-200 rounded-lg py-1 px-2.5 bg-white text-gray-700 focus:outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="rating">Classer par popularité ⭐</option>
                <option value="price-asc">Prix : du - cher au + cher</option>
                <option value="price-desc">Prix : du + cher au - cher</option>
              </select>
            </div>
          </div>

          {/* Grid listing */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  cartQuantities={cartQuantities}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white rounded-3xl border border-gray-100 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <p className="text-slate-900 font-bold text-sm">Aucun produit ne correspond à vos filtres</p>
                <p className="text-xs text-gray-400 mt-0.5">Essayez d'élargir la fourchette de prix ou de désélectionner les critères de marque.</p>
              </div>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-100 hover:bg-emerald-100 cursor-pointer active:scale-95 transition"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
