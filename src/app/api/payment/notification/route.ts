import { NextRequest, NextResponse } from 'next/server';
import {
  verifyMidtransNotificationSignature,
  isMidtransConfigured,
} from '@/lib/midtrans';

/**
 * Webhook handler untuk notifikasi pembayaran Midtrans (Server-to-Server)
 * Midtrans mengirimkan HTTP POST ketika status transaksi berubah (misal QRIS di-scan dan dibayar).
 */
export async function POST(request: NextRequest) {
  try {
    const notification = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = notification;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { success: false, error: 'Payload notifikasi tidak lengkap.' },
        { status: 400 }
      );
    }

    // 1. Verifikasi Signature resmi Midtrans jika Server Key aktif
    if (isMidtransConfigured()) {
      const isValid = verifyMidtransNotificationSignature(
        order_id,
        status_code,
        gross_amount,
        signature_key
      );

      if (!isValid) {
        console.warn(`[Midtrans Webhook] Signature TIDAK VALID untuk order ${order_id}`);
        return NextResponse.json(
          { success: false, error: 'Signature key tidak valid.' },
          { status: 401 }
        );
      }
    }

    // 2. Evaluasi status transaksi pembayaran
    let isSettled = false;
    if (transaction_status === 'settlement') {
      isSettled = true;
    } else if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        isSettled = true;
      }
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      console.log(`[Midtrans Webhook] Transaksi ${order_id} berstatus: ${transaction_status}`);
    }

    console.log(
      `[Midtrans Webhook] Diterima untuk Order: ${order_id} | Status: ${transaction_status} | Lunas: ${isSettled} | Tipe: ${payment_type}`
    );

    return NextResponse.json({
      success: true,
      message: 'Notifikasi berhasil diverifikasi dan diproses.',
      orderId: order_id,
      transactionStatus: transaction_status,
      isSettled,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Midtrans Webhook Error]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
