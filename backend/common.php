<?php
// backend/common.php
require_once 'config.php';

/**
 * Standardize JSON API Headers & CORS
 */
function send_json_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit;
    }
}

/**
 * Enhanced JSON response helper
 */
function json_resp($status, $data = null, $message = null) {
    $res = ["status" => $status];
    if ($data !== null) $res["data"] = $data;
    if ($message !== null) $res["message"] = $message;
    echo json_encode($res);
    exit;
}

/**
 * Slugify strings for URLs
 */
function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    if (empty($text)) return 'n-a';
    return $text;
}

/**
 * Utility to process standard CRUD inputs
 */
function get_input() {
    return json_decode(file_get_contents('php://input'), true);
}
