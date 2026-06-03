/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Product } from "../types";
import { X, ShieldAlert, Star, ShoppingBag, Plus, Minus, Tag, HelpCircle } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  cartQuantities: Record<string, number>;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  cartQuantities
}: ProductDetailModalProps) {
  if (!product) return null;

  const [localQuantity, setLocalQuantity] = useState(1);
  const currentQuantityInCart = cartQuantities[product.id] || 0;

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  const handleAddToCart = () => {
    onAddToCart(product, localQuantity);
    setLocalQuantity(1); // Reset
    onClose();
  };

  return (
    <div id="product-detail-modal-overlay" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div id="product-detail-modal-card" className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative border border-gray-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-none h-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-xs text-gray-500 hover:text-emerald-950 rounded-full shadow-md transition hover:scale-105 cursor-pointer border border-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50/75 p-6 flex items-center justify-center relative min-h-[250px] md:min-h-[400px]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[280px] md:max-h-[350px] object-contain mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          {product.prescriptionRequired && (
            <div className="absolute bottom-4 left-4 bg-rose-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ORDONNANCE OBLIGATOIRE</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[600px] font-sans">
          
          <div>
            {/* Brand */}
            <div className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-1.5 inline-block bg-emerald-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </div>

            {/* Title */}
            <h2 className="text-xl font-extrabold text-slate-900 leading-snug mb-3 pr-6">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{product.rating} / 5</span>
              <span className="text-xs text-gray-400 font-medium">({product.reviewsCount} avis certifiés)</span>
            </div>

            {/* Details & Specifications */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Format</span>
                <p className="text-sm font-semibold text-gray-800">{product.size}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description du produit</span>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  {product.description}
                </p>
              </div>

              {product.prescriptionRequired && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] text-rose-800 font-medium whitespace-normal">
                    <span className="font-bold block">Notice réglementaire</span>
                    Ce produit est un médicament sous prescription médicale ordonnée par votre médecin. Vous devrez téléverser une ordonnance valide dans votre espace client pour finaliser son achat.
                  </div>
                </div>
              )}

              {/* Tags / concerns */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Besoins associés</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.concern.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 py-1 px-2.5 rounded-full flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Add block */}
          <div className="border-t border-gray-100 pt-5 mt-auto">
            <div className="flex items-end justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-semibold mb-0.5">Prix unitaire</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-emerald-950 font-mono">
                    {product.price.toFixed(2)}€
                  </span>
                  {hasDiscount && (
                    <span className="text-xs line-through text-gray-400 font-mono font-bold">
                      {product.oldPrice!.toFixed(2)}€
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-emerald-700">
                ✔️ En stock à la pharmacie
              </div>
            </div>

            {/* Quantity Selector + Add Button */}
            <div className="flex gap-3">
              <div className="flex items-center bg-gray-100 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setLocalQuantity(Math.max(1, localQuantity - 1))}
                  className="w-11 h-11 font-bold flex items-center justify-center hover:bg-gray-200 rounded-l-2xl text-lg cursor-pointer transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 text-sm font-bold font-mono text-gray-800 min-w-[28px] text-center">
                  {localQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setLocalQuantity(localQuantity + 1)}
                  className="w-11 h-11 font-bold flex items-center justify-center hover:bg-gray-200 rounded-r-2xl text-lg cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/15 transition cursor-pointer hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Ajouter • {(product.price * localQuantity).toFixed(2)}€</span>
              </button>
            </div>
            
            {currentQuantityInCart > 0 && (
              <div className="text-[10px] text-emerald-600 font-bold text-center mt-2.5">
                ℹ️ Vous avez déjà {currentQuantityInCart} unité(s) de ce produit dans votre panier.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
