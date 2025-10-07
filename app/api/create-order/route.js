import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productName, amount } = await req.json();

    const merchantCode = process.env.MERCHANT_CODE;
    const merchantKey = process.env.MERCHANT_KEY;
    const callbackUrl = process.env.CALLBACK_URL;
    const returnUrl = process.env.RETURN_URL;

    if (!merchantCode || !merchantKey) {
      return NextResponse.json(
        { error: "Missing MERCHANT_CODE or MERCHANT_KEY env" },
        { status: 500 }
      );
    }

    // Order ID unik
    const orderId = "NIF" + Date.now();

    // Signature sesuai docs
    const signature = crypto
      .createHash("md5")
      .update(merchantCode + orderId + amount + merchantKey)
      .digest("hex");

    // Payload sesuai API browser docs
    const payload = {
      merchantCode,
      paymentAmount: String(amount),   // contoh "25000"
      merchantOrderId: orderId,
      productDetails: productName,
      email: "buyer@example.com",
      phoneNumber: "081234567890",
      callbackUrl,
      returnUrl,
      signature,
      paymentMethod: "QRIS"   // huruf besar semua
    };
    
    console.log("Payload dikirim ke Duitku:", payload);

    const res = await fetch(
      "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const text = await res.text();
    console.log("Raw response dari Duitku:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error di server:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
