import { NextRequest, NextResponse } from 'next/server';
import { checkMidtransStatus, isMidtransConfigured } from '@/lib/midtrans';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const simulateSuccess = searchParams.get('simulateSuccess') === 'true';

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Parameter orderId wajib disertakan.' },
        { status: 400 }
      );
    }

    // Dukungan mode simulasi dev/testing jika Midtrans API key belum diisi
    if (!isMidtransConfigured() && simulateSuccess) {
      return NextResponse.json({
        success: true,
        orderId,
        isMock: true,
        isPaid: true,
        transactionStatus: 'settlement',
        grossAmount: 0,
        paymentType: 'qris',
        message: 'Status disimulasikan sebagai lunas (Mode Sandbox Dev).',
      });
    }

    const result = await checkMidtransStatus(orderId);

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      isMock: result.isMock,
      isPaid: result.isPaid,
      transactionStatus: result.transactionStatus,
      grossAmount: result.grossAmount,
      paymentType: result.paymentType,
      transactionTime: result.transactionTime,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API /payment/status Error]', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Gagal memeriksa status pembayaran di server.',
      },
      { status: 500 }
    );
  }
}
