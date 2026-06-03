/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AIChatModal from "./components/AIChatModal";
import AccountTab from "./components/AccountTab";
import AdminPanel from "./components/AdminPanel";
import { Product, CartItem, Prescription, Order, UserProfile, ChatMessage, ProductCategory } from "./types";
import { PRODUCTS_LIST } from "./data/products";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Flame, 
  BadgeHelp,
  Activity,
  Award
} from "lucide-react";

export default function App() {
  // Navigation & View States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all" | "promo">("all");
  const [activeTab, setActiveTab] = useState<"shop" | "account" | "admin">("shop");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "u-996",
    firstName: "Mohamed",
    lastName: "Bouzid",
    email: "bouzidmed1996@gmail.com",
    phone: "06 12 34 56 78",
    address: {
      firstName: "Mohamed",
      lastName: "Bouzid",
      addressLine1: "23 Rue du Général de Gaulle",
      zipCode: "95880",
      city: "Enghien-les-Bains",
      phone: "06 12 34 56 78"
    },
    prescriptions: [
      {
        id: "presc-882",
        fileName: "ordonnance_medicale_mars2026.pdf",
        uploadDate: "12/03/2026",
        status: "Valide",
        imageUrl: "",
        doctorName: "Dr. Catherine Mercier",
        patientName: "Mohamed Bouzid"
      }
    ],
    orders: [
      {
        id: "CMD-829104",
        date: "02/06/2026",
        items: [
          {
            product: PRODUCTS_LIST[0], // Effaclar
            quantity: 2
          },
          {
            product: PRODUCTS_LIST[9], // Zinc Solgar
            quantity: 1
          }
        ],
        total: 39.70,
        deliveryMethod: "collect",
        storeLocation: "Pharmacie Principale d'Enghien (23 Rue du Général de Gaulle, 95880 Enghien-les-Bains)",
        paymentMethod: "card",
        status: "Prêt pour retrait"
      }
    ],
    isLoggedIn: true
  });

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Derived quantities helper mapping
  const cartQuantities = React.useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const cartCount = cartItems.reduce((acc, current) => acc + current.quantity, 0);

  // AI assistant history State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Synchronize localStorage in simple client sandbox
  useEffect(() => {
    const savedCart = localStorage.getItem("citypharma_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Cart retrieval error:", err);
      }
    }
  }, []);

  const saveCartToLocalStorage = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("citypharma_cart", JSON.stringify(items));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantityChange: number) => {
    const updated = [...cartItems];
    const existingIndex = updated.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const newQty = updated[existingIndex].quantity + quantityChange;
      if (newQty <= 0) {
        updated.splice(existingIndex, 1);
      } else {
        updated[existingIndex].quantity = newQty;
      }
    } else if (quantityChange > 0) {
      updated.push({ product, quantity: quantityChange });
    }

    saveCartToLocalStorage(updated);
  };

  const handleRemoveFromCart = (product: Product) => {
    const updated = cartItems.filter((item) => item.product.id !== product.id);
    saveCartToLocalStorage(updated);
  };

  // Profile auth
  const handleLogin = (email: string, role?: string) => {
    setIsLoggedIn(true);
    setUserRole((role as "user" | "admin") ?? "user");
    setUserProfile((prev) => ({ ...prev, email, isLoggedIn: true }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("user");
    setActiveTab("shop");
    setUserProfile((prev) => ({ ...prev, isLoggedIn: false }));
  };

  // Add a newly uploaded prescription to client center list
  const handleAddPrescriptionField = (presc: Prescription) => {
    setUserProfile((prev) => {
      const updatedPrescs = [presc, ...prev.prescriptions];
      return {
        ...prev,
        prescriptions: updatedPrescs
      };
    });
  };

  // Complete Order Checkout Submit
  const handleCompleteOrder = (order: Order) => {
    setUserProfile((prev) => {
      const updatedOrders = [order, ...prev.orders];
      return {
        ...prev,
        orders: updatedOrders
      };
    });
    // Clear cart
    saveCartToLocalStorage([]);
  };

  // Network advice communication with server custom-built Gemini pipeline
  const handleSendPromptMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };
    
    setChatHistory((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/gemini/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: chatHistory })
      });

      if (!response.ok) {
        throw new Error("Erreur de connexion");
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      };
      setChatHistory((prev) => [...prev, modelMsg]);
    } catch (e: any) {
      console.error(e);
      // Safe medical sandbox fallback guidance if backend key offline
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          role: "model",
          text: "[ATTENTION] Je suis ravi de vous conseiller. En tant que conseiller santé en pharmacie, nos recommandations de premier choix pour votre demande sont les cosmétiques d'origine dermatologique (ex: Cicaplast ou Vichy) ainsi qu'une cure de Zinc ou Magnésium pour renforcer vos défenses.\n\n⚠️ Veuillez consulter les pharmaciens en officine pour toute prescription ou symptômes douloureux persistants.",
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        };
        setChatHistory((prev) => [...prev, fallbackMsg]);
        setIsGenerating(false);
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans select-text">
      
      {/* Citypharma inspired Professional Header component */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab("shop");
          window.scrollTo({ top: 380, behavior: "smooth" });
        }}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenAccount={() => setActiveTab("account")}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        isLoggedIn={isLoggedIn}
        userProfile={{ firstName: userProfile.firstName, lastName: userProfile.lastName }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* SHOP TAB VIEW */}
        {activeTab === "shop" ? (
          <>
            {/* Elegant Skincare Hero banner (Paris Citypharma Style) */}
            <div className="relative overflow-hidden custom-gradient-banner text-white py-14 px-6 md:px-12 text-center md:text-left shadow-lg">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 h-full relative z-10">
                
                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-emerald-300 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-full border border-white/5 tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>L'officine parisienne préférée de parapharmacie</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    Prenez soin de votre peau <span className="text-emerald-300 block sm:inline">&amp; votre vitalité.</span>
                  </h2>
                  <p className="text-xs md:text-sm text-emerald-100 font-medium leading-relaxed">
                    Découvrez plus de 15 000 références de parapharmacie à prix bas garantis : dermo-cosmétique, herboristerie, nutrition sportive, beauté bio et médicaments agréés.
                  </p>
                  
                  {/* Highlight core services */}
                  <div className="grid grid-cols-3 gap-2.5 pt-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <span className="text-emerald-300 text-xs font-bold leading-none block">2h Chrono</span>
                      <span className="text-[10px] text-emerald-105 block mt-0.5 font-medium">Click &amp; Collect</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                      <span className="text-emerald-300 text-xs font-bold leading-none block">Sélection</span>
                      <span className="text-[10px] text-emerald-105 block mt-0.5 font-medium">Par nos pharmaciens</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center cursor-pointer hover:bg-emerald-800 transition" onClick={() => setIsAIChatOpen(true)}>
                      <span className="text-emerald-300 text-xs font-bold leading-none block">IA Conseil</span>
                      <span className="text-[10px] text-emerald-105 block mt-0.5 font-medium">Diag cutané 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Aesthetic Visual Highlight Circle */}
                <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md max-w-xs text-center space-y-3.5">
                  <div className="inline-flex w-10 h-10 bg-emerald-600/60 rounded-full border border-emerald-400 items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">Qualité officinale</span>
                    <p className="text-[11px] text-emerald-100 mt-1 leading-relaxed">
                      Nos pharmaciens contrôlent rigoureusement chaque marque : biodégradabilité, formulations physiologiques sans parfum et micronutriments biodisponibles.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Smart Product Grid component listing with filter mechanics */}
            <ProductGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p, q) => handleAddToCart(p, q)}
              cartQuantities={cartQuantities}
            />
          </>
        ) : activeTab === "admin" ? (
          <AdminPanel
            onBack={() => setActiveTab("shop")}
            onLogout={handleLogout}
          />
        ) : (
          /* ACCOUNT VIEWS */
          <AccountTab
            userProfile={userProfile}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onAddPrescription={handleAddPrescriptionField}
            onOpenAdmin={() => setActiveTab("admin")}
          />
        )}
      </main>

      {/* FOOTER GENERAL LEGAL INFOS */}
      <footer className="bg-emerald-950 text-white font-sans text-xs border-t border-emerald-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm uppercase text-emerald-300 tracking-wider">Pharmacie Principale d&apos;Enghien</h4>
            <p className="text-emerald-100 leading-relaxed text-[11px]">
              Votre pharmacie de confiance à Enghien-les-Bains depuis plus de 20 ans. Commandez vos soins, médicaments et ordonnances en ligne — retrait express en pharmacie ou livraison à domicile sous 24h.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-sm uppercase text-emerald-300 tracking-wider">Informations pratiques</h4>
            <div className="text-[11px] text-emerald-100 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>23 Rue du Général de Gaulle, 95880 Enghien-les-Bains</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Lun–Sam : 9h00 – 20h30 · Dim : Fermé</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>+33 1 34 12 61 23 · Agrément ARS Val-d&apos;Oise</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 col-span-1 sm:col-span-2">
            <h4 className="font-extrabold text-sm uppercase text-emerald-300 tracking-wider">Mentions Légales de Santé publique</h4>
            <p className="text-emerald-100 font-medium text-[10px] leading-relaxed">
              ⚠️ ATTENTION : L'achat de médicaments en ligne est réglementé. Ne dépassez pas les doses recommandées de paracétamol et d'anti-inflammatoires. En cas de surdosage, consultez immédiatement votre médecin. Les conseils de notre assistant IA ne sauraient remplacer un entretien diagnostique physique ou une ordonnance médicale formalisée.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-emerald-900 text-emerald-250 border border-emerald-800 text-[9px] font-bold uppercase py-0.5 px-2 rounded-md">Certifié HDS</span>
              <span className="bg-emerald-900 text-emerald-250 border border-emerald-800 text-[9px] font-bold uppercase py-0.5 px-2 rounded-md">Ordre des Pharmaciens</span>
              <span className="bg-emerald-900 text-emerald-250 border border-emerald-800 text-[9px] font-bold uppercase py-0.5 px-2 rounded-md">Vente Agréée ARS</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-emerald-300 text-[11px] gap-2">
          <span>© 2026 Pharmacie Principale d&apos;Enghien — Enghien-les-Bains (95). Tous droits réservés.</span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Conditions Générales de Vente</span>
            <span className="hover:underline cursor-pointer">Protection des Données</span>
          </div>
        </div>
      </footer>

      {/* MODALS GATEWAY ACCORDING TO USER INTERACTIONS */}
      
      {/* Product Zoom Modal detail */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        cartQuantities={cartQuantities}
      />

      {/* Cart Slider drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateCartQuantity={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-step Checkout secure interface */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        userPrescriptions={userProfile.prescriptions}
        onAddPrescription={handleAddPrescriptionField}
        onCompleteOrder={handleCompleteOrder}
        userEmail={userProfile.email}
      />

      {/* AI Pharmacist Chat helper */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        chatHistory={chatHistory}
        onSendMessage={handleSendPromptMessage}
        isGenerating={isGenerating}
      />

    </div>
  );
}
