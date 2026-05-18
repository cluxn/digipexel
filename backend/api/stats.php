<?php
// backend/api/stats.php
require_once '../common.php';
send_json_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_resp('error', null, 'Method not allowed');
    exit;
}

$counts = [
    'leads'        => 0,
    'blogs'        => 0,
    'case_studies' => 0,
    'guides'       => 0,
    'testimonials' => 0,
    'subscribers'  => 0,
];

// Each query is independent — one missing table never kills the whole response
try {
    $counts['leads'] = (int)$pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
} catch (Exception $e) {}

try {
    // Admin count: all blogs regardless of status
    $counts['blogs'] = (int)$pdo->query("SELECT COUNT(*) FROM blogs")->fetchColumn();
} catch (Exception $e) {}

try {
    $counts['case_studies'] = (int)$pdo->query("SELECT COUNT(*) FROM case_studies")->fetchColumn();
} catch (Exception $e) {}

try {
    $counts['guides'] = (int)$pdo->query("SELECT COUNT(*) FROM guides")->fetchColumn();
} catch (Exception $e) {}

try {
    $counts['testimonials'] = (int)$pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
} catch (Exception $e) {}

try {
    $counts['subscribers'] = (int)$pdo->query(
        "SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active'"
    )->fetchColumn();
} catch (Exception $e) {
    // Table may not exist yet — leave at 0
}

json_resp('success', $counts);
