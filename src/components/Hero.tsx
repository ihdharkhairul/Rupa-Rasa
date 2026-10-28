import React from 'react';
import {
  ArrowRight,
  MessageCircle,
  CalendarCheck,
  QrCode,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Soup,
} from 'lucide-react';
import { STORE_CONFIG, sanitizeWhatsappNumber } from '@/config/store';
import { PREORDER_CONFIG } from '@/config/preorder';

export function Hero() {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const isOpen = PREORDER_CONFIG.isOpen;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-white py-12 sm:py-20 lg:py-24 border-b border-emerald-100">
      {/* Background ambient blur circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Sisi Kiri: Teks Pre-Order & Penjelasan Jadwal */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Status Pre-Order Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-xs ${
                  isOpen
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                {isOpen ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                    </span>
                    <span>{PREORDER_CONFIG.statusLabel}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>PRE-ORDER DITUTUP</span>
                  </>
                )}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Periode: {PREORDER_CONFIG.orderPeriod.displayPeriod}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight sm:leading-[1.15]">
              Nikmati Gurih Pedas{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
                Mi Jebe Original
              </span>{' '}
              Sistem Pre-Order
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Pesanan Anda disiapkan segar dari dapur khusus berdasarkan jadwal Pre-Order. Pesan
              sekarang, bayar instan pakai <strong>QRIS otomatis</strong>, dan makanan siap diantar
              atau diambil sesuai jadwal pilihan Anda!
            </p>

            {/* Banner Info Jadwal Pre-Order Aktif */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-left max-w-xl mx-auto lg:mx-0 shadow-xs">
              <div className="flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <div className="font-extrabold text-emerald-950">
                    Jadwal Distribusi: {PREORDER_CONFIG.distributionDaysNote}
                  </div>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    {PREORDER_CONFIG.orderPeriod.deadlineNote}. Pesanan dibuat fresh saat hari pengiriman.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#katalog"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 ${
                  isOpen
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/25'
                    : 'bg-neutral-600 hover:bg-neutral-700 text-white'
                }`}
              >
                <span>{isOpen ? 'Pilih Menu & Pre-Order' : 'Lihat Menu Pre-Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${storePhone}?text=${encodeURIComponent(
                  `Halo ${STORE_CONFIG.name}, saya ingin bertanya mengenai jadwal Pre-Order Mi Jebe.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm sm:text-base border border-neutral-300 shadow-sm active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Tanya Admin WhatsApp</span>
              </a>
            </div>

            {/* Badges Garansi / Kepercayaan */}
            <div className="mt-10 pt-8 border-t border-neutral-200/80 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Soup className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-neutral-800">Fresh Batch</div>
                  <div className="text-[11px] text-neutral-500 hidden sm:block">Dimasak saat jadwal</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-neutral-800">QRIS Dinamis</div>
                  <div className="text-[11px] text-neutral-500 hidden sm:block">Semua Bank & e-Wallet</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-neutral-800">100% Halal</div>
                  <div className="text-[11px] text-neutral-500 hidden sm:block">Bahan rempah higienis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Visual Showcase Mi Jebe Original */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Card visual showcase */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=1000&q=80"
                  alt="Mi Jebe Original RupaRasa"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-xs font-bold tracking-wide uppercase">
                      Menu Utama Pre-Order
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-lime-400 text-emerald-950 text-xs font-extrabold">
                      Rp 25.000
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">Mi Jebe Original</h3>
                  <p className="text-xs sm:text-sm text-neutral-200 mt-1 line-clamp-2">
                    Mi kenyal bumbu Jebe pedas gurih, suwiran ayam rempah, dan keripik pangsit renyah.
                  </p>
                </div>
              </div>

              {/* Floating Jadwal Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3 max-w-[240px] sm:max-w-[270px]">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Jadwal Pengiriman
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-neutral-900 leading-tight">
                    Senin & Rabu
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Disiapkan segar & higienis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
