<?php
// backend/api/authors.php
require_once '../common.php';

send_json_headers();

// Auto-create table
$pdo->exec("CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT '',
    bio TEXT DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Seed default author if empty
$count = $pdo->query("SELECT COUNT(*) FROM authors")->fetchColumn();
if ($count == 0) {
    $pdo->exec("INSERT INTO authors (name, role, bio) VALUES ('Digi Pexel Team', 'Content Team', 'The Digi Pexel editorial team.')");
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $rows = $pdo->query("SELECT * FROM authors ORDER BY created_at ASC")->fetchAll(PDO::FETCH_ASSOC);
        json_resp('success', $rows);

    } elseif ($method === 'POST') {
        $input  = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_author') {
            $id        = (int)($input['id'] ?? 0);
            $name      = trim($input['name'] ?? '');
            $role      = trim($input['role'] ?? '');
            $bio       = trim($input['bio'] ?? '');
            $image_url = trim($input['image_url'] ?? '');

            if (!$name) json_resp('error', null, 'name is required');

            if ($id) {
                $stmt = $pdo->prepare("UPDATE authors SET name=?, role=?, bio=?, image_url=? WHERE id=?");
                $stmt->execute([$name, $role, $bio, $image_url, $id]);
                json_resp('success', ['id' => $id], 'Author updated');
            } else {
                $stmt = $pdo->prepare("INSERT INTO authors (name, role, bio, image_url) VALUES (?,?,?,?)");
                $stmt->execute([$name, $role, $bio, $image_url]);
                json_resp('success', ['id' => (int)$pdo->lastInsertId()], 'Author created');
            }

        } elseif ($action === 'delete_author') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) json_resp('error', null, 'id is required');
            $pdo->prepare("DELETE FROM authors WHERE id=?")->execute([$id]);
            json_resp('success', null, 'Author deleted');

        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
