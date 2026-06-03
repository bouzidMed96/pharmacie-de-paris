/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Order, Prescription, UserProfile } from "../types";
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Plus, 
  Upload, 
  FileCheck, 
  ShieldAlert, 
  Loader2, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  Truck,
  Store,
  LogOut,
  MailCheck
} from "lucide-react";

interface AccountTabProps {
  userProfile: UserProfile;
  isLoggedIn: boolean;
  onLogin: (email: string, password?: string) => void;
  onLogout: () => void;
  onAddPrescription: (presc: Prescription) => void;
}

export default function AccountTab({
  userProfile,
  isLoggedIn,
  onLogin,
  onLogout,
  onAddPrescription
}: AccountTabProps) {
  const [emailInput, setEmailInput] = useState("bouzidmed1996@gmail.com");
  const [passwordInput, setPasswordInput] = useState("••••••••");
  const [firstName, setFirstName] = useState("Mohamed");
  const [lastName, setLastName] = useState("Bouzid");
  
  // Local upload state
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(emailInput);
  };

  const processFileDirectly = (fileName: string) => {
    setUploading(true);
    setTimeout(() => {
      onAddPrescription({
        id: `presc-${Date.now()}`,
        fileName: fileName || "ordonnance_paris_6.pdf",
        uploadDate: new Date().toLocaleDateString("fr-FR"),
        status: "En attente de vérification",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop",
        doctorName: "Dr. Catherine Mercier",
        patientName: `${userProfile.firstName || firstName} ${userProfile.lastName || lastName}`
      });
      setUploading(false);
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileDirectly(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileDirectly(e.target.files[0].name);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white rounded-3xl border border-gray-100/80 shadow-2xl overflow-hidden font-sans">
        
        {/* Login Banner Decoration */}
        <div className="custom-gradient-banner p-6 text-center text-white relative">
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <span className="text-emerald-300 font-bold text-lg">+</span>
          </div>
          <h2 className="text-xl font-black tracking-tight leading-snug">Mon Espace Client</h2>
          <p className="text-[11px] text-emerald-200 mt-1 uppercase tracking-wider font-semibold">Gérer mes achats, ordonnances et remboursements</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginFormSubmit} className="p-6 space-y-4">
          <div className="text-center pb-2 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-950">👋 Bienvenue Mohamed Bouzid !</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Nous avons pré-configuré votre compte. Cliquez sur le bouton ci-dessous pour une connexion instantanée en tant que client certifié.</p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Adresse email pro</label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Mot de passe</label>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:bg-white focus:border-emerald-500 transition"
              />
              <span className="text-gray-400 absolute left-3.5 top-3 text-sm">🔒</span>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-600/15 cursor-pointer hover:scale-[1.01] active:scale-95"
          >
            Se connecter à mon compte
          </button>

          <p className="text-[10px] text-center text-gray-400 font-semibold leading-normal">
            Protection des données de santé agréée ASIP Santé • Hébergement Certifié HDS
          </p>
        </form>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Details Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xl self-start space-y-5">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full flex items-center justify-center font-extrabold text-lg shadow-xs">
              M
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 leading-snug">{userProfile.firstName} {userProfile.lastName}</h3>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-0.5">Patient Certifié Ameli</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate">{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{userProfile.phone || "06 12 34 56 78"}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                {userProfile.address 
                  ? `${userProfile.address.addressLine1}, ${userProfile.address.zipCode} ${userProfile.address.city}`
                  : "26 Rue du Four, 75006 Paris"}
              </span>
            </div>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-gray-100">
            <div className="text-center py-1">
              <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Commandes</span>
              <span className="text-sm font-extrabold text-slate-800 font-mono">{userProfile.orders.length}</span>
            </div>
            <div className="text-center py-1 border-l border-gray-200">
              <span className="text-gray-400 font-extrabold uppercase text-[9px] block">Ordonnances</span>
              <span className="text-sm font-extrabold text-slate-800 font-mono">{userProfile.prescriptions.length}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full py-2.5 border border-red-200 text-red-600 hover:text-white hover:bg-red-600 text-xs font-bold uppercase tracking-wide rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Prescription center / upload list & Order list */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* PRESCRIPTION CENTER */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-none">Mon Centre d'Ordonnances</h3>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block mt-1">Téléverser et lier mes ordonnances aux commandes</span>
              </div>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold py-1 px-2.5 rounded-full border border-emerald-100">
                Agréé Tiers-Payant
              </span>
            </div>

            {/* List of custom uploaded files */}
            {userProfile.prescriptions.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium italic py-2">Vous n'avez pas d'ordonnances téléversées. Utilisez la zone ci-dessous pour numériser votre premier ordonnance.</p>
            ) : (
              <div className="space-y-2">
                {userProfile.prescriptions.map((p) => (
                  <div 
                    key={p.id}
                    className="flex justify-between items-center p-3 rounded-2xl border border-gray-150/70 text-xs bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center p-1.5 flex-shrink-0">
                        <FileCheck className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 truncate block max-w-[200px] sm:max-w-md">{p.fileName}</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">Soumis le {p.uploadDate} {p.doctorName && `• prescrit par ${p.doctorName}`}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${
                        p.status === "Valide"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : p.status === "Refusé"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drag & Drop Action Sandbox */}
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
                id="dashboard-file-upload"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full cursor-pointer"
              />
              {uploading ? (
                <div className="space-y-2 py-4">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-emerald-950">Téléversement sécurisé de votre document HDS...</p>
                </div>
              ) : (
                <div className="space-y-1.5 py-1">
                  <Upload className="w-7 h-7 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">Glissez-déposez une nouvelle ordonnance médicale ici</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">PDF, PNG, JPG • Traitement instantané par IA</p>
                </div>
              )}
            </div>
          </div>

          {/* HISTORIC ORDERS */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-none">Historique de mes commandes</h3>
              <span className="text-[10px] text-gray-400 font-semibold uppercase block mt-1">Suivi de mes préparations en officine et colis Colissimo</span>
            </div>

            {userProfile.orders.length === 0 ? (
              <div className="text-center py-8 bg-gray-50/40 rounded-2xl border border-dashed border-gray-100">
                <p className="text-xs text-gray-450 italic font-medium">Vous n'avez pas encore passé de commande.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userProfile.orders.map((o) => (
                  <div 
                    key={o.id}
                    className="p-4 rounded-2xl border border-gray-150/70 space-y-3 bg-white hover:border-emerald-100 transition duration-300"
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                      <div>
                        <span className="text-[11px] font-black text-slate-900 block font-mono">{o.id}</span>
                        <span className="text-[9px] text-gray-400 block font-semibold mt-0.5 uppercase">{o.date} • {o.items.length} produit(s)</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 select-none">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                          o.status === "Livré"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800 animate-pulse-slow"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    {/* Products summary inline */}
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      {o.items.map((item) => (
                        <div key={item.product.id} className="flex-shrink-0 flex items-center gap-1.5 p-1 px-2 border border-gray-100 bg-slate-50 rounded-lg text-[10px] font-medium max-w-[180px]">
                          <img src={item.product.image} alt={item.product.name} className="w-5 h-5 object-contain" />
                          <span className="truncate text-[10px] text-slate-800 font-semibold pr-1">{item.product.name}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded-xs">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery summary section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1.5 border-t border-gray-100 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1.5">
                        {o.deliveryMethod === "collect" ? (
                          <>
                            <Store className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Retrait : <span className="font-bold text-gray-800">Click & Collect {o.storeLocation?.substring(0, 20)}...</span></span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Colissimo à : <span className="font-bold text-gray-800">{o.shippingAddress?.addressLine1}</span></span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-start gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 uppercase text-[9px] font-bold">Mécanisme</span>
                          <span className="font-mono font-bold text-slate-800 text-xs px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded-md">
                            {o.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          {o.total.toFixed(2)}€
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
