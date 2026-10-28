import { Product } from '@/types';

/**
 * SUMBER DATA TUNGGAL PRODUK (Single Source of Truth)
 * Website hanya memiliki dua kategori: Makanan dan Minuman.
 * Untuk versi awal ini, menampilkan tepat 2 produk contoh (1 Makanan dan 1 Minuman).
 * Pemilik toko dapat mengubah nama, gambar, harga, deskripsi, dan ketersediaan stok
 * langsung melalui file ini tanpa mengubah kode di file lain.
 */
export const PRODUCTS: Product[] = [
  // --- KATEGORI 1: MAKANAN ---
  {
    id: 'food-01',
    name: 'Nasi Goreng Spesial RupaRasa',
    slug: 'nasi-goreng-spesial-ruparasa',
    category: 'Makanan',
    price: 35000,
    unit: 'Porsi',
    badge: 'Terlaris',
    isFeatured: true,
    isAvailable: true,
    description:
      'Nasi goreng beraroma rempah pilihan disajikan dengan suwiran ayam gurih, telur mata sapi, sate ayam bumbu kacang, emping renyah, dan acar segar.',
    image:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
  },

  // --- KATEGORI 2: MINUMAN ---
  {
    id: 'drink-01',
    name: 'Es Kopi Susu Aren Klasik',
    slug: 'es-kopi-susu-aren-klasik',
    category: 'Minuman',
    price: 22000,
    unit: 'Cup 16oz',
    badge: 'Best Seller',
    isFeatured: true,
    isAvailable: true,
    description:
      'Kombinasi espresso blend robusta & arabika lokal pilihan, susu segar creamy, dan gula aren murni organik tanpa pemanis buatan. Keseimbangan rasa pas di lidah.',
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * Mendapatkan produk berdasarkan ID
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Memvalidasi dan menghitung ulang total belanja secara aman di sisi server.
 * Backend TIDAK PERNAH mempercayai harga atau total yang dikirim oleh browser klien.
 */
export function calculateTrustedOrder(
  cartItems: { productId: string; quantity: number }[],
  shippingFee: number = 10000
) {
  const verifiedItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[] = [];

  let subtotal = 0;

  for (const item of cartItems) {
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error(`Kuantitas untuk produk ${item.productId} tidak valid.`);
    }

    const product = getProductById(item.productId);
    if (!product) {
      throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan di katalog.`);
    }

    if (!product.isAvailable) {
      throw new Error(`Produk "${product.name}" saat ini sedang habis.`);
    }

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  if (verifiedItems.length === 0) {
    throw new Error('Keranjang belanja kosong.');
  }

  // Gratis ongkir untuk pesanan di atas Rp 100.000
  const finalShippingFee = subtotal >= 100000 ? 0 : shippingFee;
  const grandTotal = subtotal + finalShippingFee;

  return {
    verifiedItems,
    subtotal,
    shippingFee: finalShippingFee,
    grandTotal,
  };
}
