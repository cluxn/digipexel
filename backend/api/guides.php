<?php
// backend/api/guides.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM guides ORDER BY position ASC");
        json_resp('success', $stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        
        if ($action === 'update_guides') {
            $pdo->exec("DELETE FROM guides");
            $stmt = $pdo->prepare("INSERT INTO guides (title, slug, description, content, image_url, category, cta_label, cta_link, feature1, feature2, feature3, feature4, stat1_label, stat1_value, stat2_label, stat2_value, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($input['guides'] as $index => $guide) {
                $stmt->execute([
                    $guide['title'], 
                    $guide['slug'] ?? slugify($guide['title']),
                    $guide['description'] ?? '', 
                    $guide['content'] ?? '',
                    $guide['image_url'] ?? '', 
                    $guide['category'] ?? 'General',
                    $guide['cta_label'] ?? 'Download Guide',
                    $guide['cta_link'] ?? '#',
                    $guide['feature1'] ?? '',
                    $guide['feature2'] ?? '',
                    $guide['feature3'] ?? '',
                    $guide['feature4'] ?? '',
                    $guide['stat1_label'] ?? 'Execution',
                    $guide['stat1_value'] ?? 'Real-time',
                    $guide['stat2_label'] ?? 'Security',
                    $guide['stat2_value'] ?? 'Enterprise',
                    $index
                ]);
            }
            json_resp('success', null, 'Guides updated');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
