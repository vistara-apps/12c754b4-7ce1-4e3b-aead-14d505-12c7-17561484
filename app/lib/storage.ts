
// Simulated storage for demo purposes
// In production, this would use IPFS, Arweave, or similar decentralized storage

export interface NFTAsset {
  id: string;
  title: string;
  content: string;
  agentType: string;
  prompt: string;
  creator: string;
  locked: boolean;
  price?: number;
  timestamp: number;
  tokenId?: string;
  imageUrl?: string;
}

class AssetStorage {
  private assets: Map<string, NFTAsset> = new Map();

  saveAsset(asset: NFTAsset): void {
    this.assets.set(asset.id, asset);
    // In production: Save to IPFS/Arweave and return content hash
  }

  getAsset(id: string): NFTAsset | null {
    return this.assets.get(id) || null;
  }

  getAllAssets(): NFTAsset[] {
    return Array.from(this.assets.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  getAssetsByCreator(creator: string): NFTAsset[] {
    return this.getAllAssets().filter(asset => asset.creator === creator);
  }

  getMarketplaceAssets(): NFTAsset[] {
    return this.getAllAssets().filter(asset => asset.locked && asset.price);
  }

  lockAsset(id: string, price: number): boolean {
    const asset = this.assets.get(id);
    if (asset && !asset.locked) {
      asset.locked = true;
      asset.price = price;
      // In production: Mint NFT on blockchain
      asset.tokenId = `token_${Date.now()}`;
      this.assets.set(id, asset);
      return true;
    }
    return false;
  }
}

export const assetStorage = new AssetStorage();
