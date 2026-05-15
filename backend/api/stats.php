<?php
// backend/api/stats.php
require_once '../common.php';
send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    json_resp('error', null, 'Method not allowed');
}

try {
    $counts = [];

    // Leads count
    $stmt = $pdo->query("SELECT COUNT(*) FROM leads");
    $counts['leads'] = (int)$stmt->fetchColumn();

    // Blogs count (published only — same filter as public listing)
    $stmt = $pdo->query("SELECT COUNT(*) FROM blogs WHERE status = 'published'");
    $counts['blogs'] = (int)$stmt->fetchColumn();

    // Case studies count
    $stmt = $pdo->query("SELECT COUNT(*) FROM case_studies");
    $counts['case_studies'] = (int)$stmt->fetchColumn();

    // Guides count
    $stmt = $pdo->query("SELECT COUNT(*) FROM guides");
    $counts['guides'] = (int)$stmt->fetchColumn();

    // Testimonials count
    $stmt = $pdo->query("SELECT COUNT(*) FROM testimonials");
    $counts['testimonials'] = (int)$stmt->fetchColumn();

    // Newsletter subscribers count (active only)
    $stmt = $pdo->query("SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active'");
    $counts['subscribers'] = (int)$stmt->fetchColumn();

    json_resp('success', $counts);
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
