
"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useState, useCallback } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Navigation } from "./components/Navigation";
import { GenerateForm } from "./components/GenerateForm";
import { AssetCard } from "./components/AssetCard";
import { StatsOverview } from "./components/StatsOverview";
import { assetStorage, type NFTAsset } from "./lib/storage";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [assets, setAssets] = useState<NFTAsset[]>([]);
  const [userAddress, setUserAddress] = useState<string>();

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    // Load existing assets
    setAssets(assetStorage.getAllAssets());
  }, []);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleAssetGenerated = useCallback((newAsset: NFTAsset) => {
    setAssets(prev => [newAsset, ...prev]);
    setActiveTab("portfolio");
  }, []);

  const handleLockAsset = useCallback((assetId: string, price: number) => {
    const success = assetStorage.lockAsset(assetId, price);
    if (success) {
      setAssets(assetStorage.getAllAssets());
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "generate":
        return (
          <div className="space-y-xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient mb-sm">AI Agent NFT Marketplace</h1>
              <p className="text-muted">Generate unique AI content and tokenize it as NFTs</p>
            </div>
            <StatsOverview />
            <GenerateForm onGenerated={handleAssetGenerated} userAddress={userAddress} />
          </div>
        );
      
      case "marketplace":
        const marketplaceAssets = assets.filter(asset => asset.locked);
        return (
          <div className="space-y-xl">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-sm">NFT Marketplace</h2>
              <p className="text-muted">Discover and collect unique AI-generated assets</p>
            </div>
            {marketplaceAssets.length === 0 ? (
              <div className="card text-center">
                <Sparkles className="w-12 h-12 text-muted mx-auto mb-md" />
                <h3 className="font-medium mb-sm">No NFTs Available</h3>
                <p className="text-sm text-muted">Generate and lock some assets to see them here!</p>
              </div>
            ) : (
              <div className="space-y-lg">
                {marketplaceAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            )}
          </div>
        );
      
      case "portfolio":
        const userAssets = userAddress 
          ? assets.filter(asset => asset.creator === userAddress)
          : assets;
        return (
          <div className="space-y-xl">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-sm">Your Portfolio</h2>
              <p className="text-muted">Manage your AI-generated assets</p>
            </div>
            {userAssets.length === 0 ? (
              <div className="card text-center">
                <Plus className="w-12 h-12 text-muted mx-auto mb-md" />
                <h3 className="font-medium mb-sm">No Assets Yet</h3>
                <p className="text-sm text-muted mb-lg">Start by generating your first AI asset!</p>
                <button
                  onClick={() => setActiveTab("generate")}
                  className="btn-primary"
                >
                  Generate Asset
                </button>
              </div>
            ) : (
              <div className="space-y-lg">
                {userAssets.map((asset) => (
                  <AssetCard 
                    key={asset.id} 
                    asset={asset} 
                    onLock={!asset.locked ? handleLockAsset : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const saveFrameButton = (() => {
    if (context && !context.client.added) {
      return (
        <button
          onClick={handleAddFrame}
          className="btn-ghost text-accent"
        >
          <Plus className="w-4 h-4" />
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="text-sm font-medium text-success animate-fade-out">
          Saved
        </div>
      );
    }

    return null;
  })();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-bg via-bg to-surface">
      <div className="w-full max-w-md mx-auto px-lg py-md">
        <header className="flex justify-between items-center mb-lg">
          <Wallet className="z-10">
            <ConnectWallet>
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-lg pt-md pb-sm" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
          <div>{saveFrameButton}</div>
        </header>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1">
          {renderContent()}
        </main>

        <footer className="mt-2xl pt-lg flex justify-center">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="btn-ghost text-xs"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
