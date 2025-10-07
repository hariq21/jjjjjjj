import crypto from "crypto";

export async function POST(req) {
  const { productName, amount } = await req.json();

  const merchantCode = process.env.MERCHANT_CODE;
  const merchantKey = process.env.MERCHANT_KEY;
  const callbackUrl = process.env.CALLBACK_URL;
  const returnUrl = process.env.RETURN_URL;

  const orderId = "NIF" + Date.now();

  const signature = crypto
    .createHash("md5")
    .update(merchantCode + orderId + amount + merchantKey)
    .digest("hex");

  const payload = {
    merchantCode,
    paymentAmount: amount,
    merchantOrderId: orderId,
    productDetails: productName,
    email: "buyer@example.com",
    phoneNumber: "081234567890",
    callbackUrl,
    returnUrl,
    signature,
  };

  try {
    const res = await fetch(
      "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
