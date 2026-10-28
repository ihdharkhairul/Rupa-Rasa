'use client';

import React, { useState, useMemo } from 'react';
import { Search, Utensils, Coffee, FilterX } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS } from '@/config/products';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter produk berdasarkan kategori dan pencarian nama/deskripsi
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;

      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Hitung jumlah produk per kategori
  const countMakanan = PRODUCTS.filter((p) => p.category === 'Makanan').length;
  const countMinuman = PRODUCTS.filter((p) => p.category === 'Minuman').length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Main Catalog Section: Sederhana & Fokus pada 2 Menu Contoh */}
      <section id="katalog" className="py-16 bg-neutral-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              Katalog Menu Utama
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Pilihan Makanan & Minuman
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Menu pilihan berkualitas tinggi, diracik higienis dengan bahan segar pilihan.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="max-w-4xl mx-auto bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-neutral-200/80 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-xl w-full sm:w-auto">
              {[
                { label: 'Semua', count: PRODUCTS.length },
                { label: 'Makanan', count: countMakanan },
                { label: 'Minuman', count: countMinuman },
              ].map(({ label, count }) => {
                const isActive = selectedCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedCategory(label)}
                    type="button"
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                    }`}
                  >
                    {label === 'Makanan' && <Utensils className="w-3.5 h-3.5" />}
                    {label === 'Minuman' && <Coffee className="w-3.5 h-3.5" />}
                    <span>{label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari makanan atau minuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                  aria-label="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Product Grid: Tepat 2 Produk Berjejer Rapi */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 max-w-md mx-auto my-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
                <FilterX className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">
                Menu Tidak Ditemukan
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Tidak ada menu yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                }}
                className="mt-5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
