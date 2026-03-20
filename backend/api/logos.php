<?php
// backend/api/logos.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM logos ORDER BY position ASC");
        
        $status = true;
        if (file_exists('../section_status.json')) {
            $settings = json_decode(file_get_contents('../section_status.json'), true);
            $status = $settings['logos_enabled'] ?? true;
        }

        json_resp('success', [
            "enabled" => $status,
            "logos" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
    } 
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        
        if ($action === 'toggle_section') {
            file_put_contents('../section_status.json', json_encode(['logos_enabled' => $input['enabled']]));
            json_resp('success', null, 'Section status updated');
        }
        elseif ($action === 'update_logos') {
            $pdo->exec("DELETE FROM logos");
            $stmt = $pdo->prepare("INSERT INTO logos (name, src, display_type, position) VALUES (?, ?, ?, ?)");
            foreach ($input['logos'] as $index => $logo) {
                $stmt->execute([
                    $logo['name'], 
                    $logo['src'] ?? '', 
                    $logo['display_type'] ?? 'image', 
                    $index
                ]);
            }
            json_resp('success', null, 'Logos updated');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
