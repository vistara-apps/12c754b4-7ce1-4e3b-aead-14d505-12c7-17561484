
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: "AI Agent NFT Marketplace",
    description: "Generate, lock, and sell AI agent outputs as unique tokenized assets",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${URL}/og-image.png`,
        button: {
          title: "Launch AI Agent NFT Marketplace",
          action: {
            type: "launch_frame",
            name: "AI Agent NFT Marketplace",
            url: URL,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#1c1f2e",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
