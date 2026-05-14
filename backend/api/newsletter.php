<?php
// backend/api/newsletter.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        if ($action === 'subscribe') {
            $email = trim($input['email'] ?? '');
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                json_resp('error', null, 'Valid email address is required');
            }
            try {
                $stmt = $pdo->prepare(
                    "INSERT INTO newsletter_subscribers (email, status) VALUES (?, 'active')"
                );
                $stmt->execute([$email]);
                json_resp('success', null, 'Subscribed successfully');
            } catch (PDOException $e) {
                // MySQL error 1062 = duplicate entry
                if ($e->getCode() == 23000 || strpos($e->getMessage(), '1062') !== false) {
                    json_resp('error', null, 'Already subscribed with this email');
                }
                throw $e;
            }
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
