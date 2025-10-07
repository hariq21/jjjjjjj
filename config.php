<?php
// konfigurasi merchant - ISI DENGAN DATA ANDA
$MERCHANT_CODE = 'DS25345';
$MERCHANT_KEY  = '6e5829c69800e8aae01cea9a3197ec4f'; // Merchant Key (API Key di dashboard)
$API_KEY       = ''; // optional, tidak wajib
$CALLBACK_URL  = 'https://nifstore-orcin.vercel.app/callback.php';
$RETURN_URL    = 'https://nifstore-orcin.vercel.app/';
// Simple admin password - ganti setelah deploy
$ADMIN_PASSWORD = 'admin123';
// File penyimpanan order & log
$ORDERS_FILE = __DIR__ . '/orders.json';
$CALLBACK_LOG = __DIR__ . '/callback_log.txt';
?>