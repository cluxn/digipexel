<?php
// backend/api/newsletter.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

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
                $stmt = $pdo->prepare("SELECT id, email, subscribed_at, status FROM newsletter_subscribers WHERE status = ? ORDER BY subscribed_at DESC");
                $stmt->execute([$status_filter]);
            } else {
                $stmt = $pdo->query("SELECT id, email, subscribed_at, status FROM newsletter_subscribers ORDER BY subscribed_at DESC");
            }
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_resp('success', $rows);
        } elseif ($action === 'export_csv') {
            // Output CSV directly — override JSON headers
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="newsletter_subscribers_' . date('Y-m-d') . '.csv"');
            $output = fopen('php://output', 'w');
            fputcsv($output, ['ID', 'Email', 'Subscribed At', 'Status']);
            $stmt = $pdo->query("SELECT id, email, subscribed_at, status FROM newsletter_subscribers ORDER BY subscribed_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, $row);
            }
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
