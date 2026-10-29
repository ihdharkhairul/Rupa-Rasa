import { PreOrderConfig } from '@/types';

/**
 * =====================================================================
 * KONFIGURASI TUNGGAL SISTEM PRE-ORDER RUPA-RASA (Single Source of Truth)
 * =====================================================================
 * Pemilik website dapat mengubah jadwal, periode, status buka/tutup,
 * dan opsi hari distribusi hanya melalui file ini tanpa perlu merombak komponen lain.
 */
export const PREORDER_CONFIG: PreOrderConfig = {
  // Ubah ke false jika Pre-Order sedang ditutup sementara
  isOpen: true,

  // Label status yang ditampilkan di antarmuka
  statusLabel: 'OPEN PRE-ORDER',

  // Nama batch pre-order saat ini
  batchName: 'Pre-Order Batch Mingguan Mie Jebew',

  // Periode pemesanan (WIB / Asia/Jakarta)
  orderPeriod: {
    start: 'Senin, 08.00 WIB',
    end: 'Selasa, 18.00 WIB',
    displayPeriod: 'Senin – Selasa',
    deadlineNote: 'Pemesanan ditutup setiap Selasa pukul 18.00 WIB',
  },

  // Ringkasan hari distribusi utama
  distributionDaysNote: 'Setiap hari Senin & Rabu',

  // Pengumuman singkat di banner Pre-Order
  announcement:
    'Pesan sekarang Paket Bundling Hemat Mie Jebew + Fresh Lemon Tea segar, serta menu favorit lainnya yang disiapkan fresh sesuai jadwal distribusi.',

  // Jadwal operasional pengambilan / pengiriman yang tersedia untuk dipilih pelanggan
  // Jadwal utama Rupa-Rasa: SENIN dan RABU
  schedules: [
    {
      id: 'jadwal-senin',
      day: 'Senin',
      label: 'Senin (Pengantaran & Pengambilan Siang)',
      timeSlot: '11.00 – 14.00 WIB',
      isAvailable: true,
    },
    {
      id: 'jadwal-rabu',
      day: 'Rabu',
      label: 'Rabu (Pengantaran & Pengambilan Siang)',
      timeSlot: '11.00 – 14.00 WIB',
      isAvailable: true,
    },
  ],

  // 4 Langkah mekanisme pemesanan Pre-Order
  steps: [
    {
      number: 1,
      title: 'Pilih Bundling / Menu',
      description: 'Pilih Paket Bundling Mie Jebew + Lemon Tea hemat atau menu satuan favorit Anda.',
    },
    {
      number: 2,
      title: 'Pilih Jadwal PO',
      description: 'Tentukan jadwal pengambilan atau pengiriman yang tersedia (Senin atau Rabu).',
    },
    {
      number: 3,
      title: 'Bayar via QRIS',
      description: 'Selesaikan transaksi mudah dan aman dengan scan QRIS instan otomatis.',
    },
    {
      number: 4,
      title: 'Konfirmasi WhatsApp',
      description: 'Konfirmasi pesanan langsung ke WhatsApp toko kami. Makanan siap diproses fresh!',
    },
  ],
};

/**
 * Memeriksa apakah sistem Pre-Order sedang dibuka
 */
export function isPreOrderOpen(): boolean {
  return PREORDER_CONFIG.isOpen;
}

/**
 * Mendapatkan daftar jadwal Pre-Order yang aktif & tersedia
 */
export function getAvailableSchedules() {
  return PREORDER_CONFIG.schedules.filter((s) => s.isAvailable);
}

/**
 * Mencari rincian jadwal berdasarkan ID
 */
export function getScheduleById(id: string) {
  return PREORDER_CONFIG.schedules.find((s) => s.id === id);
}
