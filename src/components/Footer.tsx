import React from 'react';
import Link from 'next/link';
import { Citrus, MessageCircle, MapPin, Clock, Phone, ShieldCheck, CalendarCheck } from 'lucide-react';
import { STORE_CONFIG, sanitizeWhatsappNumber } from '@/config/store';
import { PREORDER_CONFIG } from '@/config/preorder';

// Ikon Instagram vektor resmi (Lucide v0.45+ meniadakan ikon merek pihak ketiga)
function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const instagramHandle = STORE_CONFIG.instagram?.trim();
  const cleanInstagram = instagramHandle.replace(/^@/, '');
  const instagramUrl = cleanInstagram
    ? `https://instagram.com/${cleanInstagram}`
    : '#';

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
                  Sistem Pre-Order Mie Jebew & Kuliner
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Menyajikan Mie Jebew pedas gurih nagih dan Ice Lemon Tea segar dengan sistem Pre-Order. Seluruh hidangan disiapkan fresh saat jadwal distribusi tiba.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              {/* WhatsApp Contact */}
              <a
                href={`https://wa.me/${storePhone}?text=${encodeURIComponent(
                  `Halo ${STORE_CONFIG.name}, saya ingin konfirmasi jadwal Pre-Order.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition-all"
                title={`Chat WhatsApp: +${storePhone}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp</span>
              </a>

              {/* Instagram Toko */}
              {cleanInstagram ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-semibold transition-colors"
                  aria-label={`Kunjungi Instagram @${cleanInstagram}`}
                  title={`Instagram @${cleanInstagram}`}
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>@{cleanInstagram}</span>
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/60 border border-neutral-700/60 text-neutral-400 text-xs font-medium cursor-default"
                  title="Username Instagram dapat diatur via NEXT_PUBLIC_STORE_INSTAGRAM di .env.local"
                >
                  <InstagramIcon className="w-4 h-4 text-neutral-400" />
                  <span>Instagram Toko</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigasi Menu */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              3 Menu Pre-Order
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  1. Mi Jebe (Makanan)
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  2. Lemon Tea (Minuman)
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-emerald-400 transition-colors">
                  3. Paket Bundling Mi Jebe + Lemon Tea
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/#informasi-po" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Jadwal & Mekanisme PO</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Jadwal Pre-Order */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Jadwal Pre-Order
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Periode Pemesanan:</span>
                  <span>{PREORDER_CONFIG.orderPeriod.displayPeriod} ({PREORDER_CONFIG.orderPeriod.deadlineNote})</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CalendarCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Hari Pengantaran/Ambil:</span>
                  <span>{PREORDER_CONFIG.distributionDaysNote}</span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>+{storePhone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address}</span>
              </li>
            </ul>
          </div>

          {/* Keamanan & Sistem */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Keamanan Pembayaran
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Mendukung pembayaran <strong>QRIS otomatis</strong> melalui payment gateway resmi Midtrans. Transaksi diverifikasi secara aman oleh server backend kami.
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
            &copy; {new Date().getFullYear()} {STORE_CONFIG.name}. Pre-Order Makanan Berbasis QRIS & Konfirmasi WhatsApp Otomatis.
          </p>
        </div>
      </div>
    </footer>
  );
}
