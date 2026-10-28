import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, QrCode, Sparkles, Utensils } from 'lucide-react';
import { STORE_CONFIG, sanitizeWhatsappNumber } from '@/config/store';

export function Hero() {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-12 sm:py-20 lg:py-24 border-b border-emerald-50">
      {/* Background soft circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Sisi Kiri: Teks Promosi */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Promo Spesial: Gratis Ongkir Min. Belanja Rp 100.000</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight sm:leading-[1.15]">
              Cita Rasa Otentik{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
                Makanan & Minuman
              </span>{' '}
              Nusantara
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Nikmati hidangan kuliner lezat yang diracik dari bahan segar pilihan.
              Pesan mudah, bayar instan pakai <strong>QRIS otomatis</strong>, dan konfirmasi langsung ke WhatsApp toko kami.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-800/25 active:scale-95 transition-all"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${storePhone}?text=${encodeURIComponent(
                  `Halo ${STORE_CONFIG.name}, saya ingin melihat menu rekomendasi hari ini.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm sm:text-base border border-neutral-300 shadow-sm active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Chat WhatsApp Toko</span>
              </a>
            </div>

            {/* Badges Garansi / Kepercayaan */}
            <div className="mt-10 pt-8 border-t border-neutral-200/80 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-neutral-800">100% Halal</div>
                  <div className="text-[11px] text-neutral-500 hidden sm:block">Bahan higienis</div>
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
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-neutral-800">Dimasak Segar</div>
                  <div className="text-[11px] text-neutral-500 hidden sm:block">Fresh saat dipesan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Visual Banner Makanan & Minuman */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Card visual showcase */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80"
                  alt="Nasi Goreng Spesial RupaRasa"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600 text-xs font-bold tracking-wide uppercase mb-1 w-max">
                    Menu Terlaris
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold">Nasi Goreng Spesial RupaRasa</h3>
                  <p className="text-sm text-neutral-200 mt-1 line-clamp-2">
                    Rempah Nusantara gurih, sate ayam bumbu kacang, telur mata sapi, dan acar segar.
                  </p>
                </div>
              </div>

              {/* Floating Mini Drink Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3 max-w-[220px] sm:max-w-[240px]">
                <img
                  src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=200&q=80"
                  alt="Es Kopi Susu Aren"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900 leading-tight">Es Kopi Susu Aren</div>
                  <div className="text-emerald-700 font-extrabold text-xs sm:text-sm mt-0.5">Rp 22.000</div>
                  <div className="text-[10px] text-neutral-500">100% Gula Aren Asli</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
