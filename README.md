# NIF Store - Duitku QRIS Sandbox Demo

Project ini adalah package **Static PHP** sederhana untuk demo integrasi **Duitku QRIS (Sandbox)**. Siap di-upload ke cPanel / shared hosting.

## File penting
- `index.php` - Landing page & daftar produk
- `create_invoice.php` - Membuat invoice ke Duitku Sandbox (menghasilkan paymentUrl)
- `callback.php` - Endpoint callback yang menerima notifikasi dari Duitku
- `admin.php` - Dashboard admin sederhana (lihat orders & callback log)
- `config.php` - Konfigurasi merchant (Merchant Code & Merchant Key sudah terisi)
- `orders.json` - file yang otomatis dibuat untuk menyimpan orders
- `callback_log.txt` - file log callback

## Cara pakai
1. Upload semua file ke folder `public_html/` di hosting cPanel.
2. Pastikan server support PHP (>=7.2) dan cURL.
3. Akses `https://yourdomain.com/index.php` untuk melihat produk.
4. Saat klik Bayar, user akan diarahkan ke halaman QRIS Sandbox.
5. Pastikan callback URL di dashboard Duitku diset ke: `https://yourdomain.com/callback.php`.
6. Cek `admin.php` untuk melihat order dan callback log.

## Keamanan
- Ganti password admin di `config.php`.
- Jangan taruh file ini di repositori publik dengan merchant key.

## Catatan
- Merchant Code: `DS25345`
- Merchant Key: `6e5829c69800e8aae01cea9a3197ec4f`

