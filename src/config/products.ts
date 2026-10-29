import { Product } from '@/types';
import { isPreOrderOpen } from '@/config/preorder';

/**
 * SUMBER DATA TUNGGAL PRODUK PRE-ORDER (Single Source of Truth)
 * Katalog website Rupa-Rasa HANYA memiliki tepat 3 produk:
 * 1. Mi Jebe (Makanan satuan)
 * 2. Lemon Tea (Minuman satuan)
 * 3. Paket Bundling Mi Jebe + Lemon Tea (1 porsi Mi Jebe + 1 cup Lemon Tea)
 */
export const PRODUCTS: Product[] = [
  // 1. MAKANAN SATUAN
  {
    id: 'food-01',
    name: 'Mi Jebe',
    slug: 'mi-jebe',
    category: 'Makanan',
    price: 25000,
    unit: 'Porsi',
    badge: 'Makanan Satuan',
    isFeatured: true,
    isAvailable: true,
    description:
      '1 porsi Mi Jebe dengan mie kenyal khas berbalut bumbu Jebe pedas gurih nagih, suwiran daging ayam rempah, dan taburan keripik pangsit renyah.',
    image:
      'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
  },

  // 2. MINUMAN SATUAN
  {
    id: 'drink-01',
    name: 'Lemon Tea',
    slug: 'lemon-tea',
    category: 'Minuman',
    price: 10000,
    unit: 'Cup 16oz',
    badge: 'Minuman Satuan',
    isFeatured: true,
    isAvailable: true,
    description:
      '1 cup seduhan teh segar dipadukan dengan perasan jeruk lemon asli dan es batu dingin, sensasi asam manis menyegarkan pereda pedas.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },

  // 3. PAKET BUNDLING (1 PORSI MI JEBE + 1 CUP LEMON TEA)
  {
    id: 'bundle-01',
    name: 'Paket Bundling Mi Jebe + Lemon Tea',
    slug: 'paket-bundling-mi-jebe-lemon-tea',
    category: 'Paket Bundling',
    price: 30000,
    originalPrice: 35000,
    unit: 'Paket',
    badge: 'Paket Hemat',
    isFeatured: true,
    isAvailable: true,
    description:
      'Paket hemat lengkap berisi 1 porsi Mi Jebe pedas gurih dan 1 cup Lemon Tea dingin segar pereda pedas (kombinasi 1 makanan + 1 minuman).',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
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
