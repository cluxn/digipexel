<?php
// backend/api/site_content.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $section = $_GET['section'] ?? null;
        if (!$section) {
            json_resp('error', null, 'section parameter required');
        }
        $stmt = $pdo->prepare("SELECT content FROM site_content WHERE section = ?");
        $stmt->execute([$section]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            json_resp('success', json_decode($row['content'], true));
        } else {
            json_resp('success', null, 'No content for section');
        }
    } elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        if ($action === 'save_section') {
            $section = $input['section'] ?? '';
            $content = $input['content'] ?? null;
            if (!$section || $content === null) {
                json_resp('error', null, 'section and content are required');
            }
            $stmt = $pdo->prepare(
                "INSERT INTO site_content (section, content, updated_at) VALUES (?, ?, NOW())
                 ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = NOW()"
            );
            $stmt->execute([$section, json_encode($content)]);
            json_resp('success', null, 'Section saved');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
