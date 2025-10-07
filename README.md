# NIF Store — Next.js + Duitku QRIS Sandbox (Vercel)
Project ini menampilkan produk Diamond Mobile Legends dan mengintegrasikan pembayaran QRIS Duitku (Sandbox) menggunakan Next.js App Router (cocok untuk Vercel).

## Struktur
- `app/page.js` — landing + daftar produk (86/172/257/514 diamonds)
- `app/api/create-order/route.js` — membuat invoice ke Duitku (menghasilkan `paymentUrl`)
- `app/api/callback/route.js` — endpoint callback (log ke Vercel)
- `app/success/page.js` — halaman sukses (dikunjungi dari `RETURN_URL`)
- `vercel.json` — rewrite `/callback` → `/api/callback`
- `.env.example` — contoh environment variables (copy ke `.env.local`)
- `.gitignore` — ignore `node_modules`, `.next`, `.env.local`

## Env
Salin `.env.example` menjadi `.env.local`. Untuk produksi, set di Project Settings Vercel:
- `MERCHANT_CODE=DS25345`
- `MERCHANT_KEY=6e5829c69800e8aae01cea9a3197ec4f`
- `CALLBACK_URL=https://nifstore-orcin.vercel.app/api/callback`
- `RETURN_URL=https://nifstore-orcin.vercel.app/success`

## Jalankan lokal
```
npm install
npm run dev
```

## Deploy
- Push ke GitHub, import di Vercel, set Environment Variables, Deploy.
- Admin Duitku akan melihat produk, checkout, halaman pembayaran QRIS (sandbox), callback aktif, dan return page.

## Catatan Keamanan
Jangan commit `.env.local` ke repo publik (sudah diignore).
