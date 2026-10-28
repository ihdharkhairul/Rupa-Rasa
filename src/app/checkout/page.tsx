'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Check,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/config/store';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, total, clearCart, isHydrated } = useCart();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // UI State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Validasi Input
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter.';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      newErrors.phone = 'Nomor WhatsApp harus berupa 9 - 15 digit angka.';
    }

    if (!address.trim()) {
      newErrors.address = 'Alamat pengiriman wajib diisi.';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Alamat terlalu singkat. Mohon cantumkan alamat lengkap beserta patokan.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setApiError(null);

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setApiError('Keranjang Anda kosong. Silakan tambahkan menu terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend Route Handler akan menghitung ulang total harga secara tepercaya dari katalog!
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim(),
        },
      };

      const res = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat membuat transaksi QRIS.');
      }

      // Simpan session pesanan di browser sessionStorage untuk halaman pembayaran & WhatsApp
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          `ruparasa_order_${data.orderId}`,
          JSON.stringify({
            orderSummary: data.orderSummary,
            orderToken: data.orderToken,
          })
        );
      }

      // Kosongkan keranjang belanja
      clearCart();

      // Alihkan ke Halaman Menunggu Pembayaran
      router.push(`/payment/${encodeURIComponent(data.orderId)}`);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Checkout error:', error);
      setApiError(error.message || 'Gagal menghubungi server. Silakan coba beberapa saat lagi.');
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-neutral-900">Keranjang Belanja Kosong</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Anda belum memilih menu makanan atau minuman apapun.
        </p>
        <Link
          href="/#katalog"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 text-white font-bold text-sm shadow-md hover:bg-emerald-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Checkout Pesanan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">
            Lengkapi data pengiriman untuk melanjutkan pembayaran QRIS instan.
          </p>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div>
              <span className="font-bold block">Gagal Memproses Transaksi</span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Formulir Checkout Pelanggan */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/90">
            <h2 className="text-lg font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <span>Informasi Pengiriman</span>
              <span className="text-xs font-normal text-neutral-400">* Wajib diisi</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama Lengkap */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-bold text-neutral-800 mb-1.5"
                >
                  Nama Lengkap *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-all ${
                    errors.name
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400/20'
                      : 'border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-bold text-neutral-800 mb-1.5"
                >
                  Nomor WhatsApp Pelanggan *
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-all ${
                    errors.phone
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400/20'
                      : 'border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20'
                  }`}
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Untuk konfirmasi pesanan dan koordinasi pengantaran via WhatsApp.
                </p>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Alamat Pengiriman */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs sm:text-sm font-bold text-neutral-800 mb-1.5"
                >
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, dan patokan (misal: pagar hitam depan masjid)..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-all ${
                    errors.address
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400/20'
                      : 'border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.address}</p>
                )}
              </div>

              {/* Catatan Khusus */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs sm:text-sm font-bold text-neutral-800 mb-1.5"
                >
                  Catatan untuk Dapur (Opsional)
                </label>
                <input
                  id="notes"
                  type="text"
                  placeholder="Contoh: Jangan terlalu pedas, es dipisah, sendok plastik..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
                />
              </div>

              {/* Metode Pembayaran: QRIS */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2">
                  Metode Pembayaran
                </label>
                <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                        <span>QRIS Dinamis</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          Otomatis
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, Dana, dll.
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Tombol Bayar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white font-bold text-base shadow-lg shadow-emerald-800/20 active:scale-98 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menyiapkan QRIS Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Bayar Sekarang ({formatRupiah(total)})</span>
                    </>
                  )}
                </button>
                <p className="mt-2.5 text-center text-[11px] text-neutral-500">
                  Pembayaran diproses secara aman menggunakan payment gateway resmi.
                </p>
              </div>
            </form>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200/90 space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center justify-between">
              <span>Ringkasan Menu</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                {cart.length} menu
              </span>
            </h2>

            {/* List Item */}
            <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-neutral-500">
                      {item.quantity} x {formatRupiah(item.product.price)}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-neutral-800">
                    {formatRupiah(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-neutral-200 space-y-2.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal Pesanan</span>
                <span className="font-bold text-neutral-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span className="font-bold text-neutral-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold">Gratis (Promo)</span>
                  ) : (
                    formatRupiah(shippingFee)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                <span className="font-black text-neutral-900">Total Tagihan</span>
                <span className="font-black text-lg text-emerald-800">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Total pembayaran dihitung ulang dan diverifikasi langsung oleh backend sesuai harga katalog resmi toko.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
