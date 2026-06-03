/**
 * Header — Pharmacie de Paris, Enghien-les-Bains
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Search, User, ShoppingBag, Bot, ChevronRight, X, MapPin, Phone
} from "lucide-react";
import { Product, ProductCategory } from "../types";
import { PRODUCTS_LIST, PHARMACY } from "../data/products";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectCategory: (category: ProductCategory | "all" | "promo") => void;
  selectedCategory: string;
  onSelectProduct: (product: Product) => void;
  onOpenAccount: () => void;
  onOpenAIChat: () => void;
  isLoggedIn: boolean;
  userProfile?: { firstName?: string; lastName?: string };
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
  userProfile,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      setSearchResults(
        PRODUCTS_LIST.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.concern.some((c) => c.toLowerCase().includes(q))
        ).slice(0, 6)
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = userProfile
    ? `${userProfile.firstName?.[0] ?? ""}${userProfile.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* ── Top info bar ─────────────────────────────────────────────── */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-1.5">
        <div className="flex items-center gap-4 text-emerald-200">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            6 bis rue du Départ · 95880 Enghien-les-Bains
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <a href="tel:0134128073" className="hover:text-white transition">01 34 12 80 73</a>
          </span>
        </div>
        <div className="flex items-center gap-3 text-emerald-300 text-[11px] font-medium">
          <span>⚡ Click &amp; Collect en 2h</span>
          <span className="hidden md:inline text-emerald-700">|</span>
          <span className="hidden md:inline">📦 Livraison offerte dès 49 €</span>
        </div>
      </div>

      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onSelectCategory("all")}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md group-hover:bg-emerald-700 transition">
            +
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          </div>
          <div className="leading-none">
            <span className="text-base font-extrabold tracking-tight text-emerald-950 block">
              Pharmacie<span className="text-emerald-600"> de Paris</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 group-hover:text-emerald-600 transition">
              Enghien-les-Bains
            </span>
          </div>
        </button>

        {/* Search bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un produit, une marque, un besoin…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {isSearchFocused && searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Résultats ({searchResults.length})
                  </div>
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { onSelectProduct(p); setIsSearchFocused(false); setSearchQuery(""); }}
                      className="w-full px-4 py-2.5 hover:bg-emerald-50 flex items-center gap-3 transition text-left"
                    >
                      <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase">{p.brand}</div>
                        <div className="text-xs font-semibold text-gray-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-400">{p.size}</div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 flex-shrink-0">{p.price.toFixed(2)} €</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 px-4 py-2 text-center">
                    <button onClick={() => { window.scrollTo({ top: 380, behavior: "smooth" }); setIsSearchFocused(false); }}
                      className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1">
                      Voir tous les résultats <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4 py-6 text-center text-xs text-gray-500">
                  Aucun résultat pour <strong>"{searchQuery}"</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* AI chat */}
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold transition border border-emerald-100 relative"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Conseil IA</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Account */}
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full transition group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
              {isLoggedIn ? (
                <div className="w-full h-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {initials || "M"}
                </div>
              ) : (
                <User className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <div className="hidden lg:block text-left leading-none">
              <span className="text-[10px] text-gray-400 font-semibold uppercase block">Mon espace</span>
              <span className="text-xs font-bold text-gray-800 block">
                {isLoggedIn ? (userProfile?.firstName ?? "Mon compte") : "Se connecter"}
              </span>
            </div>
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition relative shadow-md"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-emerald-950 font-extrabold text-[10px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Categories nav ────────────────────────────────────────────── */}
      <nav className="bg-slate-50 border-t border-gray-100 py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto flex items-center gap-1.5 whitespace-nowrap scrollbar-none text-xs font-medium">
          {[
            { id: "all",        label: "Tous nos produits",        extra: "" },
            { id: "skincare",   label: "Visage & Corps",           extra: "" },
            { id: "haircare",   label: "Cheveux",                  extra: "" },
            { id: "baby",       label: "Bébé et Maman",            extra: "" },
            { id: "nutrition",  label: "Vitamines & Beauté bio",   extra: "" },
            { id: "hygiene",    label: "Hygiène & Secours",        extra: "" },
            { id: "medication", label: "Médicaments",              extra: "text-rose-600" },
            { id: "promo",      label: "⭐ Offres Stars",          extra: "text-amber-600 font-bold" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ProductCategory | "all" | "promo")}
              className={`px-3 py-1.5 rounded-full transition font-semibold ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white"
                  : `text-gray-600 hover:bg-emerald-50 hover:text-emerald-900 ${cat.extra}`
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
