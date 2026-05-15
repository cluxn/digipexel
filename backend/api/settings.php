<?php
// backend/api/settings.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $key = $_GET['key'] ?? null;
        if ($key) {
            // Return single key-value pair
            $stmt = $pdo->prepare("SELECT `key`, `value` FROM settings WHERE `key` = ?");
            $stmt->execute([$key]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                json_resp('success', $row);
            } else {
                json_resp('success', ['key' => $key, 'value' => ''], 'Key not found, returning default');
            }
        } else {
            // Return all settings as key => value map
            $stmt = $pdo->query("SELECT `key`, `value` FROM settings");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $map = [];
            foreach ($rows as $row) {
                $map[$row['key']] = $row['value'];
            }
            json_resp('success', $map);
        }
    } elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        if ($action === 'save_setting') {
            $key = $input['key'] ?? '';
            $value = $input['value'] ?? '';
            if (!$key) {
                json_resp('error', null, 'key is required');
            }
            $stmt = $pdo->prepare(
                "INSERT INTO settings (`key`, `value`) VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)"
            );
            $stmt->execute([$key, $value]);
            json_resp('success', null, 'Setting saved');
        } elseif ($action === 'save_all_settings') {
            $settings = $input['settings'] ?? [];
            if (!is_array($settings) || empty($settings)) {
                json_resp('error', null, 'settings object is required');
            }
            $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
            foreach ($settings as $key => $value) {
                $stmt->execute([$key, $value]);
            }
            json_resp('success', null, 'All settings saved');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
