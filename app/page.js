"use client";
import { useState } from 'react';

const PRODUCTS = [
  { id:'ml86',  name:'Mobile Legends 86 Diamonds',  price:200, desc:'Paket hemat untuk push rank.' },
  { id:'ml172', name:'Mobile Legends 172 Diamonds', price:48000, desc:'Best value, cocok untuk weekly pack.' },
  { id:'ml257', name:'Mobile Legends 257 Diamonds', price:72000, desc:'Lebih banyak untuk skin epic.' },
  { id:'ml514', name:'Mobile Legends 514 Diamonds', price:142000, desc:'Pas untuk starlight + top up event.' }
];

export default function Home(){
  const [loadingId, setLoadingId] = useState(null);

  async function checkout(p){
    setLoadingId(p.id);
    try{
      const res = await fetch('/api/create-order',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ productName: p.name, amount: p.price })
      });
      const data = await res.json();
      setLoadingId(null);
      if(data?.paymentUrl){
        window.location.href = data.paymentUrl;
      }else{
        alert('Gagal membuat transaksi. Lihat console.'); console.log(data);
      }
    }catch(e){
      setLoadingId(null);
      console.error(e);
      alert('Terjadi error saat checkout.');
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">NIF Store</div>
        <div className="badge">QRIS Demo • Duitku Sandbox</div>
      </div>

      <p className="muted">Callback URL yang terdaftar: <code>/callback</code> → di-rewrite ke <code>/api/callback</code></p>

      <div className="grid">
        {PRODUCTS.map(p => (
          <article key={p.id} className="card">
            <h3>{p.name}</h3>
            <div className="muted">{p.desc}</div>
            <div className="price">Rp {p.price.toLocaleString('id-ID')}</div>
            <button className="btn" onClick={()=>checkout(p)} disabled={loadingId===p.id}>
              {loadingId===p.id? 'Memproses...' : 'Bayar QRIS (Sandbox)'}
            </button>
          </article>
        ))}
      </div>

      <div className="footer">
        <p>Tips verifikasi: tampilkan produk, harga Rupiah, tombol checkout, <em>return page</em> setelah bayar, dan endpoint <code>/callback</code> aktif.</p>
      </div>
    </div>
  );
}
