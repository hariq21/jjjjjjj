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

    // Timestamp (milisecond UTC/Jakarta)
    const timestamp = Date.now().toString();

    // Signature SHA256
    const signature = crypto
      .createHash("sha256")
      .update(merchantCode + "-" + timestamp + "-" + merchantKey)
      .digest("hex");

    // Payload sesuai POP API
    const payload = {
      merchantOrderId: orderId,
      paymentAmount: String(amount),
      productDetails: productName,
      email: "buyer@example.com",
      phoneNumber: "081234567890",
      callbackUrl,
      returnUrl,
      paymentMethod: "QRIS", // bisa QRIS, SP, OVO, dll
    };

    console.log("Payload dikirim ke Duitku:", payload);

    const res = await fetch("https://api-sandbox.duitku.com/api/merchant/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-duitku-signature": signature,
        "x-duitku-timestamp": timestamp,
        "x-duitku-merchantcode": merchantCode,
      },
      body: JSON.stringify(payload),
    });

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
