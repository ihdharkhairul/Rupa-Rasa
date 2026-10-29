import { PreOrderConfig } from '@/types';

/**
 * =====================================================================
 * JADWAL BUKA / TUTUP PRE-ORDER OTOMATIS (zona waktu WIB / Asia/Jakarta)
 * =====================================================================
 * Website otomatis BUKA dan TUTUP mengikuti jadwal di bawah ini,
 * tanpa perlu diubah manual. Cukup edit angkanya bila jadwal berubah.
 *
 * Kode hari: 0 = Minggu, 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
 *
 * Contoh sekarang: BUKA Kamis 08.00 WIB  →  TUTUP Minggu 18.00 WIB.
 * Di luar rentang itu (Minggu 18.00 sampai Kamis 08.00) PO otomatis ditutup.
 *
 * PENTING: kalau jadwal di sini diubah, ubah juga teks "orderPeriod"
 * di PREORDER_CONFIG di bawah supaya tulisan di website ikut sama.
 */
const AUTO_SCHEDULE = {
  // true  = buka/tutup otomatis mengikuti jadwal di bawah
  // false = pakai saklar manual (MANUAL_IS_OPEN)
  enabled: true,
  openFrom: { day: 4, hour: 8, minute: 0 }, // Kamis 08.00 WIB
  closeAt: { day: 0, hour: 18, minute: 0 }, // Minggu 18.00 WIB
};

// Dipakai hanya jika AUTO_SCHEDULE.enabled = false (true = buka, false = tutup)
const MANUAL_IS_OPEN = true;

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

// Menit sejak Senin 00.00 (Senin = awal minggu, Minggu = akhir minggu)
function minuteOfWeek(day: number, hour: number, minute: number): number {
  return ((day + 6) % 7) * MINUTES_PER_DAY + hour * 60 + minute;
}

function computeIsOpen(): boolean {
  if (!AUTO_SCHEDULE.enabled) return MANUAL_IS_OPEN;

  // Hitung waktu WIB dari UTC (tidak bergantung zona waktu server / browser)
  const wib = new Date(Date.now() + WIB_OFFSET_MS);
  const now = minuteOfWeek(wib.getUTCDay(), wib.getUTCHours(), wib.getUTCMinutes());

  const { openFrom, closeAt } = AUTO_SCHEDULE;
  const start = minuteOfWeek(openFrom.day, openFrom.hour, openFrom.minute);
  const end = minuteOfWeek(closeAt.day, closeAt.hour, closeAt.minute);

  // Rentang normal (buka lebih awal dari tutup dalam satu minggu)
  if (start <= end) return now >= start && now < end;
  // Rentang yang melewati pergantian minggu
  return now >= start || now < end;
}

/**
 * =====================================================================
 * KONFIGURASI TUNGGAL SISTEM PRE-ORDER RUPA-RASA (Single Source of Truth)
 * =====================================================================
 * Pemilik website dapat mengubah jadwal, periode, status buka/tutup,
 * dan opsi hari distribusi hanya melalui file ini tanpa perlu merombak komponen lain.
 */
export const PREORDER_CONFIG: PreOrderConfig = {
  // Status buka/tutup dihitung otomatis dari AUTO_SCHEDULE di atas
  get isOpen(): boolean {
    return computeIsOpen();
  },

  // Label status yang ditampilkan di antarmuka
  statusLabel: 'OPEN PRE-ORDER',

  // Nama batch pre-order saat ini
  batchName: 'Pre-Order Batch Mingguan Mie Jebew',

  // Periode pemesanan (WIB / Asia/Jakarta) — hanya teks tampilan
  orderPeriod: {
    start: 'Kamis, 08.00 WIB',
    end: 'Minggu, 18.00 WIB',
    displayPeriod: 'Kamis – Minggu',
    deadlineNote: 'Pemesanan ditutup setiap Minggu pukul 18.00 WIB',
  },

  // Ringkasan hari distribusi utama
  distributionDaysNote: 'Setiap hari Senin & Rabu',

  // Pengumuman singkat di banner Pre-Order
  announcement:
    'Pesan sekarang Paket Bundling Hemat Mie Jebew + Fresh Lemon Tea segar yang disiapkan fresh sesuai jadwal distribusi.',

  // Jadwal operasional pengambilan / pengiriman yang tersedia untuk dipilih pelanggan
  // Jadwal utama Rupa-Rasa: SENIN dan RABU
  schedules: [
    {
      id: 'jadwal-senin',
      day: 'Senin',
      label: 'Senin (Pengantaran & Pengambilan Siang)',
      timeSlot: '11.00 – 18.00 WIB',
      isAvailable: true,
    },
    {
      id: 'jadwal-rabu',
      day: 'Rabu',
      label: 'Rabu (Pengantaran & Pengambilan Siang)',
      timeSlot: '11.00 – 18.00 WIB',
      isAvailable: true,
    },
  ],

  // 4 Langkah mekanisme pemesanan Pre-Order
  steps: [
    {
      number: 1,
      title: 'Pilih Paket Bundling',
      description: 'Pilih Paket Bundling Mie Jebew + Lemon Tea hemat dan tentukan jumlah paketnya.',
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