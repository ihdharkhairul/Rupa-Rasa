import React from 'react';
import Link from 'next/link';
import { Citrus, MessageCircle, MapPin, Clock, Phone, ShieldCheck, Camera } from 'lucide-react';
import { STORE_CONFIG, sanitizeWhatsappNumber } from '@/config/store';

export function Footer() {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);

  return (
    <footer id="tentang" className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Info Toko */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-300 flex items-center justify-center text-emerald-800 shadow-md">
                <Citrus className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">
                  {STORE_CONFIG.name}
                </span>
                <span className="text-xs text-emerald-400 font-medium block">
                  Makanan & Minuman Pilihan
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {STORE_CONFIG.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${storePhone}?text=${encodeURIComponent(
                  `Halo ${STORE_CONFIG.name}, saya ingin konfirmasi pesanan.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Kami</span>
              </a>
              <a
                href="https://www.instagram.com/ruparasa_jemon/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-semibold transition-colors"
                aria-label="Kunjungi Instagram @ruparasa_jemon"
              >
                <Camera className="w-4 h-4 text-rose-400" />
                <span>@ruparasa_jemon</span>
              </a>
            </div>
          </div>

          {/* Kategori Menu */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Kategori Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  Semua Menu Kuliner
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  Kategori Makanan Utama
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  Kategori Minuman Segar
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  Menu Promo & Gratis Ongkir
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Lokasi */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Kontak & Operasional
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{STORE_CONFIG.operatingHours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>+{storePhone}</span>
              </li>
            </ul>
          </div>

          {/* Keamanan & Sistem */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Keamanan Pembayaran
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Mendukung pembayaran <strong>QRIS dinamis otomatis</strong> melalui payment gateway Midtrans. Verifikasi dilakukan langsung dari server perbankan.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verifikasi Server-Side Aman</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} {STORE_CONFIG.name}. Seluruh hak cipta dilindungi.
          </p>
          <p className="mt-1 text-[11px] text-neutral-600">
            Toko e-commerce Makanan & Minuman dengan QRIS Dinamis dan Konfirmasi WhatsApp Otomatis.
          </p>
        </div>
      </div>
    </footer>
  );
}
