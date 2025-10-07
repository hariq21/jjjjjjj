<?php
include_once __DIR__ . '/config.php';

// read POST
$productId = $_POST['productId'] ?? 'ml86';
$productName = $_POST['productName'] ?? 'Produk';
$amount = intval($_POST['amount'] ?? 10000);

// buat order id unik
$orderId = 'NIF' . time() . rand(100,999);

// simpan order lokal (status = PENDING)
$orders = [];
if (file_exists($ORDERS_FILE)) {
  $orders = json_decode(file_get_contents($ORDERS_FILE), true);
  if (!is_array($orders)) $orders = [];
}
$order = [
  'orderId' => $orderId,
  'productId' => $productId,
  'productName' => $productName,
  'amount' => $amount,
  'status' => 'PENDING',
  'created_at' => date('c')
];
$orders[$orderId] = $order;
file_put_contents($ORDERS_FILE, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// prepare signature = md5(merchantCode + orderId + amount + merchantKey)
$signature = md5($MERCHANT_CODE . $orderId . $amount . $MERCHANT_KEY);

// payload sesuai Duitku sandbox (endpoint v2 inquiry)
$payload = [
  'merchantCode'    => $MERCHANT_CODE,
  'merchantOrderId' => $orderId,
  'paymentAmount'   => $amount,
  'productDetails'  => $productName,
  'email'           => 'buyer@example.com',
  'phoneNumber'     => '081234567890',
  'callbackUrl'     => $CALLBACK_URL,
  'returnUrl'       => $RETURN_URL,
  'signature'       => $signature
];

$ch = curl_init('https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'api-key: ' . $API_KEY]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
  echo '<h3>cURL Error:</h3><pre>' . htmlspecialchars($err) . '</pre>';
  exit;
}
$res = json_decode($response, true);

// simpan raw response ke order
$orders = json_decode(file_get_contents($ORDERS_FILE), true);
if (!is_array($orders)) $orders = [];
if (isset($orders[$orderId])) {
  $orders[$orderId]['duitku_response'] = $res;
  $orders[$orderId]['updated_at'] = date('c');
  file_put_contents($ORDERS_FILE, json_encode($orders, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
}

// cek paymentUrl
if (isset($res['paymentUrl'])) {
  header('Location: ' . $res['paymentUrl']);
  exit;
}

// else tampilkan response untuk debugging
echo '<h3>Response from Duitku:</h3><pre>' . htmlspecialchars(json_encode($res, JSON_PRETTY_PRINT)) . '</pre>';
echo '<p><a href="index.php">Kembali</a></p>';
?>