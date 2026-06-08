import React, { useState } from "react";
import { Order, Prescription, UserProfile } from "../types";
import {
  User, Mail, MapPin, Phone, Upload, FileCheck,
  Loader2, Truck, Store, LogOut, ShieldCheck, LayoutDashboard,
  Eye, EyeOff, AlertCircle
} from "lucide-react";
import { PHARMACY } from "../data/products";

interface AccountTabProps {
  userProfile: UserProfile;
  isLoggedIn: boolean;
  userRole: "user" | "admin";
  onLogin: (email: string, role?: string) => void;
  onLogout: () => void;
  onAddPrescription: (presc: Prescription) => void;
  onOpenAdmin: () => void;
}

export default function AccountTab({
  userProfile, isLoggedIn, userRole,
  onLogin, onLogout, onAddPrescription, onOpenAdmin
}: AccountTabProps) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error ?? "Identifiants incorrects."); return; }
      onLogin(data.user.email, data.user.role);
    } catch {
      setLoginError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const processFile = (fileName: string) => {
    setUploading(true);
    setTimeout(() => {
      onAddPrescription({
        id: `presc-${Date.now()}`,
        fileName,
        uploadDate: new Date().toLocaleDateString("fr-FR"),
        status: "En attente de vérification",
        imageUrl: "",
        doctorName: "Dr. Catherine Mercier",
        patientName: `${userProfile.firstName} ${userProfile.lastName}`,
      });
      setUploading(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0].name);
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-10 px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
          {/* Banner */}
          <div className="custom-gradient-banner p-6 text-center text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black">Mon Espace Client</h2>
            <p className="text-[11px] text-emerald-200 mt-1">Pharmacie de Paris</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            {/* Demo hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-xs text-blue-700 space-y-0.5">
              <p className="font-bold text-blue-800">Comptes de démonstration :</p>
              <p>👤 Client : <code className="bg-blue-100 px-1 rounded">user@test.fr</code> / <code className="bg-blue-100 px-1 rounded">User123!</code></p>
              <p>🔑 Admin : <code className="bg-blue-100 px-1 rounded">admin@pharmacie-demo.fr</code> / <code className="bg-blue-100 px-1 rounded">Admin123!</code></p>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Mot de passe</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                <input type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <p className="text-[10px] text-center text-gray-400">
              <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-500" />
              Données protégées · Hébergement HDS certifié
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── LOGGED IN ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sidebar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xl self-start space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-black text-lg">
              {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">{userProfile.firstName} {userProfile.lastName}</h3>
              {userRole === "admin" ? (
                <span className="text-[10px] font-bold text-white bg-green-600 px-2 py-0.5 rounded-full">Admin</span>
              ) : (
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Client certifié</span>
              )}
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" />{userProfile.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" />{userProfile.phone ?? "—"}</div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                {userProfile.address
                  ? `${userProfile.address.addressLine1}, ${userProfile.address.zipCode} ${userProfile.address.city}`
                  : PHARMACY.address + ", " + PHARMACY.city}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-gray-100 text-center">
            <div>
              <span className="text-[9px] text-gray-400 font-bold uppercase block">Commandes</span>
              <span className="text-sm font-black text-slate-800">{userProfile.orders.length}</span>
            </div>
            <div className="border-l border-gray-200">
              <span className="text-[9px] text-gray-400 font-bold uppercase block">Ordonnances</span>
              <span className="text-sm font-black text-slate-800">{userProfile.prescriptions.length}</span>
            </div>
          </div>

          {/* Admin button */}
          {userRole === "admin" && (
            <button onClick={onOpenAdmin}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Admin
            </button>
          )}

          <button onClick={onLogout}
            className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {/* Main area */}
        <div className="col-span-1 lg:col-span-2 space-y-6">

          {/* Prescriptions */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Mes ordonnances</h3>
                <p className="text-[10px] text-gray-400 uppercase font-semibold mt-0.5">Téléverser et gérer mes prescriptions</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold py-1 px-2.5 rounded-full border border-emerald-100">Tiers-Payant</span>
            </div>

            {userProfile.prescriptions.length > 0 && (
              <div className="space-y-2">
                {userProfile.prescriptions.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-2xl border border-gray-100 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-xs">{p.fileName}</p>
                        <p className="text-[9px] text-gray-400">{p.uploadDate}{p.doctorName ? ` · ${p.doctorName}` : ""}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      p.status === "Valide" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      p.status === "Refusé" ? "bg-red-50 text-red-700 border-red-100" :
                      "bg-amber-50 text-amber-700 border-amber-100"}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition ${
                dragActive ? "border-emerald-500 bg-emerald-50/30" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0].name)}
                className="absolute inset-0 opacity-0 w-full cursor-pointer" />
              {uploading ? (
                <div className="space-y-2 py-2">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-emerald-800">Téléversement en cours…</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-7 h-7 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">Glissez une ordonnance ici</p>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">PDF, PNG, JPG</p>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Mes commandes</h3>

            {userProfile.orders.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">Aucune commande pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {userProfile.orders.map((o: Order) => (
                  <div key={o.id} className="p-4 rounded-2xl border border-gray-100 space-y-3 hover:border-emerald-100 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-black text-slate-900 font-mono block">{o.id}</span>
                        <span className="text-[9px] text-gray-400 uppercase font-semibold">{o.date} · {o.items.length} article(s)</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        o.status === "Livré" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {o.items.map((item) => (
                        <div key={item.product.id} className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border border-gray-100 bg-slate-50 rounded-lg">
                          <img src={item.product.image} alt={item.product.name} className="w-5 h-5 object-contain" />
                          <span className="text-[10px] font-semibold text-slate-700 max-w-[120px] truncate">{item.product.name}</span>
                          <span className="text-[10px] font-bold text-emerald-600">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        {o.deliveryMethod === "collect"
                          ? <><Store className="w-3.5 h-3.5 text-emerald-600" /><span>Click &amp; Collect · Pharmacie de Paris</span></>
                          : <><Truck className="w-3.5 h-3.5 text-emerald-600" /><span>Colissimo · {o.shippingAddress?.addressLine1}</span></>}
                      </div>
                      <span className="font-black text-slate-900 text-xs">{o.total.toFixed(2)} €</span>
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
