<?php
// backend/config.php
// On local: create backend/config.local.php with your local MySQL credentials.
// On Hostinger (production): config.local.php does not exist, production values below are used.

if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
} else {
    $db_host = '207.180.252.239';
    $db_user = 'digi_pexel';
    $db_pass = 'YOUR_DB_PASSWORD';
    $db_name = 'digi_pexel';
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}
