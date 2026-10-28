import { OrderSummary } from '@/types';
import { STORE_CONFIG, formatRupiah, sanitizeWhatsappNumber } from '@/config/store';

/**
 * Membangun teks pesan konfirmasi pesanan ke WhatsApp toko
 * Sesuai dengan format spesifikasi:
 *
 * Halo, Kak! Saya ingin mengonfirmasi pesanan saya.
 *
 * *PEMBAYARAN BERHASIL*
 *
 * Nomor Pesanan: ORD-XXXXXXXX
 *
 * Nama: [nama]
 * Nomor WhatsApp: [nomor]
 * Alamat Pengiriman: [alamat]
 *
 * *Detail Pesanan:*
 * - [Nama Produk] x [Jumlah] — [Subtotal]
 *
 * Subtotal: [subtotal]
 * Ongkir: [ongkir]
 * Total Pembayaran: [total]
 * Metode Pembayaran: QRIS
 * Status Pembayaran: Berhasil
 *
 * Catatan: [catatan]
 *
 * Mohon informasi lebih lanjut mengenai pesanan saya. Terima kasih!
 */
export function buildWhatsappOrderMessage(order: OrderSummary): string {
  const itemsText = order.items
    .map((item) => `- ${item.name} x ${item.quantity} — ${formatRupiah(item.subtotal)}`)
    .join('\n');

  const notesText = order.customer.notes && order.customer.notes.trim() !== ''
    ? `\nCatatan: ${order.customer.notes.trim()}\n`
    : '';

  const shippingText =
    order.shippingFee === 0 ? 'Gratis (Promo)' : formatRupiah(order.shippingFee);

  const message = `Halo, Kak! Saya ingin mengonfirmasi pesanan saya.

*PEMBAYARAN BERHASIL*

Nomor Pesanan: ${order.orderId}

Nama: ${order.customer.name}
Nomor WhatsApp: ${order.customer.phone}
Alamat Pengiriman: ${order.customer.address}

*Detail Pesanan:*
${itemsText}

Subtotal: ${formatRupiah(order.subtotal)}
Ongkir: ${shippingText}
Total Pembayaran: ${formatRupiah(order.total)}
Metode Pembayaran: ${order.paymentMethod}
Status Pembayaran: Berhasil
${notesText}
Mohon informasi lebih lanjut mengenai pesanan saya. Terima kasih!`;

  return message;
}

/**
 * Menghasilkan tautan wa.me dengan pesan pesanan terisi lengkap
 */
export function generateWhatsappOrderUrl(order: OrderSummary): string {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const message = buildWhatsappOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${storePhone}?text=${encodedMessage}`;
}

/**
 * Menghasilkan tautan wa.me untuk bantuan pelanggan (troubleshooting / kendala)
 */
export function generateWhatsappHelpUrl(orderId?: string): string {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const helpText = orderId
    ? `Halo admin ${STORE_CONFIG.name}, saya butuh bantuan terkait pesanan saya dengan Nomor Pesanan: ${orderId}.`
    : `Halo admin ${STORE_CONFIG.name}, saya ingin bertanya mengenai menu dan pemesanan.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(helpText)}`;
}
