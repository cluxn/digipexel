<?php
// backend/api/blogs.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// ── Auto-migrate new columns ──────────────────────────────────────────────────
$new_columns = [
    "eyebrow VARCHAR(100) DEFAULT 'Article'",
    "subtitle TEXT",
    "author_name VARCHAR(255) DEFAULT 'Digi Pexel Team'",
    "author_image VARCHAR(500) DEFAULT ''",
    "author_role VARCHAR(255) DEFAULT ''",
    "read_time VARCHAR(50) DEFAULT '5 min read'",
    "sections LONGTEXT",
    "show_related TINYINT(1) DEFAULT 1",
    "show_category_section TINYINT(1) DEFAULT 0",
    "status VARCHAR(20) DEFAULT 'published'",
    "featured TINYINT(1) DEFAULT 0",
];
foreach ($new_columns as $col_def) {
    try { $pdo->exec("ALTER TABLE blogs ADD COLUMN $col_def"); } catch (Exception $e) { /* exists */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseBlog(array $row): array {
    $row['sections']             = json_decode($row['sections']  ?? '[]', true) ?: [];
    $row['tags_array']           = array_filter(array_map('trim', explode(',', $row['tags'] ?? '')));
    $row['show_related']         = (bool)($row['show_related']         ?? 1);
    $row['show_category_section']= (bool)($row['show_category_section']?? 0);
    $row['featured']             = (bool)($row['featured']             ?? 0);
    return $row;
}

// ── Router ────────────────────────────────────────────────────────────────────
try {
    if ($method === 'GET') {
        $slug  = $_GET['slug']  ?? null;
        $admin = isset($_GET['admin']) && $_GET['admin'] === '1';

        if ($slug) {
            $sql  = $admin
                ? "SELECT * FROM blogs WHERE slug = ?"
                : "SELECT * FROM blogs WHERE slug = ? AND status = 'published'";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$slug]);
            $row  = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_resp('error', null, 'Not found');
            json_resp('success', parseBlog($row));

        } else {
            $sql  = $admin
                ? "SELECT * FROM blogs ORDER BY position ASC, published_at DESC"
                : "SELECT id, title, slug, eyebrow, excerpt, image_url, category, tags, author_name, author_image, author_role, read_time, published_at, featured, status, position FROM blogs WHERE status = 'published' ORDER BY position ASC";
            $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            $out  = [];
            foreach ($rows as $row) {
                $row['tags_array'] = array_filter(array_map('trim', explode(',', $row['tags'] ?? '')));
                if ($admin) $row['sections'] = json_decode($row['sections'] ?? '[]', true) ?: [];
                $out[] = $row;
            }
            json_resp('success', $out);
        }

    } elseif ($method === 'POST') {
        $input  = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_post') {
            $b    = $input['post'];
            $id   = $b['id'] ?? null;
            $slug = !empty($b['slug']) ? $b['slug'] : slugify($b['title'] ?? 'untitled');

            $d = [
                'title'                 => $b['title']                  ?? '',
                'slug'                  => $slug,
                'eyebrow'               => $b['eyebrow']                ?? 'Article',
                'subtitle'              => $b['subtitle']               ?? '',
                'excerpt'               => $b['excerpt']                ?? '',
                'content'               => $b['content']                ?? '',
                'image_url'             => $b['image_url']              ?? '',
                'category'              => $b['category']               ?? 'General',
                'tags'                  => $b['tags']                   ?? '',
                'author_name'           => $b['author_name']            ?? 'Digi Pexel Team',
                'author_image'          => $b['author_image']           ?? '',
                'author_role'           => $b['author_role']            ?? '',
                'read_time'             => $b['read_time']              ?? '5 min read',
                'sections'              => json_encode($b['sections']   ?? []),
                'show_related'          => ($b['show_related']          ?? true)  ? 1 : 0,
                'show_category_section' => ($b['show_category_section'] ?? false) ? 1 : 0,
                'status'                => $b['status']                 ?? 'draft',
                'featured'              => ($b['featured']              ?? false) ? 1 : 0,
                'published_at'          => $b['published_at']           ?? date('Y-m-d'),
                'position'              => (int)($b['position']         ?? 0),
            ];

            if ($id) {
                $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($d)));
                $stmt = $pdo->prepare("UPDATE blogs SET $sets WHERE id = ?");
                $stmt->execute([...array_values($d), $id]);
                json_resp('success', ['id' => (int)$id], 'Updated');
            } else {
                $keys = implode(', ', array_keys($d));
                $ph   = implode(', ', array_fill(0, count($d), '?'));
                $stmt = $pdo->prepare("INSERT INTO blogs ($keys) VALUES ($ph)");
                $stmt->execute(array_values($d));
                json_resp('success', ['id' => (int)$pdo->lastInsertId()], 'Created');
            }

        } elseif ($action === 'delete_post') {
            $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
            $stmt->execute([$input['id']]);
            json_resp('success', null, 'Deleted');

        } elseif ($action === 'update_blogs') {
            $pdo->exec("DELETE FROM blogs");
            $stmt = $pdo->prepare("INSERT INTO blogs (title, slug, excerpt, content, image_url, category, tags, position, published_at) VALUES (?,?,?,?,?,?,?,?,?)");
            foreach ($input['blogs'] as $i => $b) {
                $stmt->execute([$b['title'], slugify($b['title']), $b['excerpt'] ?? '', $b['content'] ?? '', $b['image_url'] ?? '', $b['category'] ?? 'General', $b['tags'] ?? '', $i, $b['published_at'] ?? date('Y-m-d')]);
            }
            json_resp('success');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
