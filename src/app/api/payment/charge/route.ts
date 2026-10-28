import { NextRequest, NextResponse } from 'next/server';
import { calculateTrustedOrder } from '@/config/products';
import { isPreOrderOpen } from '@/config/preorder';
import { chargeMidtransQRIS } from '@/lib/midtrans';
import { createOrderSessionToken } from '@/lib/token';
import { OrderSummary } from '@/types';
import { STORE_CONFIG } from '@/config/store';

export async function POST(request: NextRequest) {
  try {
    // 0. Validasi Status Pre-Order
    if (!isPreOrderOpen()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sistem Pre-Order saat ini sedang ditutup. Mohon nantikan jadwal batch berikutnya.',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { items, customer } = body;

    // 1. Validasi Data Pelanggan
    if (!customer || typeof customer !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Data pelanggan wajib diisi.' },
        { status: 400 }
      );
    }

    const { name, phone, address, deliverySchedule, deliveryType, notes } = customer;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Nama lengkap wajib diisi minimal 3 karakter.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nomor WhatsApp tidak valid. Masukkan minimal 9 hingga 15 digit angka.',
        },
        { status: 400 }
      );
    }

    const isPickup = deliveryType === 'pickup';

    if (!isPickup && (!address || typeof address !== 'string' || address.trim().length < 8)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alamat pengantaran wajib diisi dengan jelas (minimal 8 karakter).',
        },
        { status: 400 }
      );
    }

    // Validasi Jadwal Pre-Order
    if (!deliverySchedule || typeof deliverySchedule !== 'string' || deliverySchedule.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Jadwal pengambilan atau pengantaran Pre-Order wajib dipilih.',
        },
        { status: 400 }
      );
    }

    // 2. Validasi & Hitung Ulang Total dari Katalog Tepercaya
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keranjang belanja tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Backend menghitung ulang dan tidak mempercayai harga dari client!
    const effectiveShippingFee = isPickup ? 0 : STORE_CONFIG.defaultShippingFee;
    const { verifiedItems, subtotal, shippingFee, grandTotal } =
      calculateTrustedOrder(items, effectiveShippingFee);

    // 3. Buat ID Pesanan yang Unik
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `ORD-PO-${timestamp}-${randomSuffix}`;

    // 4. Buat Permintaan Charge QRIS ke Midtrans
    const midtransResult = await chargeMidtransQRIS({
      orderId,
      grossAmount: grandTotal,
      customerName: name.trim(),
      customerPhone: cleanedPhone,
      items: [
        ...verifiedItems.map((item) => ({
          id: item.productId,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
        ...(shippingFee > 0
          ? [
              {
                id: 'SHIPPING',
                price: shippingFee,
                quantity: 1,
                name: 'Biaya Pengiriman',
              },
            ]
          : []),
      ],
    });

    // 5. Susun Ringkasan Pesanan Pre-Order Lengkap
    const orderSummary: OrderSummary = {
      orderId,
      customer: {
        name: name.trim(),
        phone: cleanedPhone,
        address: isPickup ? 'Ambil Sendiri di Dapur Rupa-Rasa' : address.trim(),
        deliverySchedule: deliverySchedule.trim(),
        deliveryType: isPickup ? 'pickup' : 'delivery',
        notes: notes ? String(notes).trim() : undefined,
      },
      items: verifiedItems,
      subtotal,
      shippingFee,
      total: grandTotal,
      paymentMethod: 'QRIS',
      status: 'pending',
      deliverySchedule: deliverySchedule.trim(),
      deliveryType: isPickup ? 'pickup' : 'delivery',
      createdAt: new Date().toISOString(),
      qrisData: {
        qrString: midtransResult.qrString,
        qrImageUrl: midtransResult.qrImageUrl,
        expiryTime: midtransResult.expiryTime,
      },
    };

    // 6. Buat Signed Session Token untuk keamanan data pelanggan tanpa database
    const orderToken = createOrderSessionToken(orderSummary);

    return NextResponse.json({
      success: true,
      orderId,
      orderSummary,
      orderToken,
      isMock: midtransResult.isMock,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API /payment/charge Error]', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Terjadi kesalahan sistem saat memproses transaksi Pre-Order.',
      },
      { status: 500 }
    );
  }
}
