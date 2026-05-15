<?php
// backend/api/upload.php — image file upload endpoint
require_once '../common.php';

send_json_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_resp('error', null, 'POST required');
    exit;
}

$file = $_FILES['file'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    $codes = [1=>'too large',2=>'too large',3=>'partial',4=>'no file',6=>'no tmp',7=>'write fail',8=>'extension blocked'];
    $msg = isset($file) ? ($codes[$file['error']] ?? 'upload error') : 'no file field';
    json_resp('error', null, 'Upload failed: ' . $msg);
    exit;
}

$allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/gif'=>'gif','image/webp'=>'webp','image/svg+xml'=>'svg'];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($file['tmp_name']);
if (!isset($allowed[$mime])) {
    json_resp('error', null, 'Invalid file type. Allowed: jpg, png, gif, webp, svg');
    exit;
}

if ($file['size'] > 2 * 1024 * 1024) {
    json_resp('error', null, 'File too large. Maximum 2 MB');
    exit;
}

$upload_dir = dirname(__DIR__) . '/uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$filename = 'upload_' . bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
$dest     = $upload_dir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_resp('error', null, 'Failed to save file');
    exit;
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'];
$url      = $protocol . '://' . $host . '/backend/uploads/' . $filename;

json_resp('success', ['url' => $url]);
