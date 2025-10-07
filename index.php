<?php
include_once __DIR__ . '/config.php';
// contoh daftar produk
$products = [
  ['id'=>'ml86','name'=>'Mobile Legends 86 Diamonds','price'=>25000,'desc'=>'Topup Mobile Legends - 86 Diamonds'],
  ['id'=>'ff140','name'=>'Free Fire 140 Diamonds','price'=>20000,'desc'=>'Topup Free Fire - 140 Diamonds'],
  ['id'=>'gp50','name'=>'Google Play Rp50.000','price'=>52000,'desc'=>'Voucher Google Play - 50k'],
  ['id'=>'steam100','name'=>'Steam Wallet Rp100.000','price'=>105000,'desc'=>'Voucher Steam - 100k']
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>NIF Store - Topup & Voucher</title>
<link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>NIF Store</h1>
      <p class="muted">Simulasi QRIS Duitku (Sandbox) - Callback: <code><?php echo $CALLBACK_URL; ?></code></p>
    </header>

    <section class="products">
      <?php foreach($products as $p): ?>
      <article class="card">
        <h3><?php echo htmlspecialchars($p['name']); ?></h3>
        <p class="desc"><?php echo htmlspecialchars($p['desc']); ?></p>
        <p class="price">Rp <?php echo number_format($p['price'],0,',','.'); ?></p>
        <form action="create_invoice.php" method="post">
          <input type="hidden" name="productId" value="<?php echo $p['id']; ?>" />
          <input type="hidden" name="productName" value="<?php echo $p['name']; ?>" />
          <input type="hidden" name="amount" value="<?php echo $p['price']; ?>" />
          <button class="btn">Bayar (QRIS Sandbox)</button>
        </form>
      </article>
      <?php endforeach; ?>
    </section>

    <footer>
      <p>Untuk admin: <a href="admin.php">Dashboard Admin</a></p>
    </footer>
  </div>
</body>
</html>
