import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";

const DB_PATH = path.join(process.cwd(), "transactions.json");
const merchantCode = process.env.DUITKU_MERCHANTCODE || "DUMMYCODE";
const apiKey = process.env.DUITKU_APIKEY || "DUMMYKEY";
const duitkuEndpoint =
  process.env.DUITKU_URL || "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry";

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { productName, amount } = body;
    const merchantOrderId = "ORDER-" + Date.now();

    // 🔑 cek/set cookie userSessionId
    const cookieStore = cookies();
    let userSessionId = cookieStore.get("userSessionId")?.value;
    if (!userSessionId) {
      userSessionId = crypto.randomUUID();
      cookieStore.set("userSessionId", userSessionId);
    }

    // 📝 simpan transaksi pending
    const db = loadDB();
    db.push({
      merchantOrderId,
      userSessionId,
      productName,
      amount,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });
    saveDB(db);

    // 🔒 generate signature
    const signature = crypto
      .createHash("md5")
      .update(merchantCode + merchantOrderId + amount + apiKey)
      .digest("hex");

    // 📦 payload inquiry
    const payload = {
      merchantCode,
      paymentAmount: amount,
      paymentMethod: "NQ",
      merchantOrderId,
      productDetails: productName,
      email: "test@test.com",
      phoneNumber: "08123456789",
      callbackUrl: process.env.CALLBACK_URL || "http://localhost:3000/callback",
      returnUrl: `${process.env.RETURN_URL || "http://localhost:3000/success"}?order=${merchantOrderId}`,
      signature,
    };

    // 🚀 request ke Duitku
    const res = await fetch(duitkuEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    // ❗ cek status
    if (data.statusCode !== "00") {
      return NextResponse.json(
        { error: data.statusMessage || "Inquiry gagal", raw: data },
        { status: 400 }
      );
    }

    return NextResponse.json({ paymentUrl: data.paymentUrl, reference: data.reference });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
