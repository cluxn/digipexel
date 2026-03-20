<?php
// backend/api/testimonials.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY position ASC");
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmtFocus = $pdo->query("SELECT * FROM testimonials_focus ORDER BY position ASC");
        $focus = $stmtFocus->fetchAll(PDO::FETCH_ASSOC);

        json_resp('success', [
            "testimonials" => $testimonials,
            "focus" => $focus
        ]);
    } 
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        
        if ($action === 'update_testimonials') {
            $pdo->exec("DELETE FROM testimonials");
            $stmt = $pdo->prepare("INSERT INTO testimonials (name, role, company, content, image_url, category, position) VALUES (?, ?, ?, ?, ?, ?, ?)");
            foreach ($input['testimonials'] as $index => $t) {
                $stmt->execute([
                    $t['name'],
                    $t['role'] ?? '',
                    $t['company'] ?? '',
                    $t['content'] ?? '',
                    $t['image_url'] ?? '',
                    $t['category'] ?? 'General',
                    $index
                ]);
            }
            json_resp('success', null, 'Testimonials updated');
        }
        elseif ($action === 'update_focus') {
            $pdo->exec("DELETE FROM testimonials_focus");
            $stmt = $pdo->prepare("INSERT INTO testimonials_focus (type, url, thumbnail_url, label, position) VALUES (?, ?, ?, ?, ?)");
            foreach ($input['focus'] as $index => $f) {
                $stmt->execute([
                    $f['type'],
                    $f['url'],
                    $f['thumbnail_url'] ?? '',
                    $f['label'] ?? '',
                    $index
                ]);
            }
            json_resp('success', null, 'Focus items updated');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
