export async function POST(req) {
  const body = await req.json();
  console.log("Callback Duitku:", body);
  return new Response("OK", { status: 200 });
}
