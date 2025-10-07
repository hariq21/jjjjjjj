"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: "Mobile Legends 86 Diamonds",
          amount: 25000,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Gagal buat transaksi, cek console log");
        console.log(data);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Error checkout");
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>NIF Store</h1>
      <h2>Produk</h2>
      <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 8 }}>
        <h3>Mobile Legends 86 Diamonds</h3>
        <p>Harga: Rp25.000</p>
        <button
          onClick={checkout}
          disabled={loading}
          style={{
            padding: "8px 12px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {loading ? "Memproses..." : "Bayar QRIS (Sandbox)"}
        </button>
      </div>
    </main>
  );
}
