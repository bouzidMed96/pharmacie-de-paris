/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Product } from "../types";
import { Star, ShoppingCart, ShieldAlert, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  cartQuantities: Record<string, number>;
  key?: React.Key;
}

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  cartQuantities
}: ProductCardProps) {
  const currentQuantityInCart = cartQuantities[product.id] || 0;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) 
    : 0;

  return (
    <div id={`product-card-${product.id}`} className="group bg-white rounded-2xl border border-gray-100/80 shadow-xs hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Badges container */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="bg-amber-500 text-white font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm animate-pulse-slow">
            -{discountPercent}% OFF
          </span>
        )}
        {product.prescriptionRequired ? (
          <span className="bg-rose-500 text-white font-extrabold text-[9px] tracking-wide uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-rose-600">
            <ShieldAlert className="w-3 h-3 flex-shrink-0" />
            <span>Ordonnance</span>
          </span>
        ) : (
          <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[9px] tracking-wide uppercase px-2.5 py-1 rounded-full border border-emerald-100">
            Vente Libre
          </span>
        )}
      </div>

      {/* Picture Trigger */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="aspect-square w-full bg-gray-50/50 relative overflow-hidden cursor-pointer border-b border-gray-50 flex items-center justify-center p-3 sm:p-5"
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/95 text-emerald-950 font-bold text-xs py-2 px-4 rounded-full shadow-md backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Aperçu rapide
          </span>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="p-4 flex-1 flex flex-col justify-between font-sans">
        
        {/* Brand & Stars */}
        <div>
          <div className="flex justify-between items-center gap-1 mb-1.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[150px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span className="text-xs font-bold text-gray-700">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-emerald-700 cursor-pointer min-h-[40px] leading-snug mb-1"
          >
            {product.name}
          </h3>

          <div className="text-[11px] text-gray-400 font-medium mb-3">
            Format: {product.size} {product.concern.length > 0 && `• ${product.concern[0]}`}
          </div>
        </div>

        {/* Pricing tag & CTA Purchase button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50 mt-auto">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] line-through text-gray-400 font-medium font-mono leading-none">
                {product.oldPrice!.toFixed(2)}€
              </span>
            )}
            <span className="text-base font-extrabold text-emerald-950 font-mono tracking-tight leading-none">
              {product.price.toFixed(2)}€
            </span>
          </div>

          {currentQuantityInCart > 0 ? (
            <div className="flex items-center bg-emerald-50 text-emerald-900 rounded-full border border-emerald-100">
              <button
                onClick={() => onAddToCart(product, -1)}
                className="w-8 h-8 font-bold flex items-center justify-center hover:bg-emerald-100 rounded-full text-sm cursor-pointer transition"
              >
                -
              </button>
              <span className="px-1 text-xs font-bold font-mono text-emerald-950 min-w-[14px] text-center">
                {currentQuantityInCart}
              </span>
              <button
                onClick={() => onAddToCart(product, 1)}
                className="w-8 h-8 font-bold flex items-center justify-center hover:bg-emerald-100 rounded-full text-sm cursor-pointer transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product, 1)}
              disabled={product.stock <= 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                product.stock <= 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/15 group-hover:scale-105"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
