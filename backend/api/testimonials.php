<?php
// backend/api/testimonials.php
require_once '../common.php';
send_json_headers();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $with_focus = isset($_GET['with_focus']) && $_GET['with_focus'] === '1';

        $stmt = $pdo->query("SELECT id, name, role, company, content, image_url, category, star_rating, video_url, logo_url, display_context, position FROM testimonials ORDER BY position ASC");
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Cast star_rating to int
        foreach ($testimonials as &$t) {
            $t['star_rating'] = (int)($t['star_rating'] ?? 5);
        }
        unset($t);

        if ($with_focus) {
            $stmtFocus = $pdo->query("SELECT * FROM testimonials_focus ORDER BY position ASC");
            $focus = $stmtFocus->fetchAll(PDO::FETCH_ASSOC);
            json_resp('success', ['items' => $testimonials, 'focus' => $focus]);
        } else {
            json_resp('success', $testimonials);
        }
    }
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_testimonial') {
            // Individual save (insert or update by id)
            $t = $input['testimonial'] ?? [];
            $id = isset($t['id']) && $t['id'] ? (int)$t['id'] : null;

            if ($id) {
                $stmt = $pdo->prepare("UPDATE testimonials SET name=?, role=?, company=?, content=?, image_url=?, category=?, star_rating=?, video_url=?, logo_url=?, display_context=?, position=? WHERE id=?");
                $stmt->execute([
                    $t['name'], $t['role'] ?? '', $t['company'] ?? '', $t['content'] ?? '',
                    $t['image_url'] ?? '', $t['category'] ?? 'General',
                    (int)($t['star_rating'] ?? 5), $t['video_url'] ?? '', $t['logo_url'] ?? '',
                    $t['display_context'] ?? 'homepage,testimonials-page',
                    (int)($t['position'] ?? 0), $id
                ]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO testimonials (name, role, company, content, image_url, category, star_rating, video_url, logo_url, display_context, position) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
                $stmt->execute([
                    $t['name'], $t['role'] ?? '', $t['company'] ?? '', $t['content'] ?? '',
                    $t['image_url'] ?? '', $t['category'] ?? 'General',
                    (int)($t['star_rating'] ?? 5), $t['video_url'] ?? '', $t['logo_url'] ?? '',
                    $t['display_context'] ?? 'homepage,testimonials-page',
                    (int)($t['position'] ?? 0)
                ]);
            }
            $newId = $id ?? (int)$pdo->lastInsertId();
            json_resp('success', ['id' => $newId], 'Testimonial saved');
        }
        elseif ($action === 'delete_testimonial') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) json_resp('error', null, 'Missing id');
            $pdo->prepare("DELETE FROM testimonials WHERE id=?")->execute([$id]);
            json_resp('success', null, 'Testimonial deleted');
        }
        elseif ($action === 'update_testimonials') {
            // Bulk replace (kept for backward compat with existing admin page)
            $pdo->exec("DELETE FROM testimonials");
            $stmt = $pdo->prepare("INSERT INTO testimonials (name, role, company, content, image_url, category, star_rating, video_url, logo_url, display_context, position) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            foreach ($input['testimonials'] as $index => $t) {
                $stmt->execute([
                    $t['name'], $t['role'] ?? '', $t['company'] ?? '', $t['content'] ?? '',
                    $t['image_url'] ?? '', $t['category'] ?? 'General',
                    (int)($t['star_rating'] ?? 5), $t['video_url'] ?? '', $t['logo_url'] ?? '',
                    $t['display_context'] ?? 'homepage,testimonials-page',
                    $index
                ]);
            }
            json_resp('success', null, 'Testimonials updated');
        }
        elseif ($action === 'update_focus') {
            $pdo->exec("DELETE FROM testimonials_focus");
            $stmt = $pdo->prepare("INSERT INTO testimonials_focus (type, url, thumbnail_url, label, position) VALUES (?,?,?,?,?)");
            foreach ($input['focus'] as $index => $f) {
                $stmt->execute([$f['type'], $f['url'], $f['thumbnail_url'] ?? '', $f['label'] ?? '', $index]);
            }
            json_resp('success', null, 'Focus items updated');
        }
        else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
