import { Product } from '@/types';

/**
 * SUMBER DATA TUNGGAL PRODUK (Single Source of Truth)
 * Pemilik toko dapat mengubah nama, gambar, harga, deskripsi, dan ketersediaan stok
 * langsung melalui file ini tanpa mengubah kode di file lain.
 */
export const PRODUCTS: Product[] = [
  // --- KATEGORI: MAKANAN ---
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
  {
    id: 'food-02',
    name: 'Ayam Bakar Madu Pedas Manis',
    slug: 'ayam-bakar-madu-pedas-manis',
    category: 'Makanan',
    price: 38000,
    unit: 'Porsi',
    badge: 'Rekomendasi',
    isFeatured: true,
    isAvailable: true,
    description:
      'Potongan ayam pejantan empuk yang dimarinasi bumbu ketumbar dan madu hutan alami, dibakar harum dengan olesan karamelisasi saus pedas manis serta lalapan segar.',
    image:
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'food-03',
    name: 'Mie Aceh Kuah Daging Sapi',
    slug: 'mie-aceh-kuah-daging-sapi',
    category: 'Makanan',
    price: 40000,
    unit: 'Porsi',
    badge: 'Favorit',
    isFeatured: false,
    isAvailable: true,
    description:
      'Mie kuning tebal dengan kuah kari kental khas Serambi Mekkah, bertabur irisan daging sapi empuk, tauge segar, emping melinjo, dan perasan jeruk nipis.',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'food-04',
    name: 'Dimsum Mentai Panggang (4 pcs)',
    slug: 'dimsum-mentai-panggang',
    category: 'Makanan',
    price: 28000,
    unit: 'Porsi (4 pcs)',
    badge: 'Cemilan Populer',
    isFeatured: false,
    isAvailable: true,
    description:
      'Siomay ayam udang lembut berkualitas tinggi berpadu dengan saus mentai gurih-creamy khas Jepang yang ditorch hingga mengeluarkan aroma panggangan harum.',
    image:
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
  },

  // --- KATEGORI: MINUMAN ---
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
  {
    id: 'drink-02',
    name: 'Matcha Oatmilk Latte',
    slug: 'matcha-oatmilk-latte',
    category: 'Minuman',
    price: 27000,
    unit: 'Cup 16oz',
    badge: 'Artisanal',
    isFeatured: true,
    isAvailable: true,
    description:
      'Bubuk matcha premium ceremonial grade dipadukan dengan susu oat bebas laktosa yang lembut dan sedikit sentuhan sirup vanila alami. Segar dan menenangkan.',
    image:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'drink-03',
    name: 'Es Jeruk Nipis Madu Selasih',
    slug: 'es-jeruk-nipis-madu-selasih',
    category: 'Minuman',
    price: 18000,
    unit: 'Cup 16oz',
    badge: 'Segar Alami',
    isFeatured: false,
    isAvailable: true,
    description:
      'Perasan air jeruk nipis murni kaya vitamin C disempurnakan madu randu alami dan taburan biji selasih bertekstur. Teman paling pas setelah menyantap makanan gurih.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'drink-04',
    name: 'Teh Tarik Rempah Dingin',
    slug: 'teh-tarik-rempah-dingin',
    category: 'Minuman',
    price: 18000,
    unit: 'Cup 16oz',
    badge: 'Aroma Khas',
    isFeatured: false,
    isAvailable: true,
    description:
      'Seduhan daun teh hitam pekat berkualitas yang ditarik berulang kali bersama susu kental manis dan aksen kapulaga serta cengkeh wangi.',
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
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
