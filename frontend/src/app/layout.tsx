import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from '@/hooks/useWallet';
import { PXEProvider } from '@/hooks/usePXE';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tezac - NFT Platform',
  description: 'A platform for minting, transferring, and managing NFTs with privacy features',
  keywords: 'NFT, Aztec Network, privacy, blockchain, crypto, trading, zkRollup',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://tezac.xyz'),
  openGraph: {
    title: 'Tezac NFT Interactive App',
    description: 'Interactive app for Tezac NFT trading protocol',
    images: [
      {
        url: '/tezac-with-bg.png',
        width: 1200,
        height: 630,
        alt: 'Tezac NFT Interactive App',
      },
    ],
    type: 'website',
    url: '/',
    siteName: 'Tezac NFT Interactive App',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tezac NFT Interactive App',
    description: 'Interactive app for Tezac NFT trading protocol',
    images: ['/tezac-with-bg.png'],
    site: '@Tezac_xyz',
    creator: '@Tezac_xyz',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PXEProvider>
          <WalletProvider>
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </WalletProvider>
        </PXEProvider>
      </body>
    </html>
  );
}
