/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CartItem, Product } from "../types";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldAlert } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateCartQuantity: (product: Product, change: number) => void;
  onRemoveFromCart: (product: Product) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isEligibleForFreeShipping = subtotal >= 49;
  const shippingCost = subtotal === 0 ? 0 : isEligibleForFreeShipping ? 0 : 4.90;
  const grandTotal = subtotal + shippingCost;
  const remainingForFreeShipping = 49 - subtotal;

  const requiresPrescription = cartItems.some(item => item.product.prescriptionRequired);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end font-sans">
      <div id="cart-drawer-container" className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl relative animate-slide-in">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-800" />
            <h2 className="font-extrabold text-emerald-950">Mon Panier</h2>
            <span className="bg-emerald-600 text-white text-[10px] pb-0.5 px-2 rounded-full font-bold">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Ribbon */}
        {subtotal > 0 && (
          <div className="px-4 py-2 text-center text-xs border-b border-gray-100 font-medium">
            {isEligibleForFreeShipping ? (
              <span className="text-emerald-700">🎉 Félicitations ! Votre livraison est 100% offerte.</span>
            ) : (
              <span className="text-slate-600">
                Plus que <strong className="text-emerald-700 font-mono font-bold">{remainingForFreeShipping.toFixed(2)}€</strong> pour avoir la livraison gratuite.
              </span>
            )}
          </div>
        )}

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 animate-bounce-slow">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-slate-900 font-bold text-sm">Votre panier est vide</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Explorez notre catalogue de parapharmacie et ajoutez des produits pour commencer vos achats.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md cursor-pointer hover:bg-emerald-700 active:scale-95 transition"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.product.id}
                className="flex gap-3 pb-3 border-b border-gray-100 font-sans last:border-b-0"
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-16 h-16 object-contain bg-gray-50/50 rounded-lg p-1 border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wide">{item.product.brand}</div>
                  <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{item.product.name}</h4>
                  <div className="text-[10px] text-gray-400 font-medium mb-1.5 leading-none">Format: {item.product.size}</div>
                  
                  {/* Prescription requirements */}
                  {item.product.prescriptionRequired && (
                    <div className="text-[9px] text-rose-600 font-black tracking-wide uppercase flex items-center gap-1.5 mb-1.5">
                      <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                      <span>Ordonnance obligatoire</span>
                    </div>
                  )}

                  {/* Pricing and Quantity change row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg scale-90 -translate-x-3">
                      <button
                        onClick={() => onUpdateCartQuantity(item.product, -1)}
                        className="w-6 h-6 hover:bg-gray-100 rounded-l-md font-bold text-sm cursor-pointer transition flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="px-2 text-[11px] font-bold font-mono text-gray-800 text-center min-w-[14px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateCartQuantity(item.product, 1)}
                        className="w-6 h-6 hover:bg-gray-100 rounded-r-md font-bold text-sm cursor-pointer transition flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold font-mono text-emerald-950">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(item.product)}
                        className="p-1 hover:text-rose-600 transition text-gray-400 cursor-pointer"
                        title="Retirer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Prescription Link Notification */}
        {requiresPrescription && cartItems.length > 0 && (
          <div className="px-5 py-2.5 bg-red-50 border-t border-b border-red-100 flex gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-rose-800 font-semibold leading-relaxed">
              <span className="font-extrabold block uppercase tracking-wide">Panier Réglementé</span>
              Ce panier contient des médicaments sur ordonnance. Un justificatif médical valide sera requis au moment du paiement.
            </div>
          </div>
        )}

        {/* Totals and checkout call to action */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/60 font-sans space-y-4">
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Sous-total</span>
                <span className="font-mono">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Frais de livraison</span>
                <span className="font-mono">{shippingCost === 0 ? "Offerte" : `${shippingCost.toFixed(2)}€`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-900 pt-1.5 border-t border-gray-200/60 mt-1 font-bold">
                <span>Total à régler</span>
                <span className="font-mono text-emerald-800 text-base">{grandTotal.toFixed(2)}€</span>
              </div>
            </div>

            <button
              id="cart-submit-checkout-btn"
              onClick={onCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 cursor-pointer hover:scale-[1.01] transition duration-200 active:scale-95"
            >
              <span>Passer la commande sécurisée</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium">
              Paiement ultra-sécurisé via SSL 256 bits • Pharmacie agréée ARS
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
