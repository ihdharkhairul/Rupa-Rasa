import crypto from 'crypto';
import { OrderSummary } from '@/types';

const SECRET_KEY =
  process.env.ORDER_SESSION_SECRET ||
  process.env.MIDTRANS_SERVER_KEY ||
  'ruparasa-fallback-secret-key-32-chars-long!';

/**
 * Membuat token sesi pesanan yang ditandatangani dengan HMAC-SHA256
 * Memungkinkan penyimpanan detail checkout yang aman di sisi klien (sessionStorage)
 * tanpa membocorkan data pribadi kepada pihak ketiga yang hanya menebak Order ID.
 */
export function createOrderSessionToken(order: OrderSummary): string {
  const payloadString = JSON.stringify(order);
  const payloadBase64 = Buffer.from(payloadString, 'utf-8').toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Memverifikasi dan mendekode token sesi pesanan.
 * Mengembalikan null jika tanda tangan tidak valid atau token rusak.
 */
export function verifyOrderSessionToken(token: string): OrderSummary | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadBase64, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadBase64)
      .digest('base64url');

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const payloadString = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const orderData = JSON.parse(payloadString) as OrderSummary;
    return orderData;
  } catch {
    return null;
  }
}
