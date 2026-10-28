/**
 * Konfigurasi Informasi Toko RupaRasa Kuliner
 * Nilai dapat disesuaikan melalui Environment Variables (misal di .env.local atau Vercel Dashboard)
 */
export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || 'RupaRasa Kuliner',
  tagline: 'Cita Rasa Otentik Makanan & Minuman Nusantara',
  description:
    'Menyajikan aneka hidangan makanan dan minuman khas pilihan dengan bahan berkualitas tinggi, diproses higienis, dan siap antar ke tempat Anda.',
  whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP || '62881080735942',
  instagram: process.env.NEXT_PUBLIC_STORE_INSTAGRAM || '',
  address:
    process.env.NEXT_PUBLIC_STORE_ADDRESS ||
    'Jl. Kuliner Nusantara No. 88, Kebayoran Baru, Jakarta Selatan 12180',
  operatingHours: 'Setiap Hari: 09.00 - 21.00 WIB',
  defaultShippingFee: 10000,
  freeShippingThreshold: 100000,
};

/**
 * Format angka ke Rupiah Indonesia (Rp xx.xxx)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Membersihkan nomor telepon WhatsApp untuk tautan wa.me
 * Menghilangkan spasi, tanda tambah (+), strip (-), dan mengubah awalan 08xx menjadi 628xx
 */
export function sanitizeWhatsappNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}
