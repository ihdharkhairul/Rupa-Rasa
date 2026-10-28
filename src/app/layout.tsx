import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { STORE_CONFIG } from '@/config/store';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: `${STORE_CONFIG.name} — Toko Makanan & Minuman Nusantara`,
  description: STORE_CONFIG.description,
  keywords: [
    'makanan',
    'minuman',
    'kuliner nusantara',
    'pesan makanan online',
    'qris dinamis',
    'konfirmasi whatsapp',
    'ruparasa',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#fbfcfb] text-[#1c2621] antialiased selection:bg-emerald-200 selection:text-emerald-950">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
