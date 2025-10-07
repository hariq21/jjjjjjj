"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";  // biar tidak di-prerender

function SuccessContent() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") || "—";
  const amount  = sp.get("amount")  || "—";
  const status  = sp.get("status")  || "SUCCESS (sandbox assumed)";

  return (
    <div className="container">
      <h1>Pembayaran Berhasil</h1>
      <div className="success">
        Terima kasih! Pembayaran Anda telah diproses.
      </div>
      <ul className="muted">
        <li><b>Order ID:</b> {orderId}</li>
        <li><b>Jumlah:</b> {amount !== "—" ? `Rp ${Number(amount).toLocaleString("id-ID")}` : "—"}</li>
        <li><b>Status:</b> {status}</li>
      </ul>
      <p className="muted">
        Halaman ini dituju oleh <code>RETURN_URL</code> setelah flow pembayaran selesai.
      </p>
      <p><a className="btn" href="/">Kembali ke Beranda</a></p>
      <div className="warn">
        Catatan: Pada sandbox, status akhir yang valid tetap mengacu pada data callback di <code>/callback</code>.
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container"><p>Memuat...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
