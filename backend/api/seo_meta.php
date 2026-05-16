<?php
// backend/api/seo_meta.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $page_key = $_GET['page'] ?? '';
        if (!$page_key) {
            json_resp('error', null, 'page key required');
        }
        $stmt = $pdo->prepare("SELECT seo_title, meta_description, og_image FROM seo_meta WHERE page_key = ?");
        $stmt->execute([$page_key]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        json_resp('success', $row ?: null);
    } elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        if ($action === 'save_seo_meta') {
            $page_key = trim($input['page_key'] ?? '');
            $seo_title = trim($input['seo_title'] ?? '');
            $meta_description = trim($input['meta_description'] ?? '');
            $og_image = trim($input['og_image'] ?? '');
            if (!$page_key) {
                json_resp('error', null, 'page_key is required');
            }
            $stmt = $pdo->prepare(
                "INSERT INTO seo_meta (page_key, seo_title, meta_description, og_image)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                   seo_title = VALUES(seo_title),
                   meta_description = VALUES(meta_description),
                   og_image = VALUES(og_image)"
            );
            $stmt->execute([$page_key, $seo_title, $meta_description, $og_image]);
            json_resp('success', null, 'SEO meta saved');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
