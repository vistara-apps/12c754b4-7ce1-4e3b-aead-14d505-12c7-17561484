
"use client";

import { useState } from "react";
import { Lock, DollarSign, User, Calendar, Sparkles, Zap, Briefcase, Search } from "lucide-react";
import type { NFTAsset } from "../lib/storage";

interface AssetCardProps {
  asset: NFTAsset;
  onLock?: (id: string, price: number) => void;
  showFullContent?: boolean;
}

const agentIcons = {
  creative: Sparkles,
  technical: Zap,
  business: Briefcase,
  research: Search,
};

const agentColors = {
  creative: 'text-accent',
  technical: 'text-accent-secondary',
  business: 'text-warning',
  research: 'text-success',
};

export function AssetCard({ asset, onLock, showFullContent = false }: AssetCardProps) {
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPrice, setLockPrice] = useState("");

  const Icon = agentIcons[asset.agentType as keyof typeof agentIcons] || Sparkles;
  const iconColor = agentColors[asset.agentType as keyof typeof agentColors] || 'text-accent';

  const handleLock = () => {
    const price = parseFloat(lockPrice);
    if (price > 0 && onLock) {
      onLock(asset.id, price);
      setShowLockModal(false);
      setLockPrice("");
    }
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (showFullContent || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div className="card-hover animate-slide-up">
        <div className="flex items-start justify-between mb-md">
          <div className="flex items-center gap-sm">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <span className="badge-primary capitalize">{asset.agentType}</span>
          </div>
          {asset.locked && (
            <div className="flex items-center gap-xs text-success">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold mb-sm line-clamp-2">{asset.title}</h3>

        <div className="mb-md">
          <p className="text-sm text-muted mb-sm">Prompt:</p>
          <p className="text-sm bg-bg/50 p-sm rounded-sm border border-white/5">
            {truncateContent(asset.prompt, 80)}
          </p>
        </div>

        <div className="mb-lg">
          <p className="text-sm text-muted mb-sm">Generated Content:</p>
          <div className="bg-bg/50 p-sm rounded-sm border border-white/5">
            <p className="text-sm whitespace-pre-wrap">
              {truncateContent(asset.content)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted mb-lg">
          <div className="flex items-center gap-xs">
            <User className="w-3 h-3" />
            <span>{asset.creator.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-xs">
            <Calendar className="w-3 h-3" />
            <span>{new Date(asset.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-sm">
          {asset.locked && asset.price ? (
            <div className="flex items-center gap-xs text-success font-medium">
              <DollarSign className="w-4 h-4" />
              <span>{asset.price} ETH</span>
            </div>
          ) : (
            onLock && (
              <button
                onClick={() => setShowLockModal(true)}
                className="btn-primary flex-1 flex items-center justify-center gap-xs"
              >
                <Lock className="w-4 h-4" />
                Lock & Sell
              </button>
            )
          )}
        </div>
      </div>

      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-lg z-50">
          <div className="card max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-bold mb-lg">Lock Asset for Sale</h3>
            <p className="text-sm text-muted mb-lg">
              Set a price to lock this asset and create an NFT for sale.
            </p>
            
            <div className="mb-lg">
              <label className="block text-sm font-medium mb-sm">Price (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={lockPrice}
                onChange={(e) => setLockPrice(e.target.value)}
                placeholder="0.1"
                className="input-field w-full"
              />
            </div>

            <div className="flex gap-sm">
              <button
                onClick={() => setShowLockModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleLock}
                disabled={!lockPrice || parseFloat(lockPrice) <= 0}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Lock Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
