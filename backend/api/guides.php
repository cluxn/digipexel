<?php
// backend/api/guides.php
require_once '../common.php';

send_json_headers();

// Auto-migrate: add columns that may not exist yet
$migrations = [
    "ALTER TABLE guides ADD COLUMN status VARCHAR(20) DEFAULT 'published'",
    "ALTER TABLE guides ADD COLUMN author_name VARCHAR(255) DEFAULT 'Digi Pexel Team'",
    "ALTER TABLE guides ADD COLUMN published_at DATE",
    "ALTER TABLE guides ADD COLUMN scheduled_at DATETIME",
    "ALTER TABLE guides ADD COLUMN meta_title VARCHAR(255)",
    "ALTER TABLE guides ADD COLUMN meta_description TEXT",
];
$status_col_newly_added = false;
foreach ($migrations as $sql) {
    try {
        $pdo->exec($sql);
        if (strpos($sql, 'ADD COLUMN status') !== false) {
            $status_col_newly_added = true;
        }
    } catch (Exception $e) { /* column already exists */ }
}
// Promote any guides with null/empty status to 'published' (legacy rows from before this column existed).
try {
    $pdo->exec("UPDATE guides SET status = 'published' WHERE status IS NULL OR status = ''");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $admin = isset($_GET['admin']);
        if ($admin) {
            $stmt = $pdo->query("SELECT * FROM guides ORDER BY position ASC");
        } else {
            $stmt = $pdo->query("SELECT * FROM guides WHERE status = 'published' ORDER BY position ASC");
        }
        json_resp('success', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_guide') {
            $b = $input['guide'] ?? [];
            $d = [
                'title'            => trim($b['title']            ?? ''),
                'slug'             => trim($b['slug']             ?? ''),
                'description'      => trim($b['description']      ?? ''),
                'content'          => trim($b['content']          ?? ''),
                'image_url'        => trim($b['image_url']        ?? ''),
                'category'         => trim($b['category']         ?? ''),
                'cta_label'        => trim($b['cta_label']        ?? 'Download the Guide'),
                'cta_link'         => trim($b['cta_link']         ?? '#'),
                'position'         => (int)($b['position']        ?? 0),
                'status'           => trim($b['status']           ?? 'published'),
                'author_name'      => trim($b['author_name']      ?? 'Digi Pexel Team'),
                'published_at'     => !empty($b['published_at'])  ? $b['published_at'] : null,
                'scheduled_at'     => !empty($b['scheduled_at'])  ? $b['scheduled_at'] : null,
                'meta_title'       => trim($b['meta_title']       ?? ''),
                'meta_description' => trim($b['meta_description'] ?? ''),
            ];
            if (!$d['title'] || !$d['slug']) {
                json_resp('error', null, 'title and slug required');
            }
            if (!empty($b['id'])) {
                $cols = implode(', ', array_map(fn($k) => "$k = ?", array_keys($d)));
                $vals = array_values($d);
                $vals[] = (int)$b['id'];
                $pdo->prepare("UPDATE guides SET $cols WHERE id = ?")->execute($vals);
                json_resp('success', ['id' => (int)$b['id']]);
            } else {
                $keys = implode(', ', array_keys($d));
                $placeholders = implode(', ', array_fill(0, count($d), '?'));
                $stmt = $pdo->prepare("INSERT INTO guides ($keys) VALUES ($placeholders)");
                $stmt->execute(array_values($d));
                json_resp('success', ['id' => (int)$pdo->lastInsertId()]);
            }

        } elseif ($action === 'delete_guide') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) json_resp('error', null, 'id required');
            $pdo->prepare("DELETE FROM guides WHERE id = ?")->execute([$id]);
            json_resp('success');

        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
