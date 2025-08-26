"use client";

import { TrendingUp, Lock, DollarSign, Zap } from "lucide-react";
import { assetStorage } from "../lib/storage";

export function StatsOverview() {
  const allAssets = assetStorage.getAllAssets();
  const lockedAssets = allAssets.filter(asset => asset.locked);
  const totalValue = lockedAssets.reduce((sum, asset) => sum + (asset.price || 0), 0);

  const stats = [
    {
      label: "Total Assets",
      value: allAssets.length.toString(),
      icon: Zap,
      color: "text-accent"
    },
    {
      label: "Locked NFTs",
      value: lockedAssets.length.toString(),
      icon: Lock,
      color: "text-success"
    },
    {
      label: "Total Value",
      value: `${totalValue.toFixed(2)} ETH`,
      icon: DollarSign,
      color: "text-warning"
    },
    {
      label: "Market Activity",
      value: `${Math.floor(Math.random() * 50 + 10)}%`,
      icon: TrendingUp,
      color: "text-accent-secondary"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-xl">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.label} 
            className="card animate-fade-in p-sm sm:p-md" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-sm mb-xs">
              <Icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted">{stat.label}</span>
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
