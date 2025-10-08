import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const DB_PATH = path.join(process.cwd(), "transactions.json");

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export default function HistoryPage() {
  const cookieStore = cookies();
  const userSessionId = cookieStore.get("userSessionId")?.value;
  const db = loadDB().filter((tx) => tx.userSessionId === userSessionId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Histori Transaksi</h1>
      {db.length === 0 ? (
        <p className="text-gray-600">Belum ada transaksi.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Order ID</th>
              <th className="border px-2 py-1">Produk</th>
              <th className="border px-2 py-1">Jumlah</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {db.map((tx, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{tx.merchantOrderId}</td>
                <td className="border px-2 py-1">{tx.productName}</td>
                <td className="border px-2 py-1">Rp {tx.amount}</td>
                <td className="border px-2 py-1">{tx.status}</td>
                <td className="border px-2 py-1">{tx.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
