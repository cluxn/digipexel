<?php
require_once '../common.php';
send_json_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_resp('error', null, 'Method not allowed');
}

$input    = get_input();
$email    = trim($input['email']    ?? '');
$password =       $input['password'] ?? '';

if (!$email || !$password) {
    json_resp('error', null, 'Email and password are required');
}

// ── Auto-seed admin on first deploy (users table empty) ────────────────────────
$count = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
if ($count === 0) {
    if (strlen($password) < 8) {
        json_resp('error', null, 'Password must be at least 8 characters');
    }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $pdo->prepare(
        "INSERT INTO users (name, designation, login_id, password_hash) VALUES (?, ?, ?, ?)"
    )->execute(['Admin', 'Founder', $email, $hash]);
    json_resp('success', null, 'Admin account created and authenticated');
}

// ── Normal login ───────────────────────────────────────────────────────────────
$stmt = $pdo->prepare("SELECT password_hash FROM users WHERE login_id = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_resp('error', null, 'Invalid email or password');
}

json_resp('success', null, 'Authenticated');
