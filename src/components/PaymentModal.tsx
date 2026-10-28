'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, FileText, ArrowRight, X, Sparkles, CalendarCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderSummary } from '@/types';
import { formatRupiah, STORE_CONFIG, sanitizeWhatsappNumber } from '@/config/store';
import { generateWhatsappOrderUrl } from '@/lib/whatsapp';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderSummary;
  isMockMode?: boolean;
}

export function PaymentModal({ isOpen, onClose, order, isMockMode = false }: PaymentModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Efek konfeti perayaan pembayaran berhasil terverifikasi
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappUrl = generateWhatsappOrderUrl(order);
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const scheduleText =
    order.customer.deliverySchedule || order.deliverySchedule || 'Sesuai jadwal PO (Senin/Rabu)';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="min-h-full flex items-center justify-center p-4 text-center sm:p-0">
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-left shadow-2xl border border-emerald-100 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Tutup pop-up"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon & Title */}
          <div className="text-center pt-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                isMockMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isMockMode && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
              <span>
                {isMockMode
                  ? 'Status: Berhasil (Simulasi Mode Demo)'
                  : 'Status: Terverifikasi Lunas'}
              </span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Pre-Order Dikonfirmasi!
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
              {isMockMode
                ? 'Simulasi pengujian antarmuka berhasil. Silakan lanjut ke WhatsApp untuk mengirimkan pesan konfirmasi Pre-Order.'
                : 'Terima kasih! Pembayaran QRIS Anda telah kami verifikasi resmi. Makanan siap diproses saat jadwal tiba.'}
            </p>
          </div>

          {/* Rincian Pesanan & Jadwal PO */}
          <div className="mt-6 bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/80 space-y-3">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Nomor Pesanan</span>
              <span className="font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                {order.orderId}
              </span>
            </div>

            {/* Jadwal Pre-Order */}
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                  Jadwal Pengambilan / Pengantaran
                </span>
                <span className="font-extrabold text-neutral-900">{scheduleText}</span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 max-h-36 overflow-y-auto pr-1">
              <span className="font-bold text-neutral-700 block">Menu Pre-Order:</span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-neutral-600">
                  <span className="truncate pr-2">
                    {item.name} <strong className="text-neutral-900">x{item.quantity}</strong>
                  </span>
                  <span className="font-semibold text-neutral-900 flex-shrink-0">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-neutral-700">Total Pembayaran</span>
              <span className="text-lg font-black text-emerald-700">
                {formatRupiah(order.total)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Tombol Utama: Lanjut ke WhatsApp Toko */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-700/30 active:scale-98 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Konfirmasi ke WhatsApp Toko (+{storePhone})</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Tombol Alternatif: Lihat Detail Pesanan */}
            <Link
              href={`/order/success?orderId=${encodeURIComponent(order.orderId)}`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs sm:text-sm border border-neutral-300 transition-colors"
            >
              <FileText className="w-4 h-4 text-neutral-500" />
              <span>Lihat Nota Lengkap Pesanan</span>
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] text-neutral-500 leading-normal">
            * Menekan tombol di atas akan membuka aplikasi WhatsApp dengan format pesanan Pre-Order yang sudah terisi otomatis. Anda cukup menekan tombol <strong>Kirim</strong> di WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
