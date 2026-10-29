import { Product } from '@/types';
import { isPreOrderOpen } from '@/config/preorder';

/**
 * SUMBER DATA TUNGGAL PRODUK PRE-ORDER (Single Source of Truth)
 * Menu difokuskan pada hidangan Pre-Order utama: Mi Jebe Original
 * serta menu pelengkap yang dapat dipesan dalam periode Pre-Order aktif.
 */
export const PRODUCTS: Product[] = [
  // --- KATEGORI 1: MAKANAN (MENU UTAMA PRE-ORDER) ---
  {
    id: 'food-01',
    name: 'Mi Jebe Original',
    slug: 'mi-jebe-original',
    category: 'Makanan',
    price: 25000,
    unit: 'Porsi',
    badge: 'Menu Utama PO',
    isFeatured: true,
    isAvailable: true,
    description:
      'Mi kenyal khas dengan racikan bumbu Jebe pedas gurih nagih, suwiran daging ayam berbumbu rempah, taburan daun bawang segar, dan keripik pangsit renyah.',
    image:
      '/images/mie_jebew.jpg',
  },

  // --- KATEGORI 2: MINUMAN PELENGKAP ---
  {
    id: 'drink-01',
    name: 'Lemon Tea',
    slug: 'lemon tea',
    category: 'Minuman',
    price: 8000,
    unit: 'Cup 16oz',
    badge: 'Segar',
    isFeatured: false,
    isAvailable: true,
    description:
      'Seduhan teh melati wangi khas Nusantara dipadukan dengan gula tebu asli dan es batu segar, pereda pedas paling pas untuk Mi Jebe.',
    image:
      '/images/image.jpg',
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
  // Validasi status Pre-Order
  if (!isPreOrderOpen()) {
    throw new Error('Sistem Pre-Order saat ini sedang ditutup. Mohon nantikan periode batch berikutnya.');
  }

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
      throw new Error(`Produk "${product.name}" saat ini sedang habis / tidak tersedia.`);
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