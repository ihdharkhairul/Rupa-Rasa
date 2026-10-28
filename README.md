# Panduan Lengkap Website RupaRasa Kuliner
### E-Commerce Makanan & Minuman dengan Pembayaran QRIS Dinamis dan Konfirmasi WhatsApp Otomatis

Selamat datang di repositori **RupaRasa Kuliner**. Dokumen panduan ini disusun langkah demi langkah dengan bahasa yang mudah dipahami bagi pemula maupun pengembang profesional.

---

## Daftar Isi
1. [Persyaratan Software & Menjalankan Project Secara Lokal](#1-persyaratan-software--menjalankan-project-secara-lokal)
2. [Instalasi Dependency & Menjalankan Development Server](#2-instalasi-dependency--menjalankan-development-server)
3. [Cara Mengganti Nama Toko, Logo, Gambar, Menu Produk, Kategori, & Harga](#3-cara-mengganti-nama-toko-logo-gambar-menu-produk-kategori--harga)
4. [Cara Mengatur Nomor WhatsApp Toko & Username Instagram](#4-cara-mengatur-nomor-whatsapp-toko--username-instagram)
5. [Cara Mengatur Environment Variables (.env.local)](#5-cara-mengatur-environment-variables-envlocal)
6. [Cara Mendapatkan & Memasang Kredensial Midtrans Sandbox](#6-cara-mendapatkan--memasang-kredensial-midtrans-sandbox)
7. [Cara Menguji Alur Demo vs Pembayaran Sungguhan](#7-cara-menguji-alur-demo-vs-pembayaran-sungguhan)
8. [Cara Mengonfigurasi Webhook & Menguji Pembayaran Sandbox](#8-cara-mengonfigurasi-webhook--menguji-pembayaran-sandbox)
9. [Cara Deploy ke Vercel & Memasukkan Environment Variables](#9-cara-deploy-ke-vercel--memasukkan-environment-variables)
10. [Checklist Pengujian Sebelum Website Dipublikasikan](#10-checklist-pengujian-sebelum-website-dipublikasikan)
11. [Penjelasan Keterbatasan Versi Tanpa Database (Stateless v1)](#11-penjelasan-keterbatasan-versi-tanpa-database-stateless-v1)

---

## 1. Persyaratan Software & Menjalankan Project Secara Lokal

Sebelum memulai, pastikan perangkat komputer Anda sudah terpasang:
- **Node.js**: Versi **18.17.0** atau yang lebih baru (disarankan versi LTS terbaru seperti v20 atau v22).  
  *Cek versi Node.js di terminal:*
  ```bash
  node -v
  ```
- **npm** (biasanya otomatis terpasang bersama Node.js) atau package manager lain seperti yarn/pnpm.
- **Git** untuk pengelolaan kode sumber.
- **Web Browser** modern (Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari).

---

## 2. Instalasi Dependency & Menjalankan Development Server

1. **Buka Terminal / Command Prompt / PowerShell** dan arahkan ke direktori project:
   ```bash
   cd c:\RupaRasa
   ```

2. **Instal seluruh paket dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Buka browser:** Akses alamat [http://localhost:3000](http://localhost:3000).  
   Website RupaRasa Kuliner sudah langsung aktif dan dapat Anda coba secara lokal.

---

## 3. Cara Mengganti Nama Toko, Logo, Gambar, Menu Produk, Kategori, & Harga

Seluruh data produk dikelola dari **satu sumber data tunggal (Single Source of Truth)** agar Anda tidak perlu mengedit banyak file:

### A. Mengubah Nama Toko & Informasi Umum
Buka file: `src/config/store.ts`  
Anda dapat mengubah nama toko, deskripsi singkat, jam operasional, dan alamat fisik:
```typescript
export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || 'RupaRasa Kuliner',
  tagline: 'Cita Rasa Otentik Makanan & Minuman Nusantara',
  address: 'Jl. Kuliner Nusantara No. 88, Kebayoran Baru, Jakarta Selatan',
  operatingHours: 'Setiap Hari: 09.00 - 21.00 WIB',
  defaultShippingFee: 10000,
  freeShippingThreshold: 100000,
};
```

### B. Mengubah Menu Produk (Katalog)
Buka file: `src/config/products.ts`  
Website memiliki 2 kategori: **Makanan** dan **Minuman**. Secara default menampilkan 2 produk contoh (1 Makanan dan 1 Minuman). Anda dapat mengganti nama, harga, deskripsi, atau gambar:
```typescript
export const PRODUCTS: Product[] = [
  {
    id: 'food-01',
    name: 'Nasi Goreng Spesial RupaRasa',
    slug: 'nasi-goreng-spesial-ruparasa',
    category: 'Makanan', // Pilihan: 'Makanan' | 'Minuman'
    price: 35000,        // Harga dalam Rupiah (angka murni tanpa titik)
    unit: 'Porsi',
    badge: 'Terlaris',
    isAvailable: true,   // Ubah ke false jika stok sedang habis
    description: 'Nasi goreng rempah Nusantara disajikan dengan suwiran ayam gurih, telur mata sapi, sate ayam...',
    image: 'https://images.unsplash.com/...', // URL foto produk makanan
  },
  {
    id: 'drink-01',
    name: 'Es Kopi Susu Aren Klasik',
    slug: 'es-kopi-susu-aren-klasik',
    category: 'Minuman',
    price: 22000,
    unit: 'Cup 16oz',
    badge: 'Best Seller',
    isAvailable: true,
    description: 'Kombinasi espresso robusta & arabika lokal pilihan, susu segar creamy, dan gula aren murni...',
    image: 'https://images.unsplash.com/...', // URL foto produk minuman
  },
];
```

> **Catatan:** Backend Route Handler (`/api/payment/charge`) membaca harga dari file ini untuk menghitung ulang tagihan secara aman. Pelanggan tidak bisa memanipulasi harga melalui browser.

---

## 4. Cara Mengatur Nomor WhatsApp Toko & Username Instagram

Pengaturan nomor WhatsApp dan Instagram dapat diatur melalui file konfigurasi lingkungan `.env.local` tanpa menyentuh kode program:

1. **Buka file `.env.local`** di root folder project.
2. **Atur nomor WhatsApp:**
   ```env
   NEXT_PUBLIC_STORE_WHATSAPP="62881080735942"
   ```
   *Aturan format:* Gunakan kode negara `62` di awal, tanpa tanda plus (`+`), tanpa spasi, dan tanpa tanda hubung (`-`). Contoh: jika nomor Anda `0881-0807-35942`, tuliskan `62881080735942`.
3. **Atur username Instagram:**
   ```env
   NEXT_PUBLIC_STORE_INSTAGRAM="ruparasa_kuliner"
   ```
   *Aturan format:* Tulis username tanpa tanda `@`. Jika belum memiliki akun Instagram toko, kosongkan nilainya (`NEXT_PUBLIC_STORE_INSTAGRAM=""`), dan tombol Instagram di footer akan otomatis menampilkan label nonaktif tanpa membuka tautan palsu.

---

## 5. Cara Mengatur Environment Variables (.env.local)

File `.env.example` disediakan sebagai acuan. Buat atau sesuaikan file `.env.local` dengan format berikut:

```env
# ===================================================
# KONFIGURASI TOKO
# ===================================================
NEXT_PUBLIC_STORE_NAME="RupaRasa Kuliner"
NEXT_PUBLIC_STORE_WHATSAPP="62881080735942"
NEXT_PUBLIC_STORE_INSTAGRAM=""
NEXT_PUBLIC_STORE_ADDRESS="Jl. Kuliner Nusantara No. 88, Jakarta Selatan"

# ===================================================
# MIDTRANS PAYMENT GATEWAY
# ===================================================
# Kosongkan atau biarkan placeholder jika ingin menjalankan "Mode Demo"
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"

# ===================================================
# KEAMANAN SESI ORDER (HMAC-SHA256)
# ===================================================
ORDER_SESSION_SECRET="kunci-rahasia-acak-minimal-32-karakter"
```

> **PENTING:** Jangan pernah melakukan commit file `.env.local` ke repositori publik (GitHub/GitLab). File `.gitignore` sudah otomatis mengecualikan `.env.local`.

---

## 6. Cara Mendapatkan & Memasang Kredensial Midtrans Sandbox

Untuk menerima pembayaran QRIS dinamis nyata di lingkungan pengujian:

1. Kunjungi [dashboard.midtrans.com](https://dashboard.midtrans.com) dan buat akun baru.
2. Setelah masuk, ubah mode toggle di pojok kiri atas dashboard menjadi **Sandbox Environment**.
3. Buka menu **Settings > Access Keys**.
4. Salin:
   - **Server Key** (contoh: `SB-Mid-server-AbCdEfGhIjK...`)
   - **Client Key** (contoh: `SB-Mid-client-12345678...`)
5. Buka file `.env.local` dan masukkan kunci tersebut:
   ```env
   MIDTRANS_SERVER_KEY="SB-Mid-server-AbCdEfGhIjK..."
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-12345678..."
   MIDTRANS_IS_PRODUCTION="false"
   ```
6. Simpan file dan restart development server (`npm run dev`).

---

## 7. Cara Menguji Alur Demo vs Pembayaran Sungguhan

Aplikasi RupaRasa membedakan secara tegas antara **Mode Demo** dan **Mode Asli** agar tidak terjadi kesalahpahaman:

### A. Mode Demo (Ketika Server Key Belum Diisi / Masih Placeholder)
- Pada halaman pembayaran, muncul banner oranye bertuliskan:  
  **`[MODE DEMO / SIMULASI ANTARMUKA]`**
- Kode QR ditampilkan dengan kartu placeholder bertuliskan **"KODE QR DEMO - JANGAN TRANSFER UANG"**. Kami tidak menggunakan QR palsu yang seolah-olah rekening aktif.
- Disediakan tombol pengujian: **`Uji Simulasi Pembayaran Berhasil (Mode Demo)`**.
- Saat tombol diklik, server memverifikasi dalam konteks demo, membuka pop-up centang hijau bertuliskan **"Status: Berhasil (Simulasi Mode Demo)"**, dan tombol WhatsApp akan membuka chat WhatsApp dengan format pesanan lengkap.

### B. Mode Asli (Ketika Server Key Midtrans Sudah Valid)
- Banner demo tidak muncul.
- Halaman menampilkan **QRIS resmi** dari Midtrans API yang dapat discan oleh aplikasi e-wallet atau m-banking sandbox simulator.
- Tombol simulasi demo otomatis dihilangkan.
- Verifikasi pembayaran berlangsung secara otomatis melalui polling status backend dan webhook Midtrans.

---

## 8. Cara Mengonfigurasi Webhook & Menguji Pembayaran Sandbox

Ketika pelanggan melakukan scan QRIS dan membayar di aplikasi perbankan, Midtrans akan mengirimkan HTTP POST (webhook) ke server backend toko.

### Konfigurasi di Dashboard Midtrans:
1. Buka Dashboard Midtrans Sandbox > **Settings > Configuration**.
2. Pada kolom **Payment Notification URL**, masukkan endpoint webhook toko:
   - Untuk website yang sudah dideploy ke Vercel:
     ```
     https://domain-anda.vercel.app/api/payment/notification
     ```
   - Untuk pengujian lokal, gunakan tunnel seperti `ngrok` (contoh: `https://xxxx.ngrok-free.app/api/payment/notification`).
3. Webhook handler pada file `src/app/api/payment/notification/route.ts` akan secara otomatis memverifikasi signature resmi Midtrans dengan rumus SHA-512:
   $$\text{SHA512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$

### Simulator Pembayaran QRIS Midtrans:
Di mode sandbox, Anda dapat membuka [simulator.sandbox.midtrans.com/qris/index](https://simulator.sandbox.midtrans.com/qris/index), masukkan string QRIS yang didapat dari transaksi, lalu tekan **Pay**. Halaman pembayaran RupaRasa akan otomatis berubah menjadi Lunas dalam 2-5 detik!

---

## 9. Cara Deploy ke Vercel & Memasukkan Environment Variables

Project Next.js App Router ini 100% siap dideploy ke Vercel:

1. **Unggah project ke GitHub / GitLab:**
   ```bash
   git add .
   git commit -m "feat: rupa-rasa kuliner initial version"
   git push origin main
   ```
2. **Buka [vercel.com](https://vercel.com) dan pilih "Add New Project".**
3. **Pilih repositori Git Anda.**
4. Pada bagian **Environment Variables**, tambahkan variabel berikut:
   - `NEXT_PUBLIC_STORE_NAME`: `RupaRasa Kuliner`
   - `NEXT_PUBLIC_STORE_WHATSAPP`: `62881080735942`
   - `NEXT_PUBLIC_STORE_INSTAGRAM`: `ruparasa_kuliner` (opsional)
   - `NEXT_PUBLIC_STORE_ADDRESS`: `Jl. Kuliner Nusantara No. 88, Jakarta Selatan`
   - `MIDTRANS_SERVER_KEY`: Server Key Anda dari Midtrans
   - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: Client Key Anda dari Midtrans
   - `MIDTRANS_IS_PRODUCTION`: `false` (atau `true` jika akun Midtrans sudah live)
   - `ORDER_SESSION_SECRET`: Masukkan string acak yang aman
5. **Klik "Deploy".** Vercel akan memproses build secara otomatis.
6. Salin domain yang diberikan oleh Vercel (contoh: `https://ruparasa-kuliner.vercel.app`) dan daftarkan webhook di dashboard Midtrans.

---

## 10. Checklist Pengujian Sebelum Website Dipublikasikan

Sebelum website digunakan oleh pelanggan nyata, lakukan verifikasi berikut:
- [ ] **Katalog:** Menampilkan 2 produk (1 Makanan dan 1 Minuman).
- [ ] **Pencarian & Filter:** Filter "Semua", "Makanan", dan "Minuman" bekerja akurat.
- [ ] **Keranjang:** Tambah produk, ubah jumlah (+ / -), hapus produk, dan total terhitung akurat.
- [ ] **Checkout:** Formulir memvalidasi nama minimal 3 karakter, nomor HP 9-15 digit, dan alamat minimal 10 karakter.
- [ ] **Anti-Double Click:** Tombol "Bayar Sekarang" dinonaktifkan saat sedang memproses transaksi.
- [ ] **Pembayaran:** Halaman `/payment/[orderId]` menampilkan Order ID, total, dan batas waktu 15 menit.
- [ ] **Reload Aman:** Merefresh atau membuka kembali halaman `/payment/[orderId]` tidak menghilangkan data pesanan.
- [ ] **Pop-up Sukses:** Pop-up hanya muncul setelah status lunas diverifikasi oleh server.
- [ ] **WhatsApp Toko:** Tombol "Lanjut ke WhatsApp Toko" membuka chat nomor toko dengan rincian pesanan yang sudah terisi otomatis dan rapi.
- [ ] **Footer:** Ikon Instagram menggunakan ikon Instagram resmi dan tidak ada ikon kamera yang salah tempat di header.

---

## 11. Penjelasan Keterbatasan Versi Tanpa Database (Stateless v1)

Sesuai spesifikasi, versi 1.0 ini dirancang **tanpa mewajibkan database server eksternal** demi kemudahan deployment dan biaya operasional yang hemat:

1. **Penyimpanan Sesi Klien (localStorage & sessionStorage):**  
   Data rincian nama dan alamat pengiriman disimpan di perangkat pemesan untuk keperluan pembuatan pesan WhatsApp dan pencetakan bukti transaksi. Pengguna lain yang hanya menebak Order ID tidak dapat mengakses data pribadi pelanggan tersebut.
2. **Keterbatasan Riwayat Multi-Perangkat:**  
   Jika pelanggan membuka tautan bukti pesanan dari perangkat atau browser yang berbeda setelah beberapa hari, detail nama/alamat lokal tidak tersedia di perangkat baru tersebut (namun status transaksi di payment gateway tetap terverifikasi lunas).
3. **Deduplikasi Webhook:**  
   Midtrans dapat mengirimkan notifikasi ulang jika jaringan sempat terputus. Tanpa database, backend memvalidasi signature secara aman dan merespons HTTP 200.
4. **Roadmap v2 (Opsional di Masa Depan):**  
   Untuk pencatatan laporan penjualan tahunan, manajemen stok berkurang otomatis, analitik multi-cabang, serta sistem login pengguna, Anda dapat menghubungkan project ini dengan database seperti PostgreSQL (Supabase / Neon) atau Prisma ORM.

---

&copy; 2026 **RupaRasa Kuliner**. Dibuat dengan cinta untuk memajukan bisnis kuliner Nusantara.
