'use client';

import React, { useState } from 'react';
import { Plus, Check, Utensils, Coffee, Clock } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/config/store';
import { useCart } from '@/context/CartContext';
import { PREORDER_CONFIG } from '@/config/preorder';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const isPoOpen = PREORDER_CONFIG.isOpen;
  const canOrder = product.isAvailable && isPoOpen;

  const handleAdd = () => {
    if (!canOrder) return;
    addToCart(product, 1);
    setIsAddedAnim(true);
    setTimeout(() => {
      setIsAddedAnim(false);
    }, 1200);
  };

  const isFood = product.category === 'Makanan';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-neutral-200/90 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md bg-white/90 text-neutral-800">
          {isFood ? (
            <Utensils className="w-3 h-3 text-emerald-600" />
          ) : (
            <Coffee className="w-3 h-3 text-teal-600" />
          )}
          <span>{product.category}</span>
        </div>

        {/* Custom Badge PO (e.g. Menu Utama PO, Rekomendasi) */}
        {product.badge && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-emerald-700 text-white shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Status Jika Pre-Order Ditutup */}
        {!isPoOpen ? (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-amber-200 text-xs font-bold uppercase tracking-wider shadow border border-amber-400/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>PO Ditutup</span>
            </span>
          </div>
        ) : !product.isAvailable ? (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow">
              Stok Habis
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-neutral-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Harga Pre-Order</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-emerald-800">
                {formatRupiah(product.price)}
              </span>
              <span className="text-[11px] font-medium text-neutral-500">
                / {product.unit}
              </span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!canOrder}
            type="button"
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95 ${
              !canOrder
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : isAddedAnim
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-800/15'
            }`}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            {!isPoOpen ? (
              <span>PO Ditutup</span>
            ) : !product.isAvailable ? (
              <span>Habis</span>
            ) : isAddedAnim ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span className="hidden xs:inline">Ditambahkan</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>+ Pesan PO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
