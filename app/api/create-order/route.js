import crypto from "crypto";
import { NextResponse } from "next/server";

// Handler POST request
export async function POST(req) {
  try {
    // Data dari frontend
    const { productName, amount, paymentMethod } = await req.json();

    // Ambil dari ENV
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

    // Buat unique orderId
    const orderId = "NIF" + Date.now();

    // Signature pakai MD5: merchantCode + orderId + amount + merchantKey
    const signatureString = merchantCode + orderId + amount + merchantKey;
    const signature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    // Payload sesuai Duitku V2
    const payload = {
      merchantCode,
      paymentAmount: String(amount),
      merchantOrderId: orderId,
      productDetails: productName,
      email: "buyer@example.com",
      phoneNumber: "081234567890",
      callbackUrl,
      returnUrl,
      signature,
      paymentMethod: paymentMethod || "SP" // default ShopeePay
    };

    console.log("V2 Payload dikirim:", payload);
    console.log("Signature String:", signatureString);
    console.log("Signature MD5:", signature);

    // Request ke Duitku Sandbox
    const res = await fetch(
      "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const text = await res.text();
    console.log("Raw response dari Duitku V2:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("V2 API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
