"use client";

import { useState } from "react";
import { Sparkles, Zap, Briefcase, Search, Loader2 } from "lucide-react";
import { generateAIContent } from "../lib/openai";
import { assetStorage, type NFTAsset } from "../lib/storage";
import { ErrorMessage } from "./ui/ErrorMessage";
import { Toast } from "./ui/Toast";

interface GenerateFormProps {
  onGenerated: (asset: NFTAsset) => void;
  userAddress?: string;
}

const agentTypes = [
  { id: 'creative', name: 'Creative Agent', icon: Sparkles, color: 'text-accent' },
  { id: 'technical', name: 'Technical Agent', icon: Zap, color: 'text-accent-secondary' },
  { id: 'business', name: 'Business Agent', icon: Briefcase, color: 'text-warning' },
  { id: 'research', name: 'Research Agent', icon: Search, color: 'text-success' },
];

export function GenerateForm({ onGenerated, userAddress }: GenerateFormProps) {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("creative");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const handleGenerate = async () => {
    if (!prompt.trim() || !title.trim()) {
      setError("Please provide both a title and a prompt");
      return;
    }

    setError("");
    setIsGenerating(true);
    
    try {
      const content = await generateAIContent(prompt, selectedAgent);
      
      const asset: NFTAsset = {
        id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        content,
        agentType: selectedAgent,
        prompt: prompt.trim(),
        creator: userAddress || "anonymous",
        locked: false,
        timestamp: Date.now(),
      };

      assetStorage.saveAsset(asset);
      onGenerated(asset);
      
      // Show success toast
      setToastMessage("Asset generated successfully!");
      setToastType("success");
      setShowToast(true);
      
      // Reset form
      setPrompt("");
      setTitle("");
    } catch (error) {
      console.error("Generation failed:", error);
      setError("Failed to generate content. Please try again.");
      
      // Show error toast
      setToastMessage("Generation failed. Please try again.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="card animate-fade-in">
        <h2 className="text-xl font-bold text-gradient mb-lg">Generate AI Asset</h2>
        
        <div className="space-y-lg">
          <div>
            <label htmlFor="asset-title" className="block text-sm font-medium mb-sm">Asset Title</label>
            <input
              id="asset-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your AI asset a unique title"
              className="input-field w-full"
              maxLength={100}
              aria-required="true"
              aria-invalid={error && !title.trim() ? "true" : "false"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-sm">Select AI Agent</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
              {agentTypes.map((agent) => {
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`p-sm sm:p-md rounded-md border transition-all duration-200 ${
                      selectedAgent === agent.id
                        ? 'border-accent bg-accent/10 shadow-glow'
                        : 'border-white/20 bg-surface hover:border-white/30'
                    }`}
                    aria-pressed={selectedAgent === agent.id}
                    aria-label={`Select ${agent.name}`}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-xs ${agent.color}`} />
                    <div className="text-xs font-medium">{agent.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="generation-prompt" className="block text-sm font-medium mb-sm">Generation Prompt</label>
            <textarea
              id="generation-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the AI agent to generate..."
              className="textarea-field w-full"
              rows={4}
              maxLength={500}
              aria-required="true"
              aria-invalid={error && !prompt.trim() ? "true" : "false"}
            />
            <div className="text-xs text-muted mt-xs">{prompt.length}/500 characters</div>
          </div>

          {error && <ErrorMessage message={error} className="mt-sm" />}

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || !title.trim() || isGenerating}
            className="btn-primary w-full flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Asset
              </>
            )}
          </button>
        </div>
      </div>

      {showToast && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </>
  );
}
