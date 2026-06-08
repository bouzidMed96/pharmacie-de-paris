import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

const __dirname = process.cwd();

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(express.json());

// CORS — allow Vite dev server (port 5173) and production
app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ── Gemini client ─────────────────────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) console.warn("⚠️  GEMINI_API_KEY non defini dans .env.local");
    aiClient = new GoogleGenAI({ apiKey: apiKey || "MOCK_KEY" });
  }
  return aiClient;
}

// ── Demo users ────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id: "1", email: "admin@pharmacie-demo.fr", password: "Admin123!", role: "admin", name: "Admin Pharmacie" },
  { id: "2", email: "user@test.fr",            password: "User123!",  role: "user",  name: "Jean Dupont" },
];

// ── Server-side products ──────────────────────────────────────────────────────
const SERVER_PRODUCTS: Record<string, unknown>[] = [
  {
    id: "sv1",
    name: "Cicaplast Baume B5+ Multi-Reparateur",
    brand: "La Roche-Posay",
    category: "skincare",
    description: "Baume reparateur multi-usage pour peaux irritees, seches et abimees.",
    price: 11.90, oldPrice: 14.50,
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=450&auto=format&fit=crop&q=80",
    rating: 4.9, reviewsCount: 678, stock: 85,
    prescriptionRequired: false, size: "100ml",
    concern: ["Cicatrisation", "Reparateur", "Famille"],
  },
  {
    id: "sv2",
    name: "Omega 3 Premium DHA + EPA",
    brand: "Arkopharma",
    category: "nutrition",
    description: "Complement alimentaire riche en acides gras omega-3.",
    price: 16.90, oldPrice: 20.00,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=450&auto=format&fit=crop&q=80",
    rating: 4.6, reviewsCount: 412, stock: 60,
    prescriptionRequired: false, size: "60 capsules",
    concern: ["Coeur", "Immunite", "Cerveau"],
  },
];

// ── ROUTES ─────────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    pharmacy: "Pharmacie de Paris",
    address: "12 Rue de la Paix, 75001 Paris",
    phone: "+33 1 23 45 67 89",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect." });
  const { password: _p, ...safeUser } = user;
  res.json({ user: safeUser, token: `demo-token-${user.id}` });
});

app.get("/api/auth/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Non authentifie" });
  const userId = auth.replace("Bearer demo-token-", "");
  const user = DEMO_USERS.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: "Token invalide" });
  const { password: _p, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get("/api/products", (_req, res) => {
  res.json({ products: SERVER_PRODUCTS });
});

app.post("/api/admin/products", (req, res) => {
  const product = { id: `sv-${Date.now()}`, ...req.body };
  SERVER_PRODUCTS.push(product);
  res.status(201).json({ product });
});

app.put("/api/admin/products/:id", (req, res) => {
  const idx = SERVER_PRODUCTS.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produit non trouve" });
  SERVER_PRODUCTS[idx] = { ...SERVER_PRODUCTS[idx], ...req.body };
  res.json({ product: SERVER_PRODUCTS[idx] });
});

app.delete("/api/admin/products/:id", (req, res) => {
  const idx = SERVER_PRODUCTS.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Produit non trouve" });
  SERVER_PRODUCTS.splice(idx, 1);
  res.json({ success: true });
});

app.get("/api/pharmacy/info", (_req, res) => {
  res.json({
    name: "Pharmacie de Paris",
    address: "12 Rue de la Paix",
    city: "75001 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@pharmacie-demo.fr",
    hours: [
      { day: "Lundi",    open: "09:00", close: "20:30" },
      { day: "Mardi",    open: "09:00", close: "20:30" },
      { day: "Mercredi", open: "09:00", close: "20:30" },
      { day: "Jeudi",    open: "09:00", close: "20:30" },
      { day: "Vendredi", open: "09:00", close: "20:30" },
      { day: "Samedi",   open: "09:00", close: "20:30" },
      { day: "Dimanche", open: "Ferme", close: "" },
    ],
  });
});

app.post("/api/gemini/advice", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  try {
    const ai = getGeminiClient();
    const systemInstruction =
      "Vous etes le pharmacien conseil de la Pharmacie de Paris, au 12 Rue de la Paix, 75001 Paris. " +
      "Expert en parapharmacie, dermo-cosmetique, complements alimentaires et medicaments OTC. " +
      "Repondez en francais, avec chaleur et professionnalisme. " +
      "Pour symptomes graves, ajoutez [ATTENTION] Consultez un medecin. " +
      "Utilisez du Markdown propre. Tel: +33 1 23 45 67 89.";

    const contentPayload = Array.isArray(history) && history.length > 0
      ? [
          ...history.map((h: { role: string; text: string }) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          })),
          { role: "user", parts: [{ text: message }] },
        ]
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentPayload,
      config: { systemInstruction, temperature: 0.7 },
    });

    res.json({ text: response.text || "Impossible de generer une reponse." });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Erreur IA",
      fallback: true,
      text: "L'assistant IA est indisponible. Appelez au **+33 1 23 45 67 89** ou venez au **12 Rue de la Paix, 75001 Paris**.",
    });
  }
});

// ── Production: serve Vite build ──────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n[PharmaDemo API] http://localhost:${PORT}`);
  console.log(`[Info] Pharmacie de Paris`);
  console.log(`[Info] 12 Rue de la Paix - 75001 Paris`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Dev]  Frontend Vite -> http://localhost:5173`);
    console.log(`[Dev]  API proxy configuree sur /api/**\n`);
  }
});
