import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint for health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Pharmacist AI Consulting API
app.post("/api/gemini/advice", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = 
      "Vous êtes un pharmacien conseil et expert en parapharmacie (cosmétiques, compléments alimentaires, hygiène, soins bébé, nutrition) travaillant chez Pharmacie de Garde & Parapharmacie, inspiré de Citypharma à Paris. " +
      "Votre but est d'aider les clients sur leurs questions quotidiennes de forme, beauté, santé et bien-être. " +
      "RÈGLES IMPORTANTES :\n" +
      "1. Répondez de manière chaleureuse, polie, rassurante et professionnelle en français.\n" +
      "2. Si un client pose des questions sur des symptômes médicaux graves, des pathologies aiguës ou des médicaments nécessitant ordonnance, fournissez un conseil général, mais ajoutez IMMÉDIATEMENT un encadré ou une phrase d'avertissement claire (ex: '[ATTENTION] Veuillez consulter un médecin ou un pharmacien agréé avant de prendre tout médicament lourd ou en cas de symptômes persistants. Un diagnostic en ligne ne remplace pas une consultation médicale.').\n" +
      "3. Suggérez ou recommandez des types de produits parapharmaceutiques pertinents (comme l'acide hyaluronique, les crèmes apaisantes, la vitamine C, le zinc, etc.) si cela convient à la demande.\n" +
      "4. Structurez vos réponses avec du Markdown propre (titres, listes à puces, caractères gras) pour une lecture très confortable.";

    // If there is context or history, construct dialogue contents
    const contentPayload = history && Array.isArray(history) 
      ? [...history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        })), { role: "user", parts: [{ text: message }] }]
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentPayload,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Désolé, je n'ai pas pu générer de réponse. Veuillez réessayer.";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Une erreur est survenue lors de la communication avec l'assistant IA.",
      details: error.message 
    });
  }
});

async function main() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Pharmacy Fullstack Server started at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Server failure:", err);
  process.exit(1);
});
