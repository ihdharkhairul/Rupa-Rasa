export type ProductCategory = 'Makanan' | 'Minuman';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  unit: string; // e.g. "Porsi", "Cup", "Botol"
  badge?: string; // e.g. "Terlaris", "Rekomendasi", "Segar"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderSummary {
  orderId: string;
  customer: CustomerInfo;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'QRIS';
  status: 'pending' | 'settlement' | 'expire' | 'cancel' | 'failure';
  createdAt: string;
  qrisData?: {
    qrString?: string;
    qrImageUrl?: string;
    expiryTime?: string;
  };
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
