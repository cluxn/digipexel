<?php
// backend/api/categories.php — manage predefined category names
require_once '../common.php';

send_json_headers();

// Auto-create table if missing (safe to run every request)
$pdo->exec("CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    content_type VARCHAR(50) DEFAULT 'all',
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $rows = $pdo->query("SELECT * FROM categories ORDER BY position ASC, name ASC")->fetchAll(PDO::FETCH_ASSOC);
        json_resp('success', $rows);
    }
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'add_category') {
            $name = trim($input['name'] ?? '');
            $type = $input['content_type'] ?? 'all';
            if (!$name) json_resp('error', null, 'Name required');
            $stmt = $pdo->prepare("INSERT INTO categories (name, content_type) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_type=VALUES(content_type)");
            $stmt->execute([$name, $type]);
            json_resp('success', ['id' => $pdo->lastInsertId()], 'Category added');
        }
        elseif ($action === 'delete_category') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) json_resp('error', null, 'Missing id');
            $pdo->prepare("DELETE FROM categories WHERE id=?")->execute([$id]);
            json_resp('success', null, 'Category deleted');
        }
        elseif ($action === 'rename_category') {
            $id   = (int)($input['id'] ?? 0);
            $name = trim($input['name'] ?? '');
            if (!$id || !$name) json_resp('error', null, 'Missing id or name');
            $old = $pdo->prepare("SELECT name FROM categories WHERE id=?");
            $old->execute([$id]);
            $oldName = $old->fetchColumn();
            $pdo->prepare("UPDATE categories SET name=? WHERE id=?")->execute([$name, $id]);
            // Update all posts/guides/case_studies referencing the old name
            if ($oldName) {
                $pdo->prepare("UPDATE blogs SET category=? WHERE category=?")->execute([$name, $oldName]);
                $pdo->prepare("UPDATE guides SET category=? WHERE category=?")->execute([$name, $oldName]);
                $pdo->prepare("UPDATE case_studies SET industry=? WHERE industry=?")->execute([$name, $oldName]);
            }
            json_resp('success', null, 'Category renamed');
        }
        else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
