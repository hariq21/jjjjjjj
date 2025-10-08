"use client";

import { useState } from "react";
import { createQrisPayment } from "@/lib/duitku";

const diamonds = [
  { id: 1, name: "86 Diamonds", price: 20000, img: "https://cdn-icons-png.flaticon.com/512/3502/3502458.png" },
  { id: 2, name: "172 Diamonds", price: 38000, img: "https://cdn-icons-png.flaticon.com/512/3502/3502458.png" },
  { id: 3, name: "257 Diamonds", price: 55000, img: "https://cdn-icons-png.flaticon.com/512/3502/3502458.png" },
  { id: 4, name: "344 Diamonds", price: 73000, img: "https://cdn-icons-png.flaticon.com/512/3502/3502458.png" },
  { id: 5, name: "514 Diamonds", price: 102000, img: "https://cdn-icons-png.flaticon.com/512/3502/3502458.png" },
];

export default function GameDetail({ params }: { params: { id: string } }) {
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedDiamond, setSelectedDiamond] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [qrisStatus, setQrisStatus] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!playerId || !serverId || !selectedDiamond) {
      alert("Isi Player ID, Server ID, dan pilih paket diamond!");
      return;
    }

    setLoading(true);
    setQrisStatus("Menunggu pembayaran QRIS...");

    try {
      // Hardcode paymentMethod = NQ (QRIS)
      const result = await createQrisPayment(selectedDiamond.name, selectedDiamond.price, "NQ");
      console.log("Response Duitku:", result);

      if (result?.paymentUrl) {
        setQrisStatus("QRIS berhasil dibuat. Mengalihkan ke halaman pembayaran...");
        window.location.href = result.paymentUrl;
      } else {
        setQrisStatus("Gagal membuat pembayaran QRIS, cek response API.");
      }
    } catch (err) {
      console.error("Error QRIS:", err);
      setQrisStatus("Terjadi error saat membuat pembayaran.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 pb-40">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="bg-blue-600 text-white rounded-2xl shadow-md p-10 text-center mb-10">
          <h1 className="text-4xl font-bold capitalize">{params.id} Top Up</h1>
          <p className="mt-2 text-lg text-blue-100">
            Masukkan data akun, pilih diamond, lalu bayar dengan QRIS
          </p>
        </div>

        {/* FORM AKUN */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Data Akun</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-600 font-medium">Player ID</label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Masukkan Player ID"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-600 font-medium">Server ID</label>
              <input
                type="text"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                placeholder="Masukkan Server ID"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* LIST DIAMOND */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Diamond</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {diamonds.map((diamond) => (
            <div
              key={diamond.id}
              onClick={() => setSelectedDiamond(diamond)}
              className={`cursor-pointer bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 border-2 transition 
                ${selectedDiamond?.id === diamond.id ? "border-blue-600" : "border-transparent hover:border-gray-300"}`}
            >
              <img src={diamond.img} alt={diamond.name} className="w-20 h-20 object-contain" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{diamond.name}</h3>
                <p className="text-gray-600">Rp {diamond.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER CHECKOUT */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl p-6 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Metode */}
          <div>
            <p className="text-gray-600 text-sm">Metode Pembayaran</p>
            <p className="text-gray-800 font-semibold">QRIS</p>
          </div>

          {/* Total */}
          <div>
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-xl font-bold text-blue-600">
              Rp {selectedDiamond ? selectedDiamond.price.toLocaleString() : "0"}
            </p>
          </div>

          {/* Tombol bayar */}
          <button
            onClick={handleCheckout}
            disabled={!playerId || !serverId || !selectedDiamond || loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>

        {/* Status pembayaran */}
        {qrisStatus && (
          <div className="mt-4 text-center text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
            {qrisStatus}
          </div>
        )}
      </div>
    </main>
  );
}