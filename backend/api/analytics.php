<?php
// backend/api/analytics.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT code_key, code_value FROM analytics_codes");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $map = [];
        foreach ($rows as $row) {
            $map[$row['code_key']] = $row['code_value'];
        }
        json_resp('success', $map);
    } elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_codes') {
            $codes = $input['codes'] ?? [];
            if (!is_array($codes)) {
                json_resp('error', null, 'codes must be an object');
            }
            foreach ($codes as $key => $value) {
                $stmt = $pdo->prepare("INSERT INTO analytics_codes (code_key, code_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE code_value = VALUES(code_value)");
                $stmt->execute([$key, $value]);
            }
            json_resp('success', null, 'Analytics codes saved');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
