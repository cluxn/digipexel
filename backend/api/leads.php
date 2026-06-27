<?php
// backend/api/leads.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = $_GET['action'] ?? 'list';
        if ($action === 'export_csv') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="leads_' . date('Y-m-d') . '.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID','Name','Email','Company','Role','Phone','Source','Service','Status','Follow-up Date','Notes','Message','Created At']);
            $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($out, [
                    $row['id'], $row['full_name'], $row['email'], $row['company'],
                    $row['role'] ?? '', $row['contact_number'], $row['source'] ?? '',
                    $row['service'], $row['status'], $row['follow_up_date'] ?? '',
                    $row['notes'] ?? '', $row['message'], $row['created_at'],
                ]);
            }
            fclose($out);
            exit;
        }
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
        json_resp('success', $stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'add_lead') {
            $full_name = trim($input['full_name'] ?? '');
            $email     = trim($input['email']     ?? '');
            if (empty($full_name)) {
                json_resp('error', null, 'full_name is required');
            }
            if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                json_resp('error', null, 'Invalid email address');
            }
            $stmt = $pdo->prepare("INSERT INTO leads (full_name, email, company, role, contact_number, source, service, message, notes, follow_up_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $full_name,
                $email,
                $input['company'] ?? '',
                $input['role'] ?? '',
                $input['contact_number'] ?? '',
                $input['source'] ?? '',
                $input['service'] ?? '',
                $input['message'] ?? '',
                $input['notes'] ?? '',
                !empty($input['follow_up_date']) ? $input['follow_up_date'] : null,
            ]);
            json_resp('success', null, 'Lead captured');
        }
        elseif ($action === 'update_status') {
            $stmt = $pdo->prepare("UPDATE leads SET status = ? WHERE id = ?");
            $stmt->execute([$input['status'], $input['id']]);
            json_resp('success', null, 'Status updated');
        }
        elseif ($action === 'update_follow_up') {
            $stmt = $pdo->prepare("UPDATE leads SET follow_up_date = ? WHERE id = ?");
            $stmt->execute([!empty($input['follow_up_date']) ? $input['follow_up_date'] : null, $input['id']]);
            json_resp('success', null, 'Follow-up date updated');
        }
        elseif ($action === 'update_notes') {
            $stmt = $pdo->prepare("UPDATE leads SET notes = ? WHERE id = ?");
            $stmt->execute([$input['notes'] ?? '', $input['id']]);
            json_resp('success', null, 'Notes updated');
        }
        elseif ($action === 'delete_lead') {
            $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
            $stmt->execute([$input['id']]);
            json_resp('success', null, 'Lead deleted');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
