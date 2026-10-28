'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Citrus, MessageCircle, Camera } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { STORE_CONFIG, sanitizeWhatsappNumber } from '@/config/store';

export function Navbar() {
  const { totalItemsCount, openCart, isHydrated } = useCart();
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Toko */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-lime-300 flex items-center justify-center text-emerald-800 shadow-md shadow-lime-700/20 group-hover:scale-105 transition-transform">
              <Citrus className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-neutral-900 tracking-tight block">
                {STORE_CONFIG.name}
              </span>
              <span className="text-[11px] font-medium text-emerald-700 block -mt-0.5">
                Makanan & Minuman Pilihan
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-neutral-600">
            <Link
              href="/"
              className="hover:text-emerald-700 transition-colors py-1 hover:border-b-2 hover:border-emerald-600"
            >
              Beranda
            </Link>
            <Link
              href="/#katalog"
              className="hover:text-emerald-700 transition-colors py-1 hover:border-b-2 hover:border-emerald-600"
            >
              Katalog Menu
            </Link>
            <Link
              href="/#tentang"
              className="hover:text-emerald-700 transition-colors py-1 hover:border-b-2 hover:border-emerald-600"
            >
              Tentang Toko
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Hubungi Toko */}
            <a
              href={`https://wa.me/${storePhone}?text=${encodeURIComponent(
                `Halo ${STORE_CONFIG.name}, saya ingin bertanya mengenai menu makanan dan minuman.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 sm:px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-all"
              title="Hubungi WhatsApp Toko"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp Toko</span>
            </a>

            <a
              href="https://www.instagram.com/ruparasa_jemon/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram RupaRasa Jemon"
              title="Instagram @ruparasa_jemon"
              className="inline-flex items-center justify-center w-9 h-9 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors"
            >
              <Camera className="w-4 h-4" />
            </a>

            {/* Tombol Keranjang */}
            <button
              onClick={openCart}
              type="button"
              className="relative flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-md shadow-emerald-800/20 active:scale-95 transition-all"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs sm:text-sm font-semibold hidden xs:inline">
                Keranjang
              </span>
              {isHydrated && totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full border-2 border-emerald-700 animate-in zoom-in-75">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
