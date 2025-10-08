import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productName, amount, paymentMethod } = await req.json();

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

    const orderId = "NIF" + Date.now();
    const signatureString = merchantCode + orderId + amount + merchantKey;
    const signature = crypto.createHash("md5").update(signatureString).digest("hex");

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
      paymentMethod, // langsung dari frontend (NQ)
    };

    const res = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
