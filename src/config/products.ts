import { Product } from '@/types';
import { isPreOrderOpen } from '@/config/preorder';
import { STORE_CONFIG } from '@/config/store';

/**
 * SUMBER DATA TUNGGAL PRODUK PRE-ORDER (Single Source of Truth)
 * Menu hanya satu: Paket Bundling Mie Jebew + Lemon Tea (khusus Market Day).
 */
export const PRODUCTS: Product[] = [
  // --- PAKET BUNDLING (SATU-SATUNYA MENU, KHUSUS MARKET DAY) ---
  {
    id: 'bundle-01',
    name: 'Paket Bundling Mie Jebew + Lemon Tea',
    slug: 'paket-bundling-mie-jebew-lemon-tea',
    category: 'Paket Bundling',
    price: 15000,
    originalPrice: 20000,
    unit: 'Paket',
    badge: 'Spesial Market Day',
    isFeatured: true,
    isAvailable: true,
    description:
      '1 porsi Mie Jebew pedas gurih nagih dengan bakso dan pangsit goreng renyah, PLUS 1 cup Lemon Tea segar pereda pedas. Hemat Rp 5.000!',
    image: '/images/paket-bundling.jpg',
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
  shippingFee: number = STORE_CONFIG.defaultShippingFee
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

  // Gratis ongkir jika subtotal mencapai batas di STORE_CONFIG.freeShippingThreshold (src/config/store.ts)
  const finalShippingFee = subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : shippingFee;
  const grandTotal = subtotal + finalShippingFee;

  return {
    verifiedItems,
    subtotal,
    shippingFee: finalShippingFee,
    grandTotal,
  };
}