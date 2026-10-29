'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  Printer,
  ShieldCheck,
  AlertCircle,
  Loader2,
  HelpCircle,
  CalendarCheck,
} from 'lucide-react';
import { OrderSummary } from '@/types';
import { STORE_CONFIG, formatRupiah, sanitizeWhatsappNumber } from '@/config/store';
import { generateWhatsappOrderUrl, generateWhatsappHelpUrl } from '@/lib/whatsapp';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      setIsVerifying(false);
      return;
    }

    // 1. Muat data order dari sessionStorage atau localStorage lokal
    let loadedOrder: OrderSummary | null = null;
    try {
      const stored =
        sessionStorage.getItem(`ruparasa_order_${orderId}`) ||
        localStorage.getItem(`ruparasa_order_${orderId}`);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.orderSummary) {
          loadedOrder = parsed.orderSummary;
          setOrder(loadedOrder);
        }
      }
    } catch (e) {
      console.error('Gagal membaca order dari storage:', e);
    }

    // 2. Verifikasi status pembayaran resmi langsung ke server backend
    async function verifyWithServer() {
      try {
        const res = await fetch(`/api/payment/status?orderId=${encodeURIComponent(orderId!)}`);
        const data = await res.json();

        if (data.isMock) {
          setIsMock(true);
        }

        if (data.success && (data.isPaid || data.transactionStatus === 'settlement')) {
          setIsPaid(true);
          setStatusMessage(
            data.isMock
              ? 'Pembayaran berhasil disimulasikan (Mode Demo Pengujian Antarmuka).'
              : 'Pembayaran berhasil terverifikasi oleh payment gateway.'
          );
        } else {
          setIsPaid(false);
          setStatusMessage(
            data.transactionStatus
              ? `Status pembayaran saat ini: ${data.transactionStatus}`
              : 'Status pembayaran belum terkonfirmasi.'
          );
        }
      } catch (err) {
        console.error('Error saat verifikasi status:', err);
        if (loadedOrder && loadedOrder.status === 'settlement') {
          setIsPaid(true);
        }
      } finally {
        setIsVerifying(false);
      }
    }

    verifyWithServer();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const helpWhatsappUrl = generateWhatsappHelpUrl(orderId || undefined);
  const scheduleText =
    order?.customer?.deliverySchedule || order?.deliverySchedule || 'Sesuai jadwal PO aktif (Senin/Rabu)';

  if (isVerifying) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700 mb-3" />
        <p className="text-sm font-semibold text-neutral-600">
          Memverifikasi status pesanan Pre-Order...
        </p>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-neutral-900">ID Pesanan Tidak Ditemukan</h1>
        <p className="mt-2 text-xs text-neutral-600">
          Silakan periksa kembali tautan Anda atau kembali ke halaman utama.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-5 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const whatsappUrl = order ? generateWhatsappOrderUrl(order) : helpWhatsappUrl;

  return (
    <div className="min-h-screen bg-neutral-50/70 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Nota PO</span>
          </button>
        </div>

        {/* Receipt Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/90 overflow-hidden">
          {/* Header Status Banner */}
          <div
            className={`px-6 py-6 text-center ${
              isPaid
                ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-white/20 mb-2">
              {isPaid
                ? isMock
                  ? 'Pre-Order Berhasil (Mode Demo)'
                  : 'Pre-Order Terverifikasi Lunas'
                : 'Status Menunggu Pembayaran'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isPaid ? 'Pre-Order Mie Jebew Diterima!' : 'Konfirmasi Pesanan Pre-Order'}
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
              {statusMessage ||
                'Pesanan Anda telah tercatat dan akan dipersiapkan segar dari dapur kami sesuai jadwal distribusi.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Banner Jadwal Pre-Order */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                  Jadwal Pengambilan / Pengantaran Terpilih:
                </span>
                <span className="font-extrabold text-sm text-neutral-900 block mt-0.5">
                  {scheduleText}
                </span>
                <span className="text-neutral-500 text-[11px] block mt-0.5">
                  Metode:{' '}
                  {order?.customer?.deliveryType === 'pickup'
                    ? 'Ambil Sendiri di Dapur Rupa-Rasa'
                    : 'Diantar ke Alamat Pemesan'}
                </span>
              </div>
            </div>

            {/* Order Identity Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
              <div>
                <span className="text-neutral-500 font-medium block">Nomor Pesanan</span>
                <span className="font-mono font-black text-neutral-900 text-sm">
                  {orderId}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 font-medium block">Metode Pembayaran</span>
                <span className="font-bold text-emerald-800">
                  {isMock ? 'QRIS (Mode Demo)' : 'QRIS Dinamis (Terverifikasi)'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 font-medium block">Status Transaksi</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isPaid ? (isMock ? 'Lunas (Demo)' : 'Lunas') : 'Belum Lunas'}</span>
                </span>
              </div>
            </div>

            {/* Rincian Pelanggan (Jika sesi lokal tersedia) */}
            {order ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <span className="font-bold text-neutral-700 block mb-2">
                    Data Pemesan:
                  </span>
                  <div className="space-y-1 text-neutral-600">
                    <div>
                      <strong>Nama:</strong> {order.customer.name}
                    </div>
                    <div>
                      <strong>WhatsApp:</strong> {order.customer.phone}
                    </div>
                    {order.customer.notes && (
                      <div>
                        <strong>Catatan:</strong> {order.customer.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                  <span className="font-bold text-neutral-700 block mb-2">
                    Alamat Pengantaran / Lokasi:
                  </span>
                  <p className="text-neutral-600 leading-relaxed">
                    {order.customer.address}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  Detail formulir hanya disimpan secara aman pada sesi browser Anda. Anda dapat mengonfirmasi nomor pesanan ini ke WhatsApp toko.
                </p>
              </div>
            )}

            {/* Rincian Menu Pesanan */}
            {order && (
              <div>
                <h3 className="font-bold text-sm text-neutral-900 mb-3">
                  Rincian Item Menu Pre-Order:
                </h3>
                <div className="divide-y divide-neutral-100 border-y border-neutral-100 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-900">{item.name}</span>
                        <span className="text-neutral-500 block">
                          {item.quantity} x {formatRupiah(item.price)}
                        </span>
                      </div>
                      <span className="font-bold text-neutral-900">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Ongkir & Total */}
                <div className="pt-3 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">
                      {formatRupiah(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Pengantaran</span>
                    <span className="font-bold text-neutral-900">
                      {order.shippingFee === 0 ? 'Gratis / Ambil Sendiri' : formatRupiah(order.shippingFee)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                    <span className="font-black text-neutral-900">Total Pembayaran</span>
                    <span className="font-black text-lg text-emerald-800">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons: WhatsApp Toko */}
            <div className="pt-4 space-y-3 print:hidden">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-700/25 active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>Konfirmasi ke WhatsApp Toko (+{storePhone})</span>
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={helpWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-500 hover:text-emerald-800 underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ada kendala atau pertanyaan? Hubungi admin toko</span>
                </a>

                <Link
                  href="/"
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  Lihat Menu Pre-Order Lainnya &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
