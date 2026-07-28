import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { WalletProvider } from '@/context/WalletContext';

export const metadata: Metadata = {
  title: 'SmartWallet AI — Daily Safe-Spend Limit PWA',
  description: 'Personal finance app for students and young adults with dynamic safe spend calculation',
  manifest: '/manifest.json',
  themeColor: '#173404',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F7F9F4] text-gray-900 min-h-screen antialiased selection:bg-[#C0DD97] selection:text-[#173404]">
        <LanguageProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
