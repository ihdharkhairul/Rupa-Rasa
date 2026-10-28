'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Clock,
  RefreshCw,
  MessageCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  XCircle,
  Info,
} from 'lucide-react';
import { PaymentModal } from '@/components/PaymentModal';
import { OrderSummary } from '@/types';
import { STORE_CONFIG, formatRupiah } from '@/config/store';
import { generateWhatsappHelpUrl } from '@/lib/whatsapp';

export default function PaymentWaitingPage() {
  const params = useParams();
  const rawOrderId = params.orderId as string;
  const orderId = decodeURIComponent(rawOrderId || '');

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'settlement' | 'expire' | 'cancel' | 'unknown'
  >('pending');
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Countdown timer 15 menit
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  // Ambil data order dari sessionStorage atau localStorage (bertahan saat reload/revisit)
  useEffect(() => {
    if (!orderId) return;

    try {
      const stored =
        sessionStorage.getItem(`ruparasa_order_${orderId}`) ||
        localStorage.getItem(`ruparasa_order_${orderId}`);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.orderSummary) {
          setOrder(parsed.orderSummary);
          if (parsed.orderSummary.status === 'settlement') {
            setPaymentStatus('settlement');
          }
        }
      }
    } catch (e) {
      console.error('Gagal membaca order dari storage:', e);
    }
  }, [orderId]);

  // Timer countdown
  useEffect(() => {
    if (paymentStatus !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('expire');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Fungsi pemeriksaan status pembayaran ke server
  const checkStatus = useCallback(
    async (simulate = false) => {
      if (!orderId || paymentStatus === 'settlement') return;

      setIsChecking(true);
      setErrorMessage(null);

      try {
        const url = `/api/payment/status?orderId=${encodeURIComponent(orderId)}${
          simulate ? '&simulateSuccess=true' : ''
        }`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.isMock) {
          setIsMockMode(true);
        }

        if (data.success) {
          if (data.isPaid || data.transactionStatus === 'settlement') {
            setPaymentStatus('settlement');
            setIsSuccessModalOpen(true);

            // Perbarui status pada order object dan simpan ke kedua storage
            if (order) {
              const updatedOrder = { ...order, status: 'settlement' as const };
              setOrder(updatedOrder);
              const payload = JSON.stringify({ orderSummary: updatedOrder });
              sessionStorage.setItem(`ruparasa_order_${orderId}`, payload);
              localStorage.setItem(`ruparasa_order_${orderId}`, payload);
            }
          } else if (data.transactionStatus === 'expire') {
            setPaymentStatus('expire');
          } else if (data.transactionStatus === 'cancel') {
            setPaymentStatus('cancel');
          }
        } else {
          setErrorMessage(data.error || 'Gagal memeriksa status');
        }
      } catch (err: unknown) {
        console.error('Gagal memeriksa status:', err);
        setErrorMessage('Terjadi gangguan jaringan saat memeriksa status pembayaran.');
      } finally {
        setIsChecking(false);
      }
    },
    [orderId, order, paymentStatus]
  );

  // Polling otomatis setiap 5-6 detik jika status masih pending
  useEffect(() => {
    if (paymentStatus !== 'pending') return;

    // Periksa pertama kali setelah 2 detik
    const initialTimer = setTimeout(() => {
      checkStatus(false);
    }, 2000);

    // Polling berkala
    const interval = setInterval(() => {
      checkStatus(false);
    }, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [paymentStatus, checkStatus]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const helpWhatsappUrl = generateWhatsappHelpUrl(orderId);

  return (
    <div className="min-h-screen bg-neutral-50/70 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Navigasi Kembali */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Toko</span>
          </Link>
          <a
            href={helpWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
            title="Hubungi admin via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Butuh Bantuan?</span>
          </a>
        </div>

        {/* Card Utama Pembayaran QRIS */}
        <div className="bg-white rounded-3xl shadow-md border border-neutral-200/90 overflow-hidden">
          {/* Top Status Bar */}
          <div
            className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-white transition-colors ${
              paymentStatus === 'settlement'
                ? 'bg-emerald-700'
                : paymentStatus === 'expire' || paymentStatus === 'cancel'
                ? 'bg-red-700'
                : 'bg-gradient-to-r from-emerald-800 to-teal-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {paymentStatus === 'pending' && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                </span>
              )}
              {paymentStatus === 'settlement' && <Check className="w-5 h-5 text-emerald-200" />}
              {(paymentStatus === 'expire' || paymentStatus === 'cancel') && (
                <XCircle className="w-5 h-5 text-red-200" />
              )}
              <span className="font-extrabold text-sm sm:text-base tracking-wide">
                {paymentStatus === 'settlement'
                  ? 'PEMBAYARAN BERHASIL DIVERIFIKASI'
                  : paymentStatus === 'expire'
                  ? 'WAKTU PEMBAYARAN KEDALUWARSA'
                  : paymentStatus === 'cancel'
                  ? 'TRANSAKSI DIBATALKAN'
                  : 'MENUNGGU PEMBAYARAN QRIS'}
              </span>
            </div>

            {/* Countdown Timer */}
            {paymentStatus === 'pending' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wider backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Batas Waktu: {formatTimer(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Banner Peringatan Mode Demo (Jika Midtrans belum aktif) */}
          {isMockMode && (
            <div className="bg-amber-500 text-white px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold shadow-inner">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>MODE DEMO / SIMULASI ANTARMUKA</span>
              </div>
              <span className="text-[11px] bg-amber-700/80 px-2.5 py-0.5 rounded-full font-semibold">
                Midtrans Belum Dikonfigurasi
              </span>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Keterangan Wajib: Pelanggan harus menyelesaikan pembayaran terlebih dahulu */}
            {paymentStatus === 'pending' && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
                <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Selesaikan Pembayaran Terlebih Dahulu</span>
                  <p className="text-emerald-800 leading-relaxed">
                    Mohon lakukan scan dan selesaikan pembayaran QRIS di bawah ini. Setelah Anda membayar di aplikasi, sistem kami akan memverifikasi status secara otomatis dan membuka pop-up konfirmasi WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* Info Order ID & Total Pembayaran */}
            <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs text-neutral-500 font-medium block">Nomor Pesanan</span>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                  <span className="font-mono font-black text-neutral-900 text-sm sm:text-base">
                    {orderId}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="p-1 text-neutral-400 hover:text-emerald-700 transition-colors"
                    title="Salin Nomor Pesanan"
                    aria-label="Salin Nomor Pesanan"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-neutral-500 font-medium block">Total yang Harus Dibayar</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-800">
                  {order ? formatRupiah(order.total) : 'Memuat total...'}
                </span>
              </div>
            </div>

            {/* AREA KODE QRIS */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-600 shadow-xl max-w-xs w-full flex flex-col items-center">
                {/* Header Logo QRIS */}
                <div className="w-full flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span className="font-black text-base tracking-wider text-neutral-900">
                      QRIS
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isMockMode
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isMockMode ? 'SIMULASI DEMO' : 'MIDTRANS OFFICIAL'}
                  </span>
                </div>

                {/* QR Display: Mode Asli vs Mode Demo */}
                <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-inner flex flex-col items-center justify-center">
                  {!isMockMode && order?.qrisData?.qrImageUrl ? (
                    // MODE ASLI DENGAN GAMBAR RESMI MIDTRANS
                    <img
                      src={order.qrisData.qrImageUrl}
                      alt="Kode QRIS Resmi Midtrans"
                      className="w-56 h-56 object-contain"
                    />
                  ) : !isMockMode && order?.qrisData?.qrString ? (
                    // MODE ASLI DENGAN STRING QR EMVCo RESMI
                    <QRCodeSVG
                      value={order.qrisData.qrString}
                      size={220}
                      level="M"
                      includeMargin={false}
                    />
                  ) : isMockMode ? (
                    // MODE DEMO: JANGAN GUNAKAN QR PALSU YANG SEOLAH-OLAH DAPAT DIBAYAR
                    <div className="w-56 h-56 rounded-xl bg-neutral-100 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                        <QrCode className="w-7 h-7" />
                      </div>
                      <span className="font-extrabold text-xs text-neutral-800 block">
                        KODE QR DEMO
                      </span>
                      <span className="text-[10px] text-amber-800 font-medium mt-1 leading-snug">
                        Simulasi pengujian antarmuka. Bukan rekening tujuan sungguhan.
                      </span>
                      <span className="mt-2 text-[9px] px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-bold">
                        JANGAN TRANSFER UANG
                      </span>
                    </div>
                  ) : (
                    <div className="w-56 h-56 flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                      <QrCode className="w-12 h-12 mb-2 stroke-[1.5]" />
                      <span className="text-xs">Memuat kode QRIS...</span>
                    </div>
                  )}
                </div>

                {/* Merchant Name */}
                <div className="mt-4 text-center">
                  <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wide block">
                    {STORE_CONFIG.name}
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {isMockMode ? 'Status: Mode Demo Pengujian' : 'QRIS Dinamis Otomatis'}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-neutral-500 text-center max-w-sm">
                {isMockMode
                  ? 'Dalam mode demo, gunakan tombol simulasi di bawah untuk menguji pop-up sukses dan tombol WhatsApp.'
                  : 'Scan kode QRIS di atas menggunakan aplikasi m-Banking atau e-Wallet favorit Anda.'}
              </p>
            </div>

            {/* PANEL PENGUJIAN KHUSUS MODE DEMO */}
            {isMockMode && paymentStatus === 'pending' && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Panel Pengujian Alur Transaksi (Mode Demo)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed mb-3">
                  Karena Server Key Midtrans belum aktif, Anda dapat menguji seluruh alur (pop-up pembayaran berhasil dan pesan otomatis WhatsApp) dengan tombol simulasi di bawah:
                </p>
                <button
                  onClick={() => checkStatus(true)}
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Uji Simulasi Pembayaran Berhasil (Mode Demo)</span>
                </button>
              </div>
            )}

            {/* Tombol Aksi Pemeriksaan Status (Mode Asli & Manual) */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => checkStatus(false)}
                disabled={isChecking || paymentStatus === 'settlement'}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>
                  {isChecking
                    ? 'Memeriksa ke Payment Gateway...'
                    : 'Periksa Status Pembayaran'}
                </span>
              </button>

              <a
                href={helpWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs sm:text-sm border border-neutral-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Hubungi WhatsApp Toko</span>
              </a>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
                {errorMessage}
              </div>
            )}

            {/* Panduan Cara Pembayaran QRIS */}
            <div className="mt-8 pt-6 border-t border-neutral-100">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                type="button"
                className="w-full flex items-center justify-between text-left text-sm font-bold text-neutral-800"
              >
                <span>Panduan Cara Pembayaran QRIS</span>
                {showInstructions ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {showInstructions && (
                <div className="mt-4 space-y-3 text-xs text-neutral-600 bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200/80">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      1
                    </span>
                    <p>
                      Buka aplikasi <strong>m-Banking</strong> (BCA, Mandiri, BRI, BNI, dll.) atau{' '}
                      <strong>e-Wallet</strong> (GoPay, OVO, ShopeePay, Dana, LinkAja).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      2
                    </span>
                    <p>
                      Pilih menu <strong>Bayar / QRIS / Scan</strong> pada aplikasi Anda dan arahkan kamera ke kode QR di layar.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      3
                    </span>
                    <p>
                      Pastikan nama merchant adalah <strong>{STORE_CONFIG.name}</strong> dan nominal pembayaran telah sesuai.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      4
                    </span>
                    <p>
                      Masukkan PIN transaksi Anda untuk mengonfirmasi pembayaran.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      5
                    </span>
                    <p>
                      Setelah pembayaran berhasil di HP Anda, halaman ini akan otomatis memperbarui status menjadi <strong>Lunas</strong> dan menampilkan pop-up konfirmasi WhatsApp.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Rincian Pesanan Pelanggan */}
            {order && (
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <span className="text-xs font-bold text-neutral-800 block mb-2">
                  Rincian Pesanan:
                </span>
                <div className="divide-y divide-neutral-100 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span className="text-neutral-700">
                        {it.name} <strong className="text-neutral-900">x{it.quantity}</strong>
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {formatRupiah(it.subtotal)}
                      </span>
                    </div>
                  ))}
                  <div className="py-2 flex justify-between text-neutral-600">
                    <span>Ongkos Kirim</span>
                    <span>
                      {order.shippingFee === 0 ? 'Gratis' : formatRupiah(order.shippingFee)}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between font-bold text-neutral-900">
                    <span>Total Tagihan</span>
                    <span className="text-emerald-800">{formatRupiah(order.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pop-up Pembayaran Berhasil Terverifikasi */}
      {order && (
        <PaymentModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          order={order}
          isMockMode={isMockMode}
        />
      )}
    </div>
  );
}
