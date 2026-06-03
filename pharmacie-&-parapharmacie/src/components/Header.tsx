/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  User, 
  ShoppingBag, 
  Sparkles, 
  Bot, 
  Store, 
  ChevronRight,
  Menu,
  X,
  Plus,
  ArrowRight
} from "lucide-react";
import { Product, ProductCategory } from "../types";
import { PRODUCTS_LIST, STORES_LIST } from "../data/products";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (category: ProductCategory | "all" | "promo") => void;
  selectedCategory: string;
  onSelectProduct: (product: Product) => void;
  onOpenAccount: () => void;
  onOpenAIChat: () => void;
  isLoggedIn: boolean;
  userEmail: string;
}

export default function Header({
  cartCount,
  onOpenCart,
  onSelectCategory,
  selectedCategory,
  onSelectProduct,
  onOpenAccount,
  onOpenAIChat,
  isLoggedIn,
  userEmail
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedStore, setSelectedStore] = useState(STORES_LIST[0]);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = PRODUCTS_LIST.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.concern.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      {/* Top Banner Area */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-1.5 font-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-300 font-medium">
            <Store className="w-3.5 h-3.5" />
            <span>Mon magasin :</span>
          </div>
          <div className="relative">
            <button 
              id="store-selector-btn"
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="hover:text-emerald-300 font-medium cursor-pointer flex items-center gap-1 transition"
            >
              <span className="max-w-[200px] truncate sm:max-w-none">{selectedStore}</span>
              <span className="text-[9px]">▼</span>
            </button>
            {isStoreDropdownOpen && (
              <div id="store-dropdown" className="absolute left-0 mt-2 w-72 bg-white text-gray-800 shadow-xl rounded-lg border border-gray-100 z-50 overflow-hidden py-1">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-emerald-950">
                  Sélectionner une pharmacie de retrait
                </div>
                {STORES_LIST.map((store) => (
                  <button
                    key={store}
                    onClick={() => {
                      setSelectedStore(store);
                      setIsStoreDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900 transition flex items-center justify-between ${
                      selectedStore === store ? "bg-emerald-50 text-emerald-950 font-medium border-l-2 border-emerald-600" : ""
                    }`}
                  >
                    <span>{store}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-emerald-300 text-[11px] font-sans">
          <span>⚡ Click & Collect en 2h gratuit</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">📦 Livraison Colissimo offerte dès 49€</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 font-sans">
        
        {/* Logo */}
        <div 
          id="brand-logo"
          onClick={() => onSelectCategory("all")} 
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-600/20 group-hover:bg-emerald-700 transition">
            <span>+</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
          </div>
          <div className="leading-none">
            <span className="text-lg font-extrabold tracking-tight text-emerald-950 block">PARIS<span className="text-emerald-600">PHARMA</span></span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block transition group-hover:text-emerald-700">Parapharmacie & Soins</span>
          </div>
        </div>

        {/* Predictive Autocomplete Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <input
              id="search-input-desktop"
              type="text"
              placeholder="Rechercher une marque, un besoin (ex: La Roche-Posay, acné, fatigue)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div id="search-autocomplete-drawer" className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 py-1.5">
              {searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Produits correspondants
                  </div>
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="px-4 py-2.5 hover:bg-emerald-50/50 cursor-pointer flex items-center gap-3 transition"
                    >
                      <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-md border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">{p.brand}</div>
                        <div className="text-xs font-semibold text-gray-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-500 font-medium">Format: {p.size}</div>
                      </div>
                      <div className="text-xs font-bold text-emerald-600 font-mono">
                        {p.price.toFixed(2)}€
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 mt-1 px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 380, behavior: "smooth" });
                        setIsSearchFocused(false);
                      }}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir tous les résultats de recherche</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 py-8 text-center text-xs text-gray-500">
                  Aucun produit trouvé pour "<span className="font-semibold text-gray-800">{searchQuery}</span>".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Corner Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          
          {/* AI Helper Quick Trigger */}
          <button
            id="ai-consultation-quick-btn"
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold transition shadow-xs cursor-pointer border border-emerald-100 relative group animate-pulse-slow"
          >
            <Bot className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Conseil Pharmacien (IA)</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Account Button */}
          <button
            id="user-account-btn"
            onClick={onOpenAccount}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-full transition text-gray-700 hover:text-emerald-600 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center relative shadow-xs overflow-hidden">
              {isLoggedIn ? (
                <div className="w-full h-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  B
                </div>
              ) : (
                <User className="w-4 h-4 text-gray-500 group-hover:scale-105 transition-transform" />
              )}
            </div>
            <div className="text-left hidden lg:block">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Mon Espace</span>
              <span className="text-xs font-bold text-gray-800 tracking-tight leading-none block">
                {isLoggedIn ? "M. Bouzid" : "Se connecter"}
              </span>
            </div>
          </button>

          {/* Cart Trigger */}
          <button
            id="shopping-cart-drawer-trigger"
            onClick={onOpenCart}
            className="p-2 sm:p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition flex items-center justify-center shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 relative cursor-pointer"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span id="cart-indicator-badge" className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-emerald-950 font-extrabold text-[10px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center animate-bounce-short">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories & Navigation Menu Strip */}
      <div className="bg-slate-50 border-t border-gray-100 py-1.5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto flex items-center gap-1.5 sm:gap-3 text-xs md:text-sm whitespace-nowrap scrollbar-none font-sans font-medium">
          
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-bold ${
              selectedCategory === "all"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            Tous nos produits
          </button>

          <button
            onClick={() => onSelectCategory("skincare")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-semibold ${
              selectedCategory === "skincare"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            Visage & Corps
          </button>

          <button
            onClick={() => onSelectCategory("haircare")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-semibold ${
              selectedCategory === "haircare"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            Cheveux
          </button>

          <button
            onClick={() => onSelectCategory("baby")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-semibold ${
              selectedCategory === "baby"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            Bébé et Maman
          </button>

          <button
            onClick={() => onSelectCategory("nutrition")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-semibold ${
              selectedCategory === "nutrition"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            Vitamines & Beauté bio
          </button>

          <button
            onClick={() => onSelectCategory("hygiene")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-semibold ${
              selectedCategory === "hygiene"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            Hygiène & Secours
          </button>

          <button
            onClick={() => onSelectCategory("medication")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-semibold flex items-center gap-1 ${
              selectedCategory === "medication"
                ? "bg-emerald-600 text-white"
                : "text-rose-600 hover:bg-rose-50"
            }`}
          >
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
            <span>Pharmacie / Médicaments</span>
          </button>

          <button
            onClick={() => onSelectCategory("promo")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-1 ${
              selectedCategory === "promo" ? "bg-amber-100 text-amber-950" : ""
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Offres Stars 🌟</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
