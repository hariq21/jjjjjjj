export async function createQrisPayment(product: string, amount: number) {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productName: product,
      amount: amount,
      paymentMethod: "NQ" // QRIS code NQ
    }),
  });

  return res.json();
}
