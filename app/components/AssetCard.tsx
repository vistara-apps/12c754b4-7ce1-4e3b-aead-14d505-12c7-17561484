"use client";

import { useState } from "react";
import { Lock, DollarSign, User, Calendar, Sparkles, Zap, Briefcase, Search } from "lucide-react";
import type { NFTAsset } from "../lib/storage";
import { ExpandableText } from "./ui/ExpandableText";
import { ConfirmationDialog } from "./ui/ConfirmationDialog";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleLockRequest = () => {
    setShowLockModal(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmLock = () => {
    handleLock();
    setShowConfirmDialog(false);
  };

  const truncateContent = (content: string, maxLength = 80) => {
    if (showFullContent || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      <div className="card-hover animate-slide-up p-md sm:p-lg">
        <div className="flex items-start justify-between mb-md">
          <div className="flex items-center gap-xs sm:gap-sm">
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
            <span className="badge-primary text-xs sm:text-sm capitalize">{asset.agentType}</span>
          </div>
          {asset.locked && (
            <div className="flex items-center gap-xs text-success">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Locked</span>
            </div>
          )}
        </div>

        <h3 className="text-md sm:text-lg font-bold mb-sm line-clamp-2">{asset.title}</h3>

        <div className="mb-md">
          <p className="text-xs sm:text-sm text-muted mb-xs sm:mb-sm">Prompt:</p>
          <div className="bg-bg/50 p-xs sm:p-sm rounded-sm border border-white/5">
            <ExpandableText 
              text={asset.prompt} 
              maxLength={80}
              textClassName="text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="mb-md sm:mb-lg">
          <p className="text-xs sm:text-sm text-muted mb-xs sm:mb-sm">Generated Content:</p>
          <div className="bg-bg/50 p-xs sm:p-sm rounded-sm border border-white/5">
            <ExpandableText 
              text={asset.content} 
              maxLength={150}
              textClassName="text-xs sm:text-sm whitespace-pre-wrap"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted mb-md sm:mb-lg">
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
                className="btn-primary w-full flex items-center justify-center gap-xs text-sm sm:text-base"
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                Lock & Sell
              </button>
            )
          )}
        </div>
      </div>

      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-md sm:p-lg z-50 animate-fade-in">
          <div className="card max-w-md w-full animate-slide-up">
            <h3 className="text-lg font-bold mb-md sm:mb-lg">Lock Asset for Sale</h3>
            <p className="text-sm text-muted mb-md sm:mb-lg">
              Set a price to lock this asset and create an NFT for sale.
            </p>
            
            <div className="mb-md sm:mb-lg">
              <label className="block text-sm font-medium mb-sm">Price (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={lockPrice}
                onChange={(e) => setLockPrice(e.target.value)}
                placeholder="0.1"
                className="input-field w-full"
                aria-label="Asset price in ETH"
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
                onClick={handleLockRequest}
                disabled={!lockPrice || parseFloat(lockPrice) <= 0}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Confirm Asset Lock"
        message="Once locked, this asset will be tokenized as an NFT and cannot be modified. Are you sure you want to proceed?"
        confirmText="Lock Asset"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleConfirmLock}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
}
