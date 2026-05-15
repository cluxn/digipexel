<?php
// backend/api/service_content.php
// GET  ?slug=ai-seo            → { status: "success", data: { hero: {...}, features: {...}, roadmap: {...}, market_impact: {...}, cta: {...}, testimonials: {...} } }
// GET  ?slug=ai-seo&section=hero → { status: "success", data: {...hero fields...} }
// POST action=save_section, slug, section, content → upserts one row
require_once '../common.php';

send_json_headers();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $slug    = $_GET['slug']    ?? null;
        $section = $_GET['section'] ?? null;

        if (!$slug) {
            json_resp('error', null, 'slug parameter required');
        }

        if ($section) {
            // Single section fetch
            $stmt = $pdo->prepare("SELECT content FROM service_content WHERE slug = ? AND section = ?");
            $stmt->execute([$slug, $section]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            json_resp('success', $row ? json_decode($row['content'], true) : null);
        } else {
            // All sections for slug
            $stmt = $pdo->prepare("SELECT section, content FROM service_content WHERE slug = ?");
            $stmt->execute([$slug]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];
            foreach ($rows as $row) {
                $result[$row['section']] = json_decode($row['content'], true);
            }
            json_resp('success', $result);
        }

    } elseif ($method === 'POST') {
        $input   = get_input();
        $action  = $input['action']  ?? '';
        $slug    = $input['slug']    ?? '';
        $section = $input['section'] ?? '';
        $content = $input['content'] ?? null;

        if ($action === 'save_section') {
            if (!$slug || !$section || $content === null) {
                json_resp('error', null, 'slug, section and content are required');
            }
            $stmt = $pdo->prepare(
                "INSERT INTO service_content (slug, section, content, updated_at)
                 VALUES (?, ?, ?, NOW())
                 ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = NOW()"
            );
            $stmt->execute([$slug, $section, json_encode($content)]);
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
