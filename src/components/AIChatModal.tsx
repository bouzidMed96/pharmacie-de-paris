/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { X, Send, Bot, ShieldAlert, Sparkles, Loader2, RefreshCw } from "lucide-react";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
}

const PRESET_QUESTIONS = [
  "Quelle routine parapharmacie conseilleriez-vous pour une peau acnéique ?",
  "Quels suppléments prendre en cas de fatigue mentale ou de stress intense ?",
  "Je cherche une bonne crème réparatrice après une irritation cutanée.",
  "Existe-t-il des remèdes naturels type Weleda/Nuxe pour masser bébé ?"
];

// Simple Markdown parser to format headers, bold words, clean list items, and WARNING banners cleanly.
function parseSimpleMarkdown(text: string) {
  return text.split("\n").map((line, index) => {
    let currentLine = line;

    // Check for core Warning Banner Tag
    const isWarning = currentLine.includes("[ATTENTION]") || currentLine.toUpperCase().includes("ATTENTION :") || currentLine.toUpperCase().includes("ATTENTION");
    
    // Convert strong markdown **text** to <strong>text</strong>
    const boldRegex = /\*\*(.*?)\*\*/g;
    currentLine = currentLine.replace(boldRegex, "<strong>$1</strong>");

    // Convert bullet points
    if (currentLine.trim().startsWith("- ") || currentLine.trim().startsWith("* ")) {
      const content = currentLine.replace(/^[-*]\s+/, "");
      return (
        <li key={index} className="ml-4 list-disc text-slate-700 text-xs my-1" dangerouslySetInnerHTML={{ __html: content }} />
      );
    }

    if (isWarning) {
      return (
        <div key={index} className="my-2.5 p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-rose-800 font-semibold leading-relaxed" dangerouslySetInnerHTML={{ __html: currentLine }} />
      );
    }

    if (currentLine.trim() === "") {
      return <div key={index} className="h-2" />;
    }

    return (
      <p key={index} className="text-xs text-slate-700 leading-relaxed mb-1.5" dangerouslySetInnerHTML={{ __html: currentLine }} />
    );
  });
}

export default function AIChatModal({
  isOpen,
  onClose,
  chatHistory,
  onSendMessage,
  isGenerating
}: AIChatModalProps) {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onSendMessage(prompt);
    setPrompt("");
  };

  const handlePresetClick = (q: string) => {
    if (isGenerating) return;
    onSendMessage(q);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end font-sans">
      <div id="ai-advisor-drawer-container" className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl relative animate-slide-in">
        
        {/* Chat Drawer Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-950 text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-500 shadow-lg shadow-emerald-600/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm leading-none flex items-center gap-1.5">
                <span>Conseiller Pharmacologue IA</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              </h2>
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider block mt-1">Soutenu par Google Gemini 3.5</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-900 rounded-full transition text-emerald-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Warning Header Banner */}
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-950 to-teal-980 text-emerald-100 text-[10px] font-medium border-b border-emerald-900 leading-normal flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Note : L'IA fournit des suggestions de parapharmacie. Ne remplace pas l'avis formel d'un médecin agréé.</span>
        </div>

        {/* Chat Messages Panel */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50/50">
          
          {chatHistory.length === 0 ? (
            <div className="py-6 space-y-5 text-center">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center text-slate-300 mx-auto shadow-md">
                <Bot className="w-8 h-8 text-emerald-600 animate-pulse-slow" />
              </div>
              <div className="max-w-xs mx-auto">
                <p className="text-slate-900 font-black text-sm">Besoin d'un conseil santé ou cosmétique ?</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Je suis formé à l'univers thérapeutique de la pharmacie et parapharmacie (gammes Caudalie, La Roche-Posay, compléments Solgar, etc.) pour vous conseiller de manière fiable.
                </p>
              </div>

              {/* Preset suggestion list */}
              <div className="space-y-2 text-left max-w-sm mx-auto">
                <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider block ml-1">Suggestions fréquentes</span>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handlePresetClick(q)}
                      className="w-full text-left px-3.5 py-2.5 bg-white hover:bg-emerald-50 border border-gray-100 hover:border-emerald-100 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs leading-normal"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role !== "user" && (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center p-1.5 flex-shrink-0 text-[10px] font-bold shadow-md">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none text-xs"
                      : "bg-white border border-gray-100 rounded-tl-none"
                  }`}>
                    {msg.role === "user" ? (
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                    ) : (
                      <div className="space-y-1 font-sans">
                        {parseSimpleMarkdown(msg.text)}
                      </div>
                    )}
                    <span className={`text-[9px] block mt-1.5 font-mono ${msg.role === "user" ? "text-emerald-200 text-right" : "text-gray-400 text-left"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold animate-spin shadow-md">
                    AI
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[85%] shadow-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span className="text-xs font-semibold text-gray-500">Le pharmacien IA analyse votre ordonnance ou besoin...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar Form */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              id="ai-chatbot-input"
              type="text"
              placeholder="Ex: Quelle routine contre la fatigue en hiver ?..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="flex-1 bg-gray-50 text-xs border border-gray-200 rounded-full py-2.5 px-4 focus:outline-none focus:bg-white focus:border-emerald-500 transition shadow-inner"
            />
            <button
              id="ai-chatbot-send-btn"
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition cursor-pointer ${
                prompt.trim() && !isGenerating 
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10 active:scale-95" 
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-between items-center text-[9px] text-gray-400 font-semibold px-2 mt-2 uppercase tracking-wider">
            <span>🔐 Cryptage SSL bout en bout</span>
            <span>Conseiller médical en ligne</span>
          </div>
        </div>

      </div>
    </div>
  );
}
