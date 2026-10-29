'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { STORE_CONFIG, formatRupiah } from '@/config/store';
import { PREORDER_CONFIG } from '@/config/preorder';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    total,
    totalItemsCount,
  } = useCart();

  if (!isCartOpen) return null;

  const isFreeShipping = subtotal >= STORE_CONFIG.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(
    0,
    STORE_CONFIG.freeShippingThreshold - subtotal
  );
  const isPoOpen = PREORDER_CONFIG.isOpen;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="font-bold text-lg text-neutral-900">
                Keranjang Pre-Order
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {totalItemsCount} item
              </span>
            </div>

            <button
              onClick={closeCart}
              type="button"
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Peringatan jika PO Tutup */}
          {!isPoOpen && cart.length > 0 && (
            <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Pre-Order sedang ditutup. Checkout tidak dapat diproses saat ini.
              </span>
            </div>
          )}

          {/* Banner Promo Ongkir */}
          {isPoOpen && cart.length > 0 && (
            <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              {isFreeShipping ? (
                <span className="font-semibold text-emerald-800">
                  Selamat! Anda mendapatkan promo <strong>Gratis Ongkir</strong>.
                </span>
              ) : (
                <span>
                  Tambah{' '}
                  <strong className="text-emerald-800">
                    {formatRupiah(remainingForFreeShipping)}
                  </strong>{' '}
                  lagi untuk <strong>Gratis Ongkir</strong>!
                </span>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-base text-neutral-900">
                  Keranjang Masih Kosong
                </h3>
                <p className="mt-1 text-xs text-neutral-500 max-w-xs">
                  Yuk, pilih Paket Bundling Mie Jebew + Lemon Tea favorit Anda untuk jadwal Pre-Order minggu ini!
                </p>
                <button
                  onClick={closeCart}
                  type="button"
                  className="mt-6 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all"
                >
                  Pilih Menu Pre-Order
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3 sm:gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        type="button"
                        className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-emerald-800 font-extrabold mt-0.5">
                      {formatRupiah(item.product.price)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          type="button"
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          type="button"
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-neutral-700">
                        {formatRupiah(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200/80 bg-neutral-50/50 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal Pesanan</span>
                  <span className="font-bold text-neutral-900">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span className="font-bold text-neutral-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700">Gratis (Promo)</span>
                    ) : (
                      formatRupiah(shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-neutral-900">Total Pembayaran</span>
                  <span className="font-black text-base text-emerald-800">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              {isPoOpen ? (
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-800/20 active:scale-98 transition-all"
                >
                  <span>Lanjut ke Checkout PO</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-neutral-300 text-neutral-500 font-bold text-sm cursor-not-allowed"
                >
                  <span>Pre-Order Sedang Ditutup</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
