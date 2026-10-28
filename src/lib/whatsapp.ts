import { OrderSummary } from '@/types';
import { STORE_CONFIG, formatRupiah, sanitizeWhatsappNumber } from '@/config/store';

/**
 * Membangun teks pesan konfirmasi Pre-Order ke WhatsApp toko Rupa-Rasa
 * Sesuai spesifikasi Pre-Order:
 *
 * Halo Rupa-Rasa, saya ingin melakukan Pre-Order Mi Jebe.
 *
 * Detail pesanan:
 * - Nama: [Nama Pelanggan]
 * - Nomor Pesanan: [Order ID]
 * - Menu: [Nama Menu]
 * - Jumlah: [Jumlah]
 * - Total pembayaran: [Total]
 * - Jadwal pengambilan/pengiriman: [Tanggal dan Hari]
 * - Metode pembayaran: QRIS
 *
 * Saya ingin melanjutkan proses pembayaran pesanan ini.
 *
 * Terima kasih.
 */
export function buildWhatsappOrderMessage(order: OrderSummary): string {
  const menuList = order.items.map((item) => `${item.name} (${item.quantity}x)`).join(', ');
  const totalQuantity = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
  const scheduleText = order.customer.deliverySchedule || order.deliverySchedule || 'Sesuai jadwal PO aktif (Senin/Rabu)';

  const itemsDetailList = order.items
    .map((item) => `  * ${item.name} x ${item.quantity} = ${formatRupiah(item.subtotal)}`)
    .join('\n');

  const notesText =
    order.customer.notes && order.customer.notes.trim() !== ''
      ? `\n- Catatan: ${order.customer.notes.trim()}`
      : '';

  const addressText =
    order.customer.address && order.customer.address.trim() !== ''
      ? `\n- Alamat: ${order.customer.address.trim()}`
      : '';

  const statusText =
    order.status === 'settlement'
      ? '\n- Status Pembayaran: Terverifikasi Lunas (QRIS)'
      : '\n- Status Pembayaran: Menunggu Verifikasi';

  const message = `Halo Rupa-Rasa, saya ingin melakukan Pre-Order Mi Jebe.

Detail pesanan:
- Nomor Pesanan: ${order.orderId}
- Nama: ${order.customer.name}
- Nomor WhatsApp: ${order.customer.phone}
- Menu: ${menuList}
- Jumlah Total: ${totalQuantity} porsi/item
- Total pembayaran: ${formatRupiah(order.total)}
- Jadwal pengambilan/pengiriman: ${scheduleText}
- Metode pembayaran: QRIS${statusText}${addressText}${notesText}

Rincian Pesanan:
${itemsDetailList}

Saya ingin melanjutkan proses pembayaran pesanan ini.

Terima kasih.`;

  return message;
}

/**
 * Menghasilkan tautan wa.me dengan pesan pesanan terisi lengkap secara dinamis
 */
export function generateWhatsappOrderUrl(order: OrderSummary): string {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const message = buildWhatsappOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${storePhone}?text=${encodedMessage}`;
}

/**
 * Menghasilkan tautan wa.me untuk bantuan pelanggan (troubleshooting / kendala / tanya jadwal PO)
 */
export function generateWhatsappHelpUrl(orderId?: string): string {
  const storePhone = sanitizeWhatsappNumber(STORE_CONFIG.whatsapp);
  const helpText = orderId
    ? `Halo admin ${STORE_CONFIG.name}, saya butuh informasi terkait Pre-Order saya dengan Nomor Pesanan: ${orderId}.`
    : `Halo admin ${STORE_CONFIG.name}, saya ingin bertanya mengenai jadwal Pre-Order dan menu Mi Jebe.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(helpText)}`;
}
