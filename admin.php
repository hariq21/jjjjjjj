<?php
include_once __DIR__ . '/config.php';

session_start();
// simple login
if (isset($_POST['password'])) {
  if ($_POST['password'] === $ADMIN_PASSWORD) {
    $_SESSION['admin'] = true;
  } else {
    $error = 'Password salah';
  }
}
if (isset($_GET['logout'])) {
  session_destroy();
  header('Location: admin.php');
  exit;
}
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
  ?>
  <!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><title>Admin Login</title><link rel="stylesheet" href="styles.css"></head><body><div class="container"><h2>Admin Login</h2><?php if(isset($error)) echo '<p style="color:red">'.htmlspecialchars($error).'</p>'; ?><form method="post"><input type="password" name="password" placeholder="Password admin"><button class="btn" type="submit">Login</button></form><p>Default password: admin123 (ganti di config.php)</p></div></body></html><?php
  exit;
}

// load orders & callback log
$orders = [];
if (file_exists($ORDERS_FILE)) {
  $orders = json_decode(file_get_contents($ORDERS_FILE), true);
  if (!is_array($orders)) $orders = [];
}
$callbackLog = file_exists($CALLBACK_LOG) ? file_get_contents($CALLBACK_LOG) : '';
?>
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"/><title>Admin - NIF Store</title><link rel="stylesheet" href="styles.css"></head>
<body>
<div class="container">
  <header><h1>Admin Dashboard</h1><p><a href="admin.php?logout=1">Logout</a></p></header>
  <section>
    <h2>Orders</h2>
    <?php if(empty($orders)): ?>
      <p>Tidak ada order.</p>
    <?php else: ?>
      <table class="table"><thead><tr><th>OrderId</th><th>Produk</th><th>Amount</th><th>Status</th><th>Waktu</th></tr></thead><tbody>
      <?php foreach($orders as $o): ?>
        <tr>
          <td><?php echo htmlspecialchars($o['orderId']); ?></td>
          <td><?php echo htmlspecialchars($o['productName']); ?></td>
          <td>Rp <?php echo number_format($o['amount'],0,',','.'); ?></td>
          <td><?php echo htmlspecialchars($o['status']); ?></td>
          <td><?php echo htmlspecialchars($o['created_at'] ?? ''); ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody></table>
    <?php endif; ?>
  </section>

  <section style="margin-top:20px">
    <h2>Callback Log</h2>
    <pre style="background:#fff;padding:12px;border-radius:6px;max-height:300px;overflow:auto;"><?php echo htmlspecialchars($callbackLog); ?></pre>
  </section>
</div>
</body>
</html>
