'use client';

import React, { useState, useMemo } from 'react';
import { Search, Utensils, Coffee, Sparkles, FilterX } from 'lucide-react';
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

  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.isFeatured);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Section (Produk Unggulan) */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Paling Disukai Pelanggan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Menu Unggulan Hari Ini
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
              Kombinasi hidangan makanan utama dan minuman penyegar paling favorit minggu ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={`featured-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="katalog" className="py-16 bg-neutral-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Daftar Menu Makanan & Minuman
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Pilih menu favorit Anda dari dua kategori utama kami: Makanan gurih dan Minuman segar.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-neutral-200/80 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-xl w-full sm:w-auto">
              {(['Semua', 'Makanan', 'Minuman'] as const).map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                    }`}
                  >
                    {cat === 'Makanan' && <Utensils className="w-3.5 h-3.5" />}
                    {cat === 'Minuman' && <Coffee className="w-3.5 h-3.5" />}
                    <span>{cat}</span>
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
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 max-w-md mx-auto my-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
