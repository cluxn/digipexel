<?php
// backend/api/index.php
require_once '../common.php';

send_json_headers();

json_resp('success', [
    "message" => "Digi Pexel Backend API is online.",
    "version" => "1.1.0",
    "framework" => "Native PHP/PDO"
]);
