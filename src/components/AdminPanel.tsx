import React, { useState } from "react";
import { PRODUCTS_LIST, PHARMACY } from "../data/products";
import { Product, ProductCategory } from "../types";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, ArrowLeft,
  Plus, Pencil, Trash2, X, Check, Search, Users, Eye,
  TrendingUp, LogOut
} from "lucide-react";

type Tab = "dashboard" | "products" | "promotions";
type Promo = { id: string; name: string; code: string; discount: number; type: "percent" | "fixed"; active: boolean };

const INITIAL_PROMOS: Promo[] = [
  { id: "p1", name: "Bienvenue",   code: "PHARMA10", discount: 10,   type: "percent", active: true  },
  { id: "p2", name: "Livraison",   code: "LIVRAISON", discount: 4.90, type: "fixed",   active: true  },
  { id: "p3", name: "Printemps",   code: "SPRING15", discount: 15,   type: "percent", active: false },
];

interface AdminPanelProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function AdminPanel({ onBack, onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([...PRODUCTS_LIST]);
  const [promos, setPromos]     = useState<Promo[]>(INITIAL_PROMOS);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"product" | "promo" | null>(null);
  const [editing, setEditing]   = useState<Product | null>(null);

  const [pForm, setPForm] = useState({ name: "", brand: "", category: "skincare" as ProductCategory, price: "", oldPrice: "", description: "", size: "", isPromo: false });
  const [promoForm, setPromoForm] = useState({ name: "", code: "", discount: "", type: "percent" as "percent" | "fixed" });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAddProduct = () => {
    setEditing(null);
    setPForm({ name: "", brand: "", category: "skincare", price: "", oldPrice: "", description: "", size: "", isPromo: false });
    setModal("product");
  };

  const openEditProduct = (p: Product) => {
    setEditing(p);
    setPForm({ name: p.name, brand: p.brand, category: p.category, price: String(p.price), oldPrice: String(p.oldPrice ?? ""), description: p.description, size: p.size, isPromo: false });
    setModal("product");
  };

  const saveProduct = () => {
    if (!pForm.name || !pForm.brand || !pForm.price) return;
    if (editing) {
      setProducts((prev) => prev.map((p) => p.id === editing.id ? {
        ...p, name: pForm.name, brand: pForm.brand, category: pForm.category,
        price: parseFloat(pForm.price),
        oldPrice: pForm.oldPrice ? parseFloat(pForm.oldPrice) : undefined,
        description: pForm.description, size: pForm.size,
      } : p));
    } else {
      const np: Product = {
        id: `new-${Date.now()}`,
        slug: pForm.name.toLowerCase().replace(/\s+/g, "-"),
        name: pForm.name, brand: pForm.brand, category: pForm.category,
        price: parseFloat(pForm.price),
        oldPrice: pForm.oldPrice ? parseFloat(pForm.oldPrice) : undefined,
        description: pForm.description,
        image: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=450&auto=format&fit=crop&q=80`,
        rating: 4.5, reviewsCount: 0, stock: 50,
        prescriptionRequired: false, size: pForm.size || "—",
        concern: [],
      };
      setProducts((prev) => [np, ...prev]);
    }
    setModal(null);
  };

  const deleteProduct = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const savePromo = () => {
    if (!promoForm.name || !promoForm.code || !promoForm.discount) return;
    setPromos((prev) => [...prev, {
      id: `pr-${Date.now()}`, name: promoForm.name,
      code: promoForm.code.toUpperCase(), discount: parseFloat(promoForm.discount),
      type: promoForm.type, active: true,
    }]);
    setPromoForm({ name: "", code: "", discount: "", type: "percent" });
    setModal(null);
  };

  const togglePromo = (id: string) => setPromos((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const deletePromo = (id: string) => setPromos((prev) => prev.filter((p) => p.id !== id));

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard",   label: "Tableau de bord",  icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "products",    label: "Produits",         icon: <Package className="w-4 h-4" /> },
    { id: "promotions",  label: "Promotions",       icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-emerald-800 rounded-lg transition flex items-center gap-1 text-sm text-emerald-300">
            <ArrowLeft className="w-4 h-4" /> <Eye className="w-4 h-4" /> <span className="hidden sm:inline text-xs">Voir le site</span>
          </button>
          <div className="w-px h-5 bg-emerald-800" />
          <span className="font-extrabold text-sm">Admin · Pharmacie de Paris</span>
          <span className="text-emerald-400 text-[10px] hidden md:block">— {PHARMACY.address}, {PHARMACY.city}</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white transition">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 hidden md:block">
          <nav className="bg-white rounded-2xl border border-gray-100 p-2 space-y-0.5 sticky top-6">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition text-left ${
                  tab === t.id ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 mb-4 w-full overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                tab === t.id ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── DASHBOARD ──────────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <>
              <h1 className="text-xl font-black text-gray-900">Tableau de bord</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Produits", value: products.length, icon: <Package className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
                  { label: "Promos actives", value: promos.filter((p) => p.active).length, icon: <Tag className="w-5 h-5" />, color: "bg-red-50 text-red-600" },
                  { label: "En stock", value: products.filter((p) => p.stock > 0).length, icon: <TrendingUp className="w-5 h-5" />, color: "bg-green-50 text-green-600" },
                  { label: "Commandes (démo)", value: 47, icon: <ShoppingCart className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
                    <div className="text-2xl font-black text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Gérer les produits", desc: "Ajouter, modifier, supprimer", color: "from-blue-600 to-blue-700", onClick: () => setTab("products") },
                  { label: "Gérer les promos",   desc: "Codes, réductions, badges",    color: "from-red-500 to-red-600",   onClick: () => setTab("promotions") },
                  { label: "Voir le site",        desc: "Retour boutique client",       color: "from-emerald-600 to-emerald-700", onClick: onBack },
                ].map((a) => (
                  <button key={a.label} onClick={a.onClick}
                    className={`bg-gradient-to-br ${a.color} text-white rounded-2xl p-5 text-left hover:opacity-90 transition`}>
                    <div className="font-bold">{a.label}</div>
                    <div className="text-xs opacity-80 mt-0.5">{a.desc}</div>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-green-600" /> Comptes (démo)</h2>
                {[
                  { name: "Jean Dupont", email: "user@test.fr", role: "Client" },
                  { name: "Admin Pharmacie", email: "admin@enghien-pharma.fr", role: "Admin" },
                ].map((u) => (
                  <div key={u.email} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === "Admin" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── PRODUCTS ────────────────────────────────────────────────── */}
          {tab === "products" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-xl font-black text-gray-900">Produits <span className="text-gray-400 font-normal text-base">({products.length})</span></h1>
                <button onClick={openAddProduct}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition">
                  <Plus className="w-4 h-4" /> Ajouter un produit
                </button>
              </div>

              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">Produit</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Catégorie</th>
                      <th className="px-4 py-3 text-left">Prix</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Stock</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-emerald-700 uppercase">{p.brand}</p>
                              <p className="text-xs font-semibold text-gray-800 truncate max-w-[180px]">{p.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{p.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900">{p.price.toFixed(2)} €</span>
                          {p.oldPrice && <p className="text-[10px] text-gray-400 line-through">{p.oldPrice.toFixed(2)} €</p>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs font-semibold ${p.stock > 10 ? "text-green-600" : "text-orange-600"}`}>
                            {p.stock} unités
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => openEditProduct(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── PROMOTIONS ──────────────────────────────────────────────── */}
          {tab === "promotions" && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-xl font-black text-gray-900">Codes promotionnels</h1>
                <button onClick={() => setModal("promo")}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition">
                  <Plus className="w-4 h-4" /> Nouveau code
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                {promos.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.active ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}>
                      <Tag className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                          {p.active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{p.code}</code>
                        <span className="text-sm font-bold text-red-600">-{p.discount}{p.type === "percent" ? "%" : " €"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePromo(p.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${p.active ? "bg-green-500" : "bg-gray-300"}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${p.active ? "left-6" : "left-1"}`} />
                      </button>
                      <button onClick={() => deletePromo(p.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MODAL produit ────────────────────────────────────────────────── */}
      {modal === "product" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900 text-lg">{editing ? "Modifier le produit" : "Nouveau produit"}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Nom du produit *", key: "name", placeholder: "Ex: Cicaplast Baume B5" },
                { label: "Marque *", key: "brand", placeholder: "Ex: La Roche-Posay" },
                { label: "Format / Contenance", key: "size", placeholder: "Ex: 100ml, 60 gélules" },
              ].map((f) => (
                <div key={f.key} className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">{f.label}</label>
                  <input value={(pForm as Record<string, unknown>)[f.key] as string}
                    onChange={(e) => setPForm({ ...pForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Catégorie</label>
                  <select value={pForm.category} onChange={(e) => setPForm({ ...pForm, category: e.target.value as ProductCategory })}
                    className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {["skincare","haircare","baby","nutrition","hygiene","medication"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Prix (€) *</label>
                  <input type="number" step="0.01" value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: e.target.value })}
                    placeholder="9.90" className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Prix barré (€)</label>
                  <input type="number" step="0.01" value={pForm.oldPrice} onChange={(e) => setPForm({ ...pForm, oldPrice: e.target.value })}
                    placeholder="12.90" className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Description</label>
                <textarea value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                  rows={3} placeholder="Description courte du produit…"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                <button onClick={saveProduct} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition">
                  <Check className="w-4 h-4" /> {editing ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL promo ──────────────────────────────────────────────────── */}
      {modal === "promo" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-gray-900 text-lg">Nouveau code promo</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Nom de la promotion</label>
                <input value={promoForm.name} onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
                  placeholder="Ex: Offre été 2024"
                  className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Code promo</label>
                <input value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  placeholder="EX: SUMMER20"
                  className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Réduction</label>
                  <input type="number" value={promoForm.discount} onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                    placeholder="10"
                    className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Type</label>
                  <select value={promoForm.type} onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value as "percent" | "fixed" })}
                    className="w-full h-9 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="percent">% de remise</option>
                    <option value="fixed">€ de remise</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Annuler</button>
                <button onClick={savePromo} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition">
                  <Check className="w-4 h-4" /> Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
