<?php
// backend/api/site_content.php
require_once '../common.php';

// Supported sections and their content keys:
// hero    — heading, titleHighlight, subtitle, ctaText, ctaHref, eyebrow, iconSlots[]
// nav     — ctaText, ctaHref
// stats   — stats[] (label, value, description)
// footer  — newsletterHeading, newsletterSubtext
// problem — stat1_value, stat1_detail, stat1_title, stat1_body,
//           stat2_value, stat2_detail, stat2_title, stat2_body,
//           stat3_value, stat3_detail, stat3_title, stat3_body

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
            // Return section-specific defaults when no DB row exists yet.
            // This ensures admin and frontend see useful values before first save.
            $section_defaults = [
                'problem' => [
                    'stat1_value'  => '14 hrs',
                    'stat1_detail' => 'lost per team / week',
                    'stat1_title'  => 'Handoff Friction',
                    'stat1_body'   => 'Every tool switch and status update burns hours that should go toward delivering real outcomes.',
                    'stat2_value'  => '6+ tools',
                    'stat2_detail' => 'disconnected on average',
                    'stat2_title'  => 'Siloed Systems',
                    'stat2_body'   => "Fragmented data means your AI can't see the full picture — so the right action never gets triggered.",
                    'stat3_value'  => '40%',
                    'stat3_detail' => 'of all work is rework',
                    'stat3_title'  => 'Manual Rework',
                    'stat3_body'   => 'Teams spend nearly half their time re-entering, reformatting, or chasing down information.',
                ],
            ];
            if (isset($section_defaults[$section])) {
                json_resp('success', $section_defaults[$section]);
            } else {
                json_resp('success', null, 'No content for section');
            }
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
