<?php
// backend/config.php (Updated for digipexel.cluxn.com)
$db_host = 'localhost';
$db_user = 'u723773599_digipexel'; // Assuming prefix based on FTP user
$db_pass = 'Digipexel@12345';
$db_name = 'u723773599_digipexel';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Return structured error for the frontend
    header("Content-Type: application/json; charset=UTF-8");
    die(json_encode(["error" => "Database connection failed. Check your Hostinger DB settings."]));
}
