# RupaRasa — E-Commerce Makanan & Minuman (QRIS Dinamis & WhatsApp)

Website e-commerce kuliner modern, responsif, dan siap produksi yang berfokus khusus pada dua kategori produk: **Makanan** dan **Minuman**. Dibangun menggunakan **Next.js App Router**, **TypeScript**, dan **Tailwind CSS** dengan integrasi pembayaran **QRIS Dinamis Midtrans** serta konfirmasi pesanan otomatis ke **WhatsApp**.

---

## 🌟 Fitur Utama

1. **Katalog Dua Kategori (Makanan & Minuman)**
   - Filter cepat kategori *Semua*, *Makanan*, dan *Minuman*.
   - Fitur pencarian instan berdasarkan nama dan deskripsi menu.
   - Badge produk menarik (*Terlaris*, *Rekomendasi*, *Best Seller*).
   - Seluruh data produk tersentralisasi di satu file konfigurasi (`src/config/products.ts`).

2. **Keranjang Belanja Interaktif (Client Storage)**
   - Tambah menu, sesuaikan jumlah (+ / -), dan hapus item.
   - Perhitungan otomatis subtotal dan ongkos kirim.
   - Promo otomatis: **Gratis Ongkos Kirim** untuk pesanan minimum Rp 100.000.
   - Penyimpanan persisten di browser (`localStorage`) sehingga keranjang tidak hilang saat halaman di-refresh.

3. **Formulir Checkout & Validasi Server**
   - Validasi nama lengkap, alamat detail, dan format nomor WhatsApp pelanggan.
   - **Keamanan Total:** Backend tidak mempercayai harga atau total yang dikirim oleh browser. Server menghitung ulang seluruh harga dari katalog resmi sebelum menerbitkan tagihan.
   - Proteksi klik ganda (*anti-duplicate submit*) saat proses pemesanan.

4. **Pembayaran QRIS Dinamis (Midtrans Core API)**
   - Menggunakan endpoint server-side Route Handler aman (Server Key tidak pernah bocor ke browser).
   - Menampilkan kode QR resmi yang didapat dari payment gateway.
   - Kode Order ID unik untuk setiap transaksi.
   - Status pembayaran real-time: *Menunggu Pembayaran*, *Pembayaran Berhasil*, atau *Kedaluwarsa*.
   - Polling status otomatis setiap 5-6 detik serta tombol manual *Periksa Status Pembayaran*.

5. **Pop-up Pembayaran Berhasil & Efek Konfeti**
   - **HANYA muncul setelah server memverifikasi status transaksi lunas (`settlement`)**.
   - Dilengkapi animasi checkmark dan efek konfeti selebrasi.
   - Menampilkan ringkasan pesanan dan Order ID.

6. **Integrasi WhatsApp Otomatis (`wa.me`)**
   - Tombol utama **"Lanjut ke WhatsApp Toko"** membuka obrolan ke nomor WhatsApp toko.
   - Pesan dibuat secara dinamis dari formulir checkout pelanggan dengan format terstruktur rapi.
   - URL-encoded aman dan format nomor internasional (`62xxx`).

7. **Arsitektur Stateless Aman (Tanpa Database)**
   - Menggunakan signed order token (HMAC-SHA256) untuk menjaga privasi data pelanggan di sesi browser tanpa menyimpan PII publik pada URL.
   - Siap dideploy ke Vercel tanpa perlu setup database server terlebih dahulu.

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Prasyarat
- Node.js versi 18 atau lebih baru.
- npm / yarn / pnpm.

### 2. Salin Repositori & Instal Dependensi
```bash
# Masuk ke direktori proyek
cd c:\RupaRasa

# Instal paket dependensi
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel lingkungan pada `.env.local`:
```env
# Nama Toko
NEXT_PUBLIC_STORE_NAME="RupaRasa Kuliner"

# Nomor WhatsApp Toko (Format internasional tanpa '+', contoh: 6281234567890)
NEXT_PUBLIC_STORE_WHATSAPP="6281234567890"

# Alamat Toko
NEXT_PUBLIC_STORE_ADDRESS="Jl. Kuliner Nusantara No. 88, Kebayoran Baru, Jakarta Selatan 12180"

# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"

# Secret Key untuk Token Sesi Pesanan (Stateless HMAC-SHA256)
ORDER_SESSION_SECRET="kunci-rahasia-acak-untuk-keamanan-pesanan"
```

> **Catatan Mode Pengujian (Out-of-the-box):**  
> Jika Anda belum memiliki Server Key Midtrans, aplikasi secara otomatis mengaktifkan **Mode Simulasi Sandbox Dev**. Anda dapat membuat pesanan, melihat kode QRIS, dan menekan tombol *"Simulasikan Pembayaran Berhasil"* untuk menguji pop-up dan tombol WhatsApp tanpa kartu/bank sungguhan!

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 💳 Panduan Konfigurasi Midtrans QRIS

### Langkah 1: Mendaftar Akun Midtrans
1. Kunjungi [dashboard.midtrans.com](https://dashboard.midtrans.com) dan daftar akun merchant (bisa mulai dari Sandbox).
2. Masuk ke **Settings > Access Keys**.
3. Salin **Server Key** dan **Client Key**.
4. Tempelkan ke `.env.local` atau Vercel Environment Variables.

### Langkah 2: Mengaktifkan Metode QRIS
1. Pada menu dashboard Midtrans, pastikan kanal pembayaran **QRIS** (Gopay/ShopeePay) aktif.
2. Di mode Sandbox, Midtrans menyediakan simulator QRIS di [simulator.sandbox.midtrans.com/qris/index](https://simulator.sandbox.midtrans.com/qris/index).

### Langkah 3: Konfigurasi Webhook Notifikasi
1. Masuk ke menu **Settings > Configuration** di Dashboard Midtrans.
2. Masukkan **Payment Notification URL**:
   ```
   https://domain-anda.vercel.app/api/payment/notification
   ```
3. Webhook endpoint RupaRasa secara otomatis memvalidasi `signature_key` berbasis algoritma SHA-512 resmi Midtrans:
   $$\text{SHA512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$

### Langkah 4: Beralih ke Mode Production
Setelah akun diverifikasi oleh Midtrans:
1. Ganti `MIDTRANS_IS_PRODUCTION="true"`.
2. Ganti `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` dengan kunci produksi (awalan `Mid-server-...` tanpa `SB-`).

---

## 💬 Format Pesan WhatsApp Dinamis

Ketika pelanggan menekan tombol **"Lanjut ke WhatsApp Toko"** pada pop-up sukses atau halaman detail pesanan, aplikasi membuka `https://wa.me/<STORE_PHONE>?text=...` dengan format terstruktur:

```text
Halo, Kak! Saya ingin mengonfirmasi pesanan saya.

*PEMBAYARAN BERHASIL*

Nomor Pesanan: ORD-XXXXXX-XXXX

Nama: Budi Santoso
Nomor WhatsApp: 081234567890
Alamat Pengiriman: Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan

*Detail Pesanan:*
- Nasi Goreng Spesial RupaRasa x 2 — Rp 70.000
- Es Kopi Susu Aren Klasik x 2 — Rp 44.000

Subtotal: Rp 114.000
Ongkir: Gratis (Promo)
Total Pembayaran: Rp 114.000
Metode Pembayaran: QRIS
Status Pembayaran: Berhasil

Catatan: Tolong sambalnya dipisah ya kak

Mohon informasi lebih lanjut mengenai pesanan saya. Terima kasih!
```

> **Pemberitahuan Penting:** Tautan `wa.me` hanya membuka aplikasi WhatsApp pelanggan dengan teks yang telah terisi otomatis secara aman. Pelanggan tetap menekan tombol **Kirim** di WhatsApp mereka. Aplikasi tidak mengklaim pesan telah terkirim sebelum pelanggan mengirimkannya.

---

## 🍱 Mengubah & Menambah Menu (Single Source of Truth)

Seluruh katalog makanan dan minuman dapat dikelola pada satu file:
👉 [`src/config/products.ts`](file:///c:/RupaRasa/src/config/products.ts)

Contoh struktur produk:
```typescript
{
  id: 'food-05',
  name: 'Sate Ayam Madura Istimewa',
  slug: 'sate-ayam-madura-istimewa',
  category: 'Makanan', // 'Makanan' | 'Minuman'
  price: 32000,
  unit: 'Porsi (10 tusuk)',
  badge: 'Menu Baru',
  isFeatured: true,
  isAvailable: true,
  description: 'Daging ayam pilihan dibakar dengan bumbu kacang lembut gurih...',
  image: 'https://images.unsplash.com/...',
}
```

---

## 🔒 Catatan Keamanan & Arsitektur Tanpa Database (Stateless)

Versi 1.0 ini dirancang khusus **tanpa mewajibkan database server eksternal**:
1. **Stateless Backend:** Memori serverless (seperti Vercel Functions) bersifat efemeral. Oleh karena itu, server tidak mengandalkan variabel global in-memory untuk menyimpan pesanan.
2. **Katalog Tepercaya:** Harga dihitung ulang dari file konfigurasi server saat checkout (`POST /api/payment/charge`). Manipulasi harga di sisi browser klien akan diabaikan.
3. **Session Token HMAC-SHA256:** Detail formulir checkout pelanggan ditandatangani dengan kunci rahasia server dan disimpan di `sessionStorage` browser pemesan. Pengguna lain yang hanya menebak `orderId` di URL tidak dapat membaca nama, nomor HP, atau alamat pelanggan.
4. **Keterbatasan & Roadmap v2:**
   - *Penyimpanan Jangka Panjang:* Jika pembeli menghapus cache browser atau membuka link dari perangkat berbeda beberapa hari kemudian, detail teks formulir lokal tidak terbaca (namun status transaksi di payment gateway tetap terverifikasi lunas).
   - *Deduplikasi Webhook Multi-Instance:* Untuk pencatatan transaksi multi-tahun, webhook retry deduplication yang ketat, serta dashboard admin inventaris real-time, kami menyarankan menambahkan database relasional seperti PostgreSQL (Supabase / Neon) atau Redis pada versi berikutnya.

---

## 🌐 Panduan Deployment ke Vercel

1. **Push ke Git (GitHub / GitLab / Bitbucket)**
   ```bash
   git add .
   git commit -m "feat: complete food and beverage ecommerce with QRIS and WhatsApp"
   git remote add origin https://github.com/username/ruparasa.git
   git push -u origin main
   ```

2. **Import ke Vercel**
   - Buka [vercel.com/new](https://vercel.com/new).
   - Pilih repositori Git proyek Anda.
   - Framework preset otomatis terdeteksi sebagai **Next.js**.

3. **Atur Environment Variables di Vercel Dashboard**
   Tambahkan variabel berikut di menu *Settings > Environment Variables*:
   - `NEXT_PUBLIC_STORE_NAME`
   - `NEXT_PUBLIC_STORE_WHATSAPP`
   - `NEXT_PUBLIC_STORE_ADDRESS`
   - `MIDTRANS_SERVER_KEY`
   - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
   - `MIDTRANS_IS_PRODUCTION`
   - `ORDER_SESSION_SECRET`

4. **Klik Deploy**
   Vercel akan menjalankan build otomatis dan memberikan domain publik HTTPS (`https://ruparasa.vercel.app`).
   Masukkan URL webhook tersebut ke dashboard Midtrans.

---

## 📋 Status Kesiapan Fitur

| Fitur | Status | Keterangan |
| :--- | :---: | :--- |
| Katalog Makanan & Minuman | ✅ Berfungsi | Responsive, pencarian, dan filter kategori |
| Keranjang Belanja | ✅ Berfungsi | LocalStorage persistent, increment/decrement |
| Formulir Checkout | ✅ Berfungsi | Validasi data, anti-double click |
| Backend Price Recalculation | ✅ Berfungsi | Server Route Handler aman |
| Integrasi QRIS Midtrans | ✅ Berfungsi | Core API `/v2/charge`, render QR code |
| Polling Status Pembayaran | ✅ Berfungsi | Endpoint `/api/payment/status` |
| Webhook Notifikasi Midtrans | ✅ Berfungsi | Signature SHA-512 verification |
| Pop-up Sukses Terverifikasi | ✅ Berfungsi | Muncul hanya saat status `settlement` |
| Integrasi WhatsApp Dinamis | ✅ Berfungsi | Tautan `wa.me` dengan teks pesanan checkout |
| Mode Simulasi Sandbox Dev | ✅ Berfungsi | Pengujian lokal langsung tanpa kunci Midtrans |

---

&copy; 2026 **RupaRasa Kuliner**. Dibuat untuk menghadirkan pengalaman belanja kuliner online yang praktis, aman, dan memuaskan.
#   R u p a - R a s a  
 