import crypto from 'crypto';

export interface MidtransChargeParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerPhone: string;
  items: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}

export interface MidtransChargeResult {
  isMock: boolean;
  statusCode: string;
  transactionId: string;
  orderId: string;
  grossAmount: number;
  transactionStatus: string;
  qrImageUrl?: string;
  qrString?: string;
  expiryTime?: string;
  rawResponse?: Record<string, unknown>;
}

export interface MidtransStatusResult {
  isMock: boolean;
  orderId: string;
  transactionStatus: 'pending' | 'settlement' | 'capture' | 'deny' | 'expire' | 'cancel' | 'unknown';
  isPaid: boolean;
  grossAmount: number;
  paymentType: string;
  transactionTime?: string;
  rawResponse?: Record<string, unknown>;
}

interface MidtransAction {
  name: string;
  method: string;
  url: string;
}

const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = IS_PRODUCTION
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';

/**
 * Memeriksa apakah kredensial Midtrans telah dikonfigurasi dengan benar
 */
export function isMidtransConfigured(): boolean {
  return (
    Boolean(SERVER_KEY) &&
    SERVER_KEY.trim() !== '' &&
    !SERVER_KEY.includes('SB-Mid-server-xxxxxxxxxxxx') &&
    !SERVER_KEY.includes('your-server-key')
  );
}

/**
 * Mendapatkan header Authorization Basic Auth untuk Midtrans API
 */
function getAuthHeader(): string {
  const authString = Buffer.from(`${SERVER_KEY}:`).toString('base64');
  return `Basic ${authString}`;
}

/**
 * Mengirim permintaan Charge QRIS ke Midtrans Core API
 */
export async function chargeMidtransQRIS(
  params: MidtransChargeParams
): Promise<MidtransChargeResult> {
  // Jika Server Key belum diset, gunakan MODE DEMO (bukan QR acak atau QR statis palsu)
  if (!isMidtransConfigured()) {
    console.warn(
      '[Midtrans] MIDTRANS_SERVER_KEY belum dikonfigurasi. Mengaktifkan Mode Demo Pengujian Antarmuka.'
    );

    return {
      isMock: true,
      statusCode: '201',
      transactionId: `demo-txn-${Date.now()}`,
      orderId: params.orderId,
      grossAmount: params.grossAmount,
      transactionStatus: 'pending',
      // Dalam mode demo, jangan gunakan QR acak yang seolah-olah rekening aktif
      qrString: undefined,
      qrImageUrl: undefined,
      expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  const payload = {
    payment_type: 'qris',
    transaction_details: {
      order_id: params.orderId,
      gross_amount: Math.round(params.grossAmount),
    },
    item_details: params.items.map((item) => ({
      id: item.id.substring(0, 50),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    })),
    customer_details: {
      first_name: params.customerName.substring(0, 50),
      phone: params.customerPhone,
    },
    qris: {
      acquirer: 'gopay',
    },
  };

  const response = await fetch(`${BASE_URL}/v2/charge`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Midtrans Charge Error]', data);
    throw new Error(
      data.status_message ||
        `Gagal membuat transaksi Midtrans (Kode: ${data.status_code || response.status})`
    );
  }

  // Cari URL generate QR code pada array actions resmi
  let qrImageUrl: string | undefined;
  if (Array.isArray(data.actions)) {
    const qrAction = (data.actions as MidtransAction[]).find(
      (action) => action.name === 'generate-qr-code'
    );
    if (qrAction) {
      qrImageUrl = qrAction.url;
    }
  }

  return {
    isMock: false,
    statusCode: data.status_code,
    transactionId: data.transaction_id,
    orderId: data.order_id,
    grossAmount: Number(data.gross_amount),
    transactionStatus: data.transaction_status,
    qrImageUrl,
    qrString: data.qr_string,
    expiryTime: data.expiry_time,
    rawResponse: data,
  };
}

/**
 * Memeriksa status transaksi pembayaran ke Midtrans Server API
 */
export async function checkMidtransStatus(
  orderId: string
): Promise<MidtransStatusResult> {
  if (!isMidtransConfigured()) {
    // Mode demo / pengujian antarmuka
    return {
      isMock: true,
      orderId,
      transactionStatus: 'pending',
      isPaid: false,
      grossAmount: 0,
      paymentType: 'qris',
    };
  }

  const response = await fetch(`${BASE_URL}/v2/${encodeURIComponent(orderId)}/status`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: getAuthHeader(),
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      return {
        isMock: false,
        orderId,
        transactionStatus: 'unknown',
        isPaid: false,
        grossAmount: 0,
        paymentType: 'qris',
        rawResponse: data,
      };
    }
    throw new Error(data.status_message || 'Gagal mengecek status transaksi di Midtrans.');
  }

  const transactionStatus = data.transaction_status;
  const fraudStatus = data.fraud_status;

  // Sesuai aturan Midtrans: settlement atau capture dengan fraud_status accept adalah lunas
  const isPaid =
    transactionStatus === 'settlement' ||
    (transactionStatus === 'capture' && fraudStatus === 'accept');

  return {
    isMock: false,
    orderId: data.order_id,
    transactionStatus,
    isPaid,
    grossAmount: Number(data.gross_amount),
    paymentType: data.payment_type || 'qris',
    transactionTime: data.transaction_time,
    rawResponse: data,
  };
}

/**
 * Verifikasi signature webhook notifikasi dari Midtrans
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransNotificationSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  if (!SERVER_KEY) return false;

  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`)
    .digest('hex');

  return hash === signatureKey;
}
