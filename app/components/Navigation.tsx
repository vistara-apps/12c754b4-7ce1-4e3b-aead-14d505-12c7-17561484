"use client";

import { Sparkles, Store, User, Plus } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'generate', name: 'Generate', icon: Plus },
  { id: 'marketplace', name: 'Marketplace', icon: Store },
  { id: 'portfolio', name: 'Portfolio', icon: User },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="flex bg-surface border border-white/10 rounded-lg p-xs mb-lg sm:mb-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-xs py-xs sm:py-sm px-xs sm:px-md rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-glow'
                : 'text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
