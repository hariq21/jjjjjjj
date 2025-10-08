"use client";

import { useState } from "react";
import { createQrisPayment } from "@/lib/duitku";

export default function GameDetail({ params }: { params: { id: string } }) {
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedDiamond, setSelectedDiamond] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState("NQ"); // default QRIS NQ
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const diamonds = [
    { name: "86 Diamonds", price: 20000 },
    { name: "172 Diamonds", price: 40000 },
    { name: "257 Diamonds", price: 60000 },
  ];

  const handlePay = async () => {
    if (!playerId || !serverId || !selectedDiamond) {
      alert("Isi Player ID, Server ID, dan pilih paket diamond!");
      return;
    }

    setLoading(true);
    setStatus("Membuat transaksi...");

    try {
      const result = await createQrisPayment(selectedDiamond.name, selectedDiamond.price);
      console.log("Response Duitku:", result);

      if (result?.paymentUrl) {
        setStatus("Redirect ke halaman pembayaran...");
        window.location.href = result.paymentUrl;
      } else {
        setStatus("Gagal: paymentUrl tidak ada!");
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("Terjadi kesalahan membuat transaksi.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold capitalize">Top Up {params.id}</h1>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 -mt-6 relative z-10">
        {/* Input Data Akun */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Player ID</label>
          <input
            type="text"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Server ID</label>
          <input
            type="text"
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Pilih Paket Diamond */}
        <h2 className="text-lg font-semibold mb-2">Pilih Paket</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {diamonds.map((d, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDiamond(d)}
              className={`p-4 border rounded-lg cursor-pointer text-center ${
                selectedDiamond?.name === d.name ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <p className="font-medium">{d.name}</p>
              <p className="text-blue-600 font-bold">
                Rp {d.price.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* Metode Pembayaran Section */}
        <h2 className="text-lg font-semibold mb-2">Metode Pembayaran</h2>
        <div
          onClick={() => setSelectedMethod("NQ")}
          className={`p-4 border rounded-lg mb-6 cursor-pointer ${
            selectedMethod === "NQ" ? "border-blue-500 bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <p className="text-sm text-gray-600">Tersedia</p>
          <p className="font-bold text-blue-600">QRIS (NQ)</p>
        </div>

        {/* Status */}
        {status && <p className="mt-6 text-center text-sm text-gray-600">{status}</p>}

        {/* Footer Checkout (bukan fixed, biar ikut scroll) */}
        <div className="mt-8 border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-sm">Total</p>
            <p className="font-bold text-blue-600">
              {selectedDiamond ? `Rp ${selectedDiamond.price.toLocaleString("id-ID")}` : "Rp 0"}
            </p>
          </div>
          <button
            onClick={handlePay}
            disabled={!selectedDiamond || loading}
            className={`px-4 py-2 rounded text-white font-bold ${
              !selectedDiamond || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}
