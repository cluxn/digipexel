<?php
// backend/api/upload.php — image file upload endpoint (no DB dependency)
ob_start();
@ini_set('display_errors', '0');
@error_reporting(0);
ob_end_clean();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

function upload_json($status, $data = null, $message = null) {
    $res = ["status" => $status];
    if ($data !== null) $res["data"] = $data;
    if ($message !== null) $res["message"] = $message;
    echo json_encode($res);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    upload_json('error', null, 'POST required');
}

$file = $_FILES['file'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    $codes = [
        1 => 'File too large (PHP limit)',
        2 => 'File too large (form limit)',
        3 => 'Partial upload',
        4 => 'No file received',
        6 => 'No temp directory',
        7 => 'Cannot write to disk',
        8 => 'Extension blocked',
    ];
    $msg = isset($file)
        ? ($codes[$file['error']] ?? 'Upload error code ' . $file['error'])
        : 'No file field in request';
    upload_json('error', null, 'Upload failed: ' . $msg);
}

$allowed = [
    'image/jpeg'   => 'jpg',
    'image/png'    => 'png',
    'image/gif'    => 'gif',
    'image/webp'   => 'webp',
    'image/svg+xml' => 'svg',
];

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($file['tmp_name']);
if (!isset($allowed[$mime])) {
    upload_json('error', null, 'Invalid file type. Allowed: jpg, png, gif, webp, svg. Got: ' . $mime);
}

if ($file['size'] > 5 * 1024 * 1024) {
    upload_json('error', null, 'File too large. Maximum 5 MB');
}

$upload_dir = dirname(__DIR__) . '/uploads/';
if (!is_dir($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        upload_json('error', null, 'Could not create uploads directory');
    }
}

$filename = 'upload_' . bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
$dest     = $upload_dir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    upload_json('error', null, 'Failed to save file — check server write permissions');
}

// Derive the public URL from the script's own path so it works in any subdirectory.
$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host      = $_SERVER['HTTP_HOST'];
$base_path = dirname(dirname($_SERVER['SCRIPT_NAME'])); // /backend/api/upload.php → /backend
$url       = $protocol . '://' . $host . rtrim($base_path, '/') . '/uploads/' . $filename;

upload_json('success', ['url' => $url]);
