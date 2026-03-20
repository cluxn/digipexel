<?php
// backend/api/case_studies.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// ── Auto-migrate new columns if missing ──────────────────────────────────────
$new_columns = [
    "eyebrow VARCHAR(100) DEFAULT 'Case Study'",
    "client_logo VARCHAR(500) DEFAULT ''",
    "client_image VARCHAR(500) DEFAULT ''",
    "service_tags TEXT",
    "published_date VARCHAR(50) DEFAULT ''",
    "read_time VARCHAR(50) DEFAULT '8 min read'",
    "hero_bg VARCHAR(500) DEFAULT ''",
    "sections LONGTEXT",
    "show_related TINYINT(1) DEFAULT 1",
    "show_industry_section TINYINT(1) DEFAULT 0",
    "industry_section_title VARCHAR(255) DEFAULT ''",
    "status VARCHAR(20) DEFAULT 'published'",
    "featured TINYINT(1) DEFAULT 0",
    "hero_cta_label VARCHAR(100) DEFAULT 'View Case Study'",
    "hero_cta_url VARCHAR(500) DEFAULT '#contact'",
    "hero_stats LONGTEXT",
];
foreach ($new_columns as $col_def) {
    try { $pdo->exec("ALTER TABLE case_studies ADD COLUMN $col_def"); } catch (Exception $e) { /* exists */ }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseCase(array $row): array {
    $row['service_tags']           = json_decode($row['service_tags']  ?? '[]', true) ?: [];
    $row['sections']               = json_decode($row['sections']      ?? '[]', true) ?: [];
    $row['hero_stats']             = json_decode($row['hero_stats']    ?? '[]', true) ?: [];
    $row['show_related']           = (bool)($row['show_related']          ?? 1);
    $row['show_industry_section']  = (bool)($row['show_industry_section'] ?? 0);
    $row['featured']               = (bool)($row['featured']              ?? 0);
    return $row;
}

// ── Router ───────────────────────────────────────────────────────────────────
try {
    if ($method === 'GET') {
        $slug  = $_GET['slug']  ?? null;
        $admin = isset($_GET['admin']) && $_GET['admin'] === '1';

        if ($slug) {
            $sql  = $admin
                ? "SELECT * FROM case_studies WHERE slug = ?"
                : "SELECT * FROM case_studies WHERE slug = ? AND status = 'published'";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$slug]);
            $row  = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) json_resp('error', null, 'Not found');
            json_resp('success', parseCase($row));

        } else {
            $sql  = $admin
                ? "SELECT * FROM case_studies ORDER BY position ASC, created_at DESC"
                : "SELECT id, title, slug, eyebrow, subtitle, client_name, client_image, client_logo, industry, service_tags, published_date, read_time, image_url, featured, status, position FROM case_studies WHERE status = 'published' ORDER BY position ASC";
            $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            $out  = [];
            foreach ($rows as $row) {
                $row['service_tags'] = json_decode($row['service_tags'] ?? '[]', true) ?: [];
                if ($admin) $row['sections'] = json_decode($row['sections'] ?? '[]', true) ?: [];
                $out[] = $row;
            }
            json_resp('success', $out);
        }

    } elseif ($method === 'POST') {
        $input  = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_case') {
            $c    = $input['case'];
            $id   = $c['id'] ?? null;
            $slug = !empty($c['slug']) ? $c['slug'] : slugify($c['title'] ?? 'untitled');

            $d = [
                'title'                  => $c['title']                  ?? '',
                'slug'                   => $slug,
                'eyebrow'                => $c['eyebrow']                ?? 'Case Study',
                'subtitle'               => $c['subtitle']               ?? '',
                'description'            => $c['description']            ?? '',
                'client_name'            => $c['client_name']            ?? '',
                'client_logo'            => $c['client_logo']            ?? '',
                'client_image'           => $c['client_image']           ?? '',
                'industry'               => $c['industry']               ?? '',
                'service_tags'           => json_encode($c['service_tags'] ?? []),
                'published_date'         => $c['published_date']         ?? date('Y-m-d'),
                'read_time'              => $c['read_time']              ?? '8 min read',
                'hero_bg'                => $c['hero_bg']                ?? '',
                'image_url'              => $c['image_url']              ?? '',
                'challenge'              => $c['challenge']              ?? '',
                'solution'               => $c['solution']               ?? '',
                'results'                => $c['results']                ?? '',
                'sections'               => json_encode($c['sections']    ?? []),
                'show_related'           => ($c['show_related']           ?? true)  ? 1 : 0,
                'show_industry_section'  => ($c['show_industry_section']  ?? false) ? 1 : 0,
                'industry_section_title' => $c['industry_section_title']  ?? '',
                'status'                 => $c['status']                  ?? 'draft',
                'featured'               => ($c['featured']               ?? false) ? 1 : 0,
                'position'               => (int)($c['position']          ?? 0),
                'hero_cta_label'         => $c['hero_cta_label']          ?? 'View Case Study',
                'hero_cta_url'           => $c['hero_cta_url']            ?? '#contact',
                'hero_stats'             => json_encode($c['hero_stats']  ?? []),
            ];

            if ($id) {
                $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($d)));
                $stmt = $pdo->prepare("UPDATE case_studies SET $sets WHERE id = ?");
                $stmt->execute([...array_values($d), $id]);
                json_resp('success', ['id' => (int)$id], 'Updated');
            } else {
                $keys  = implode(', ', array_keys($d));
                $ph    = implode(', ', array_fill(0, count($d), '?'));
                $stmt  = $pdo->prepare("INSERT INTO case_studies ($keys) VALUES ($ph)");
                $stmt->execute(array_values($d));
                json_resp('success', ['id' => (int)$pdo->lastInsertId()], 'Created');
            }

        } elseif ($action === 'delete_case') {
            $stmt = $pdo->prepare("DELETE FROM case_studies WHERE id = ?");
            $stmt->execute([$input['id']]);
            json_resp('success', null, 'Deleted');

        } elseif ($action === 'reorder') {
            $stmt = $pdo->prepare("UPDATE case_studies SET position = ? WHERE id = ?");
            foreach ($input['items'] as $item) { $stmt->execute([$item['position'], $item['id']]); }
            json_resp('success');

        } elseif ($action === 'update_cases') {
            $pdo->exec("DELETE FROM case_studies");
            $stmt = $pdo->prepare("INSERT INTO case_studies (title, slug, subtitle, description, client_name, industry, challenge, solution, results, image_url, position) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            foreach ($input['cases'] as $i => $c) {
                $stmt->execute([$c['title'], $c['slug'] ?? slugify($c['title']), $c['subtitle'] ?? '', $c['description'] ?? '', $c['client_name'] ?? '', $c['industry'] ?? '', $c['challenge'] ?? '', $c['solution'] ?? '', $c['results'] ?? '', $c['image_url'] ?? '', $i]);
            }
            json_resp('success');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
