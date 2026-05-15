<?php
// backend/api/banners.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT config_key, config_value FROM banners");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $map = [];
        foreach ($rows as $row) {
            $decoded = json_decode($row['config_value'], true);
            $map[$row['config_key']] = $decoded ?: [];
        }
        json_resp('success', $map);
    } elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_banners') {
            $configs = $input['configs'] ?? [];
            if (!is_array($configs)) {
                json_resp('error', null, 'configs must be an object');
            }
            foreach ($configs as $key => $value) {
                $encoded = json_encode($value);
                $stmt = $pdo->prepare("INSERT INTO banners (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)");
                $stmt->execute([$key, $encoded]);
            }
            json_resp('success', null, 'Banner config saved');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
