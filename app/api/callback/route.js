export async function POST(req){
  try{
    const body = await req.json();
    console.log('Duitku Callback:', body);
    // You can add verification of signature here if provided by provider
    // and persist to DB/log service.
    return new Response('OK', { status:200 });
  }catch(e){
    console.error('Callback parse error', e);
    return new Response('Bad Request', { status:400 });
  }
}
