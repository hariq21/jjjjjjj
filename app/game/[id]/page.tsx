"use client";

import { useState } from "react";
import { createQrisPayment } from "@/lib/duitku";

const diamonds = [
  { id: 1, name: "86 Diamonds", price: 20000 },
  { id: 2, name: "172 Diamonds", price: 38000 },
  { id: 3, name: "257 Diamonds", price: 55000 },
  { id: 4, name: "344 Diamonds", price: 73000 },
  { id: 5, name: "514 Diamonds", price: 102000 },
];

export default function GameDetail({ params }: { params: { id: string } }) {
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQris = async (diamond: any) => {
    if (!playerId || !serverId) {
      alert("Isi Player ID & Server ID dulu!");
      return;
    }
    setLoading(true);
    try {
      const result = await createQrisPayment(diamond.name, diamond.price);
      console.log("Response Duitku:", result);

      if (result?.paymentUrl) {
        // ✅ langsung redirect ke halaman pembayaran sandbox
        window.location.href = result.paymentUrl;
      } else {
        alert("Payment URL tidak ditemukan di response, cek console log.");
      }
    } catch (err) {
      console.error("Error QRIS:", err);
      alert("Gagal membuat pembayaran QRIS");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-blue-600 text-white rounded-2xl shadow-md p-10 text-center mb-10">
          <h1 className="text-4xl font-bold capitalize">{params.id} Top Up</h1>
          <p className="mt-2 text-lg text-blue-100">
            Masukkan data akun dan pilih jumlah diamond
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Akun</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-600 font-medium">
                Player ID
              </label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Masukkan Player ID"
                className="w-full border p-3 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-600 font-medium">
                Server ID
              </label>
              <input
                type="text"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                placeholder="Masukkan Server ID"
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {diamonds.map((diamond) => (
            <div
              key={diamond.id}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:scale-105 transition"
            >
              <h3 className="text-lg font-bold mb-2">{diamond.name}</h3>
              <p className="text-gray-600 mb-4">
                Rp {diamond.price.toLocaleString()}
              </p>
              <button
                onClick={() => handleQris(diamond)}
                disabled={!playerId || !serverId || loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Bayar dengan QRIS"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
