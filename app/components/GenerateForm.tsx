
"use client";

import { useState } from "react";
import { Sparkles, Zap, Briefcase, Search, Loader2 } from "lucide-react";
import { generateAIContent } from "../lib/openai";
import { assetStorage, type NFTAsset } from "../lib/storage";

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

  const handleGenerate = async () => {
    if (!prompt.trim() || !title.trim()) return;

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
      
      // Reset form
      setPrompt("");
      setTitle("");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-xl font-bold text-gradient mb-lg">Generate AI Asset</h2>
      
      <div className="space-y-lg">
        <div>
          <label className="block text-sm font-medium mb-sm">Asset Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your AI asset a unique title"
            className="input-field w-full"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-sm">Select AI Agent</label>
          <div className="grid grid-cols-2 gap-sm">
            {agentTypes.map((agent) => {
              const Icon = agent.icon;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`p-md rounded-md border transition-all duration-200 ${
                    selectedAgent === agent.id
                      ? 'border-accent bg-accent/10 shadow-glow'
                      : 'border-white/20 bg-surface hover:border-white/30'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-xs ${agent.color}`} />
                  <div className="text-xs font-medium">{agent.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-sm">Generation Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want the AI agent to generate..."
            className="textarea-field w-full"
            rows={4}
            maxLength={500}
          />
          <div className="text-xs text-muted mt-xs">{prompt.length}/500 characters</div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || !title.trim() || isGenerating}
          className="btn-primary w-full flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
