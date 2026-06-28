<?php
// backend/api/newsletter.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

// Auto-migrate: add source column if missing
try { $pdo->query("SELECT source FROM newsletter_subscribers LIMIT 1"); }
catch (PDOException $_) { $pdo->exec("ALTER TABLE newsletter_subscribers ADD COLUMN source VARCHAR(100) DEFAULT 'website'"); }

try {
    if ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        if ($action === 'subscribe') {
            $email = trim($input['email'] ?? '');
            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                json_resp('error', null, 'Valid email address is required');
            }
            try {
                $stmt = $pdo->prepare(
                    "INSERT INTO newsletter_subscribers (email, status) VALUES (?, 'active')"
                );
                $stmt->execute([$email]);
                json_resp('success', null, 'Subscribed successfully');
            } catch (PDOException $e) {
                // MySQL error 1062 = duplicate entry
                if ($e->getCode() == 23000 || strpos($e->getMessage(), '1062') !== false) {
                    json_resp('error', null, 'Already subscribed with this email');
                }
                throw $e;
            }
        } elseif ($action === 'unsubscribe') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) {
                json_resp('error', null, 'id is required');
            }
            $stmt = $pdo->prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed' WHERE id = ?");
            $stmt->execute([$id]);
            json_resp('success', null, 'Unsubscribed');
        } elseif ($action === 'delete_subscriber') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) {
                json_resp('error', null, 'id is required');
            }
            $stmt = $pdo->prepare("DELETE FROM newsletter_subscribers WHERE id = ?");
            $stmt->execute([$id]);
            json_resp('success', null, 'Deleted');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } elseif ($method === 'GET') {
        $action = $_GET['action'] ?? 'list';
        if ($action === 'list') {
            $status_filter = $_GET['status'] ?? null;
            if ($status_filter) {
                $stmt = $pdo->prepare("SELECT id, email, source, subscribed_at, status FROM newsletter_subscribers WHERE status = ? ORDER BY subscribed_at DESC");
                $stmt->execute([$status_filter]);
            } else {
                $stmt = $pdo->query("SELECT id, email, source, subscribed_at, status FROM newsletter_subscribers ORDER BY subscribed_at DESC");
            }
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_resp('success', $rows);
        } elseif ($action === 'export_csv' || $action === 'export_excel') {
            $sub_headers = ['ID', 'Email', 'Source', 'Subscribed At', 'Status'];
            $stmt = $pdo->query("SELECT id, email, source, subscribed_at, status FROM newsletter_subscribers ORDER BY subscribed_at DESC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($action === 'export_excel') {
                header('Content-Type: application/vnd.ms-excel; charset=utf-8');
                header('Content-Disposition: attachment; filename="subscribers_' . date('Y-m-d') . '.xls"');
                echo "\xEF\xBB\xBF";
                echo "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>";
                echo "<head><meta charset='UTF-8'></head><body><table border='1'>";
                echo "<tr>";
                foreach ($sub_headers as $h) echo "<th>" . htmlspecialchars($h) . "</th>";
                echo "</tr>";
                foreach ($rows as $row) {
                    echo "<tr>";
                    foreach ([$row['id'], $row['email'], $row['source'] ?? '', $row['subscribed_at'], $row['status']] as $cell)
                        echo "<td>" . htmlspecialchars((string)$cell) . "</td>";
                    echo "</tr>";
                }
                echo "</table></body></html>";
                exit;
            } else {
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename="subscribers_' . date('Y-m-d') . '.csv"');
                $output = fopen('php://output', 'w');
                fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
                fputcsv($output, $sub_headers);
                foreach ($rows as $row) {
                    fputcsv($output, [$row['id'], $row['email'], $row['source'] ?? '', $row['subscribed_at'], $row['status']]);
                }
                fclose($output);
                exit;
            }
        } elseif ($action === 'sample_csv') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="subscribers_sample.csv"');
            $output = fopen('php://output', 'w');
            fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($output, ['ID', 'Email', 'Source', 'Subscribed At', 'Status']);
            fputcsv($output, ['', 'jane@example.com', 'website', '2026-01-15 10:30:00', 'active']);
            fputcsv($output, ['', 'john@example.com', 'blog',    '2026-02-20 14:00:00', 'active']);
            fclose($output);
            exit;
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
