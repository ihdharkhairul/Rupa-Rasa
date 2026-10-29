export type ProductCategory = 'Makanan' | 'Minuman' | 'Paket Bundling';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number; // Harga sebelum diskon bundling (misal Rp 35.000 dicoret jadi Rp 30.000)
  description: string;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  unit: string; // e.g. "Porsi", "Cup", "Paket"
  badge?: string; // e.g. "Pre-Order", "Menu Utama PO", "Paket Hemat", "Favorit"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  deliverySchedule?: string; // Jadwal pengambilan atau pengiriman terpilih (e.g. "Rabu, 5 November 2026")
  deliveryType?: 'delivery' | 'pickup';
  notes?: string;
}

export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderWorkflowStatus =
  | 'pending' // Menunggu Pembayaran
  | 'settlement' // Pembayaran Berhasil / Terverifikasi
  | 'confirmed' // Menunggu Konfirmasi Dapur
  | 'processing' // Sedang Diproses (Dapur)
  | 'ready' // Siap Diambil / Dikirim
  | 'completed' // Selesai
  | 'expire' // Kedaluwarsa
  | 'cancel' // Dibatalkan
  | 'failure';

export interface OrderSummary {
  orderId: string;
  customer: CustomerInfo;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'QRIS';
  status: OrderWorkflowStatus;
  deliverySchedule?: string; // Jadwal distribusi PO
  deliveryType?: 'delivery' | 'pickup';
  createdAt: string;
  qrisData?: {
    qrString?: string;
    qrImageUrl?: string;
    expiryTime?: string;
  };
}

export interface PreOrderSchedule {
  id: string;
  day: 'Senin' | 'Rabu' | string;
  date?: string;
  label: string;
  timeSlot: string;
  isAvailable: boolean;
}

export interface PreOrderConfig {
  isOpen: boolean;
  statusLabel: string;
  batchName: string;
  orderPeriod: {
    start: string;
    end: string;
    displayPeriod: string;
    deadlineNote: string;
  };
  distributionDaysNote: string;
  announcement: string;
  schedules: PreOrderSchedule[];
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
}

export interface MidtransStatusResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: 'pending' | 'settlement' | 'capture' | 'deny' | 'expire' | 'cancel';
  fraud_status?: string;
  signature_key?: string;
}
