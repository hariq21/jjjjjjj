<?php
include_once __DIR__ . '/config.php';
// Baca raw input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// append ke callback log
$logLine = date('Y-m-d H:i:s') . ' ' . json_encode($data, JSON_UNESCAPED_SLASHES) . PHP_EOL;
file_put_contents($CALLBACK_LOG, $logLine, FILE_APPEND);

// jika ada merchantOrderId, update status order
if (is_array($data) && isset($data['merchantOrderId'])) {
  $orderId = $data['merchantOrderId'];
  if (file_exists($ORDERS_FILE)) {
    $orders = json_decode(file_get_contents($ORDERS_FILE), true);
    if (isset($orders[$orderId])) {
      // contoh: update status berdasarkan status yang dikirim Duitku
      $orders[$orderId]['status'] = $data['status'] ?? 'UNKNOWN';
      $orders[$orderId]['duitku_callback'] = $data;
      $orders[$orderId]['updated_at'] = date('c');
      file_put_contents($ORDERS_FILE, json_encode($orders, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
    }
  }
}

// penting: balas 200 OK
http_response_code(200);
echo 'OK';
?>