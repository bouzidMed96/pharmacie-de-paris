/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CartItem, Product, Order, Prescription, ShippingAddress } from "../types";
import { STORES_LIST } from "../data/products";
import { 
  X, 
  Store, 
  Truck, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ShieldAlert, 
  CreditCard,
  Upload,
  Lock,
  Loader2,
  CheckCircle,
  FileCheck
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  userPrescriptions: Prescription[];
  onAddPrescription: (presc: Prescription) => void;
  onCompleteOrder: (order: Order) => void;
  userEmail: string;
}

type CheckoutStep = "delivery" | "prescription" | "payment" | "success";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  userPrescriptions,
  onAddPrescription,
  onCompleteOrder,
  userEmail
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const requiresPrescription = cartItems.some(item => item.product.prescriptionRequired);

  // States
  const [step, setStep] = useState<CheckoutStep>("delivery");
  const [deliveryMethod, setDeliveryMethod] = useState<"collect" | "delivery">("collect");
  const [selectedStore, setSelectedStore] = useState(STORES_LIST[0]);
  
  // Shipping form
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "Mohamed",
    lastName: "Bouzid",
    addressLine1: "26 Rue du Four",
    zipCode: "75006",
    city: "Paris",
    phone: "06 12 34 56 78"
  });

  // Prescription attach state
  const [attachedPrescriptionId, setAttachedPrescriptionId] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadingPresc, setUploadingPresc] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "applepay">("card");
  const [cardName, setCardName] = useState("MOHAMED BOUZID");
  const [cardNumber, setCardNumber] = useState("4970 8219 4012 3844");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCvv, setCardCvv] = useState("412");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Calculations
  const shippingCost = deliveryMethod === "collect" ? 0 : (subtotal >= 49 ? 0 : 4.90);
  const totalToPay = subtotal + shippingCost;

  // Drag and drop prescriptions simulation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processMockPrescriptionFile = (fileName: string) => {
    setUploadingPresc(true);
    setTimeout(() => {
      const mockNewPresc: Prescription = {
        id: `presc-${Date.now()}`,
        fileName: fileName || "ordonnance_medicale_upload.pdf",
        uploadDate: new Date().toLocaleDateString("fr-FR"),
        status: "En attente de vérification",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop",
        doctorName: "Dr. Catherine Mercier",
        patientName: `${address.firstName} ${address.lastName}`
      };
      onAddPrescription(mockNewPresc);
      setAttachedPrescriptionId(mockNewPresc.id);
      setUploadingPresc(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processMockPrescriptionFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processMockPrescriptionFile(e.target.files[0].name);
    }
  };

  // Submit delivery form
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresPrescription) {
      setStep("prescription");
    } else {
      setStep("payment");
    }
  };

  // Submit prescription linking
  const handlePrescriptionSubmit = () => {
    if (requiresPrescription && !attachedPrescriptionId) {
      alert("Veuillez sélectionner ou importer une ordonnance pour pouvoir continuer.");
      return;
    }
    setStep("payment");
  };

  // Process sandbox payment simulation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Simulate high-quality 3D secure validation transaction (2 seconds loader)
    setTimeout(() => {
      const finishedOrder: Order = {
        id: `CMD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString("fr-FR"),
        items: [...cartItems],
        total: totalToPay,
        deliveryMethod,
        shippingAddress: deliveryMethod === "delivery" ? address : undefined,
        storeLocation: deliveryMethod === "collect" ? selectedStore : undefined,
        paymentMethod,
        prescriptionId: requiresPrescription ? attachedPrescriptionId : undefined,
        status: "En préparation"
      };
      onCompleteOrder(finishedOrder);
      setCreatedOrder(finishedOrder);
      setProcessingPayment(false);
      setStep("success");
    }, 2500);
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div id="checkout-window-card" className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-gray-100 flex flex-col overflow-hidden max-h-[92vh] font-sans">
        
        {/* Checkout Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/20">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h2 className="font-extrabold text-emerald-950 text-base">Paiement 100% Sécurisé</h2>
          </div>
          {step !== "success" && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dynamic Step progress tracker */}
        {step !== "success" && (
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <div className={`flex items-center gap-1.5 ${step === "delivery" ? "text-emerald-700" : "text-emerald-600/80"}`}>
              <span className="w-5 h-5 bg-emerald-100 border border-emerald-500 rounded-full flex items-center justify-center text-[10px] text-emerald-900 leading-none">1</span>
              <span>Retrait / Livraison</span>
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            {requiresPrescription && (
              <>
                <div className={`flex items-center gap-1.5 ${step === "prescription" ? "text-emerald-700" : step === "payment" ? "text-emerald-600/80" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] leading-none ${
                    step === "prescription" ? "bg-emerald-100 border border-emerald-500 text-emerald-900" : "bg-gray-100 border border-gray-200"
                  }`}>2</span>
                  <span>Ordonnance</span>
                </div>
                <div className="w-8 h-px bg-gray-200"></div>
              </>
            )}
            <div className={`flex items-center gap-1.5 ${step === "payment" ? "text-emerald-700" : ""}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] leading-none ${
                step === "payment" ? "bg-emerald-100 border border-emerald-500 text-emerald-900" : "bg-gray-100 border border-gray-200"
              }`}>{requiresPrescription ? 3 : 2}</span>
              <span>Paiement</span>
            </div>
          </div>
        )}

        {/* Step Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: RETRAIT OU LIVRAISON */}
          {step === "delivery" && (
            <form onSubmit={handleDeliverySubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider mb-3">Choix du mode d'expédition</h3>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Click & Collect toggle */}
                  <div
                    onClick={() => setDeliveryMethod("collect")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between h-32 ${
                      deliveryMethod === "collect"
                        ? "border-emerald-600 bg-emerald-50/40"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <Store className={`w-6 h-6 ${deliveryMethod === "collect" ? "text-emerald-600" : "text-gray-400"}`} />
                      {deliveryMethod === "collect" && <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[9px]">✓</div>}
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block leading-tight">Retrait en pharmacie</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Click & Collect 2h • GRATUIT</span>
                    </div>
                  </div>

                  {/* Colissimo Delivery toggle */}
                  <div
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between h-32 ${
                      deliveryMethod === "delivery"
                        ? "border-emerald-600 bg-emerald-50/40"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <Truck className={`w-6 h-6 ${deliveryMethod === "delivery" ? "text-emerald-600" : "text-gray-400"}`} />
                      {deliveryMethod === "delivery" && <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[9px]">✓</div>}
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block leading-tight">Livraison à domicile</span>
                      <span className="text-[10px] text-gray-500 font-bold block mt-0.5">La Poste Colissimo (48h)</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Delivery conditional sections */}
              {deliveryMethod === "collect" ? (
                <div className="space-y-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-120">
                  <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider block">Sélectionnez la pharmacie de retrait</span>
                  <div className="space-y-1.5">
                    {STORES_LIST.map((store) => (
                      <label 
                        key={store}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          selectedStore === store 
                            ? "border-emerald-500 bg-white font-semibold text-emerald-950" 
                            : "border-transparent text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="checkoutStore"
                            checked={selectedStore === store}
                            onChange={() => setSelectedStore(store)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{store}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Prêt en 2h</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-120">
                  <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider block">Adresse postale de livraison</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        value={address.firstName}
                        onChange={(e) => setAddress({...address, firstName: e.target.value})}
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Nom de famille</label>
                      <input
                        type="text"
                        required
                        value={address.lastName}
                        onChange={(e) => setAddress({...address, lastName: e.target.value})}
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Adresse postale</label>
                      <input
                        type="text"
                        required
                        value={address.addressLine1}
                        onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                        placeholder="N° de rue, boulevard, boîte..."
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Code Postal</label>
                      <input
                        type="text"
                        required
                        value={address.zipCode}
                        onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Ville</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Numéro de téléphone mobile</label>
                      <input
                        type="text"
                        required
                        placeholder="Pour recevoir le code de retrait Colissimo"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-6 rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer active:scale-95 transition"
                >
                  <span>Continuer la commande</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DOCUMENTS DE PRESCRIPTION */}
          {step === "prescription" && (
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-orange-950 font-medium">
                  <span className="font-extrabold block uppercase tracking-wide">Ordonnance Obligatoire</span>
                  Certains produits de votre panier nécessitent la présentation d'une ordonnance valide. Veuillez lier un document existant de votre profil ou en importer un nouveau.
                </div>
              </div>

              {/* Saved Prescription Options */}
              <div>
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest block mb-2.5">Mes ordonnances enregistrées</span>
                
                {userPrescriptions.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium italic">Vous n'avez pas d'ordonnances sauvegardées pour le moment. Veuillez en téléverser une ci-dessous.</p>
                ) : (
                  <div className="space-y-2">
                    {userPrescriptions.map((p) => (
                      <label 
                        key={p.id}
                        className={`flex items-start justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                          attachedPrescriptionId === p.id 
                            ? "border-emerald-500 bg-emerald-50/20 font-semibold" 
                            : "border-gray-100 hover:bg-slate-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="selectedPrescription"
                            checked={attachedPrescriptionId === p.id}
                            onChange={() => setAttachedPrescriptionId(p.id)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-bold block text-gray-900 truncate max-w-[280px]">{p.fileName}</span>
                            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Ajouté le {p.uploadDate} • Statut: <strong className="text-emerald-700 font-bold">{p.status}</strong></span>
                          </div>
                        </div>
                        <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Drag and Drop Box */}
              <div>
                <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider block mb-2.5">Importer une nouvelle ordonnance</span>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-6 text-center transition flex flex-col items-center justify-center relative cursor-pointer ${
                    dragActive ? "border-emerald-600 bg-emerald-50/30" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="file"
                    id="checkout-file-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                  />
                  {uploadingPresc ? (
                    <div className="space-y-2 py-4">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-emerald-950">Téléversement sécurisé de l'ordonnance...</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-gray-700">Déposez votre ordonnance ici ou <span className="text-emerald-600 decoration-1 hover:underline">cliquez pour parcourir</span></p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Formats autorisés : PDF, PNG, JPEG • Max 10Mo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex justify-between pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep("delivery")}
                  className="px-5 py-3 border border-gray-200 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                <button
                  type="button"
                  disabled={!attachedPrescriptionId}
                  onClick={handlePrescriptionSubmit}
                  className={`font-semibold text-xs py-3 px-6 rounded-xl inline-flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer ${
                    attachedPrescriptionId
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  <span>Valider l'ordonnance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAIEMENT SÉCURISÉ */}
          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* Payment Methods Selection Icons */}
              <div>
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider mb-3">Mode de règlement</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`px-3 py-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition text-center ${
                      paymentMethod === "card" ? "border-emerald-500 bg-emerald-50/20 font-bold" : "border-gray-100 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-800 mb-1" />
                    <span className="text-[10px] text-gray-800">Carte Bancaire</span>
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod("paypal")}
                    className={`px-3 py-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition text-center ${
                      paymentMethod === "paypal" ? "border-emerald-500 bg-emerald-50/20 font-bold" : "border-gray-100 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[11px] font-black text-blue-800 tracking-tighter mb-1">Pay<span className="text-sky-500">Pal</span></span>
                    <span className="text-[10px] text-gray-800">PayPal Express</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("applepay")}
                    className={`px-3 py-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition text-center ${
                      paymentMethod === "applepay" ? "border-emerald-500 bg-emerald-50/20 font-bold" : "border-gray-100 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[11px] font-extrabold text-gray-900 tracking-tight mb-1"> Pay</span>
                    <span className="text-[10px] text-gray-800">Apple Pay 1-Click</span>
                  </div>
                </div>
              </div>

              {/* CARD FIELDS */}
              {paymentMethod === "card" ? (
                <div className="bg-gray-50 border border-gray-120 p-4 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center bg-white px-2 py-1 rounded-md border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Données cryptées par SSL</span>
                    <div className="flex gap-1">
                      <span className="text-[8px] border border-gray-200 px-1 rounded-sm font-bold bg-white text-gray-400">CB</span>
                      <span className="text-[8px] border border-gray-200 px-1 rounded-sm font-bold bg-blue-100 text-blue-800">Visa</span>
                      <span className="text-[8px] border border-gray-200 px-1 rounded-sm font-bold bg-amber-100 text-amber-800">MC</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Titulaire de la carte</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full text-xs font-bold font-mono bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Numéro de carte</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Expiration MM/AA</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs font-mono bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Code CVV</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs font-mono bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 text-center"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs font-semibold text-gray-700">Redirection sécurisée en 1 clic vers votre portefeuille {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"}...</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase">Cliquez sur le bouton ci-dessous pour confirmer.</p>
                </div>
              )}

              {/* Order total recap strip */}
              <div className="p-3 bg-emerald-50/40 rounded-xl flex justify-between items-center text-xs font-bold text-emerald-950">
                <span>Total de votre commande (TTC) :</span>
                <span className="font-mono text-base text-emerald-800">{totalToPay.toFixed(2)}€</span>
              </div>

              {/* Action buttons footer */}
              <div className="flex justify-between pt-5 border-t border-gray-100">
                <button
                  type="button"
                  disabled={processingPayment}
                  onClick={() => requiresPrescription ? setStep("prescription") : setStep("delivery")}
                  className="px-5 py-3 border border-gray-200 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
                
                <button
                  type="submit"
                  disabled={processingPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 cursor-pointer active:scale-95 transition flex-1 sm:flex-none"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signature 3D-Secure...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Payer {totalToPay.toFixed(2)}€</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 4: SUCCESS CONGRATULATIONS */}
          {step === "success" && createdOrder && (
            <div className="text-center py-10 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-1">
                <CheckCircle className="w-10 h-10 animate-bounce-short" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950 uppercase tracking-wider">Commande confirmée !</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Votre achat est enregistré sous le matricule <strong className="text-emerald-900 font-mono">{createdOrder.id}</strong>. Un courriel de récapitulatif a été expédié à <strong className="text-gray-900">{userEmail}</strong>.
                </p>
              </div>

              {/* Order summary box */}
              <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-gray-100 text-left text-xs font-medium space-y-2.5">
                <div className="flex justify-between border-b border-gray-200/50 pb-2 font-bold text-gray-900">
                  <span>Détail de livraison</span>
                  <span className="text-emerald-700 uppercase">{createdOrder.deliveryMethod === "collect" ? "Prendre en boutique" : "Par Colissimo"}</span>
                </div>
                
                {createdOrder.deliveryMethod === "collect" ? (
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] block">Pharmacie de retrait</span>
                    <span className="text-gray-800 text-xs font-semibold block">{createdOrder.storeLocation}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">ℹ️ Présentez-vous au guichet prioritaire Click & Collect muni d'une pièce d'identité et de votre ordonnance originale (si applicable).</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] block">Expédié à l'adresse</span>
                    <span className="text-gray-800 font-semibold block">{createdOrder.shippingAddress?.firstName} {createdOrder.shippingAddress?.lastName}</span>
                    <span className="text-gray-600 block">{createdOrder.shippingAddress?.addressLine1}, {createdOrder.shippingAddress?.zipCode} {createdOrder.shippingAddress?.city}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-200/50 pt-2 font-bold text-gray-950 text-xs">
                  <span>Montant débité</span>
                  <span className="font-mono text-emerald-800">{createdOrder.total.toFixed(2)}€</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition active:scale-95"
                >
                  Fermer et retourner à la boutique
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
