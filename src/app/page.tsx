'use client';

import React from 'react';
import { Calendar, Clock, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/config/products';
import { PREORDER_CONFIG } from '@/config/preorder';

export default function HomePage() {
  const isOpen = PREORDER_CONFIG.isOpen;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* =========================================================================
          SECTION INFORMASI PRE-ORDER & MEKANISME JADWAL
          ========================================================================= */}
      <section id="informasi-po" className="py-12 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner Peringatan Jika Pre-Order Sedang Ditutup */}
          {!isOpen && (
            <div className="mb-10 p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3.5 text-amber-900 shadow-sm">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-base">Pre-Order Saat Ini Sedang Ditutup</h3>
                <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
                  Terima kasih atas antusiasme Anda! Kuota pemesanan batch ini telah terpenuhi atau
                  sudah melewati batas waktu pemesanan. Pemesanan baru akan dibuka kembali pada batch
                  berikutnya.
                </p>
              </div>
            </div>
          )}

          {/* Kartu Informasi Utama Pre-Order */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-amber-50/30 to-white rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sistem Pemesanan Pre-Order Rupa-Rasa</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Disiapkan Fresh Berdasarkan Pesanan Anda
                </h2>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {PREORDER_CONFIG.announcement} Seluruh porsi Mie Jebew dimasak mendadak saat hari
                  pengambilan atau pengantaran tiba untuk menjaga cita rasa dan tekstur kenyal terbaik.
                </p>

                {/* Grid Info Periode & Distribusi */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Periode Pemesanan</span>
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      {PREORDER_CONFIG.orderPeriod.displayPeriod}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {PREORDER_CONFIG.orderPeriod.deadlineNote}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Jadwal Pengambilan / Kirim</span>
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      {PREORDER_CONFIG.distributionDaysNote}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Slot waktu: {PREORDER_CONFIG.schedules[0]?.timeSlot}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Quick Action Card */}
              <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-emerald-100 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <span className="text-xs font-semibold text-neutral-500">Status Pre-Order</span>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        isOpen
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {isOpen ? PREORDER_CONFIG.statusLabel : 'DITUTUP'}
                    </span>
                  </div>

                  <div className="py-4 space-y-2">
                    <div className="text-xs text-neutral-600 flex justify-between items-center">
                      <span>Promo Spesial:</span>
                      <strong className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-black">
                        Paket Bundling Mie Jebew + Lemon Tea
                      </strong>
                    </div>
                    <div className="text-xs text-neutral-600 flex justify-between">
                      <span>Harga Bundling:</span>
                      <strong className="text-emerald-800">Rp 15.000 (Hemat Rp 5.000)</strong>
                    </div>
                    <div className="text-xs text-neutral-600 flex justify-between">
                      <span>Jadwal Distribusi:</span>
                      <strong className="text-neutral-900">Senin & Rabu</strong>
                    </div>
                  </div>
                </div>

                <a
                  href="#katalog"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all ${
                    isOpen
                      ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-800/20'
                      : 'bg-neutral-600 hover:bg-neutral-700'
                  }`}
                >
                  <span>{isOpen ? 'Lihat Menu & Pesan Pre-Order' : 'Lihat Daftar Menu'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 4 Langkah Mekanisme Pemesanan */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Cara Mudah Pre-Order di Rupa-Rasa
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Ikuti 4 langkah sederhana berikut untuk memesan Mie Jebew & Lemon Tea favorit Anda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PREORDER_CONFIG.steps.map((st) => (
                <div
                  key={st.number}
                  className="bg-neutral-50/80 rounded-2xl p-5 border border-neutral-200/80 relative hover:border-emerald-300 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md mb-3">
                    {st.number}
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">{st.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{st.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION KATALOG MENU PRE-ORDER
          ========================================================================= */}
      <section id="katalog" className="py-16 bg-neutral-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              Katalog Pre-Order Rupa-Rasa
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Paket Bundling Pre-Order Rupa-Rasa
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600">
              Satu paket hemat spesial Market Day: 1 porsi Mie Jebew + 1 cup Lemon Tea cuma Rp 15.000.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}