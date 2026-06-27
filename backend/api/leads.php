<?php
// backend/api/leads.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = $_GET['action'] ?? 'list';

        $headers = ['ID','Name','Email','Company','Role','Phone','Source','Service','Status','Follow-up Date','Notes','Message','Created At'];

        if ($action === 'export_csv' || $action === 'export_excel') {
            $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($action === 'export_excel') {
                // Export as Excel-compatible XML (opens natively in Excel/Sheets)
                $filename = 'leads_' . date('Y-m-d') . '.xls';
                header('Content-Type: application/vnd.ms-excel; charset=utf-8');
                header('Content-Disposition: attachment; filename="' . $filename . '"');
                echo "\xEF\xBB\xBF"; // UTF-8 BOM
                echo "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>";
                echo "<head><meta charset='UTF-8'></head><body><table border='1'>";
                echo "<tr>";
                foreach ($headers as $h) echo "<th>" . htmlspecialchars($h) . "</th>";
                echo "</tr>";
                foreach ($rows as $row) {
                    echo "<tr>";
                    $cells = [
                        $row['id'], $row['full_name'], $row['email'], $row['company'],
                        $row['role'] ?? '', $row['contact_number'], $row['source'] ?? '',
                        $row['service'], $row['status'], $row['follow_up_date'] ?? '',
                        $row['notes'] ?? '', $row['message'], $row['created_at'],
                    ];
                    foreach ($cells as $cell) echo "<td>" . htmlspecialchars((string)$cell) . "</td>";
                    echo "</tr>";
                }
                echo "</table></body></html>";
                exit;
            } else {
                // CSV
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename="leads_' . date('Y-m-d') . '.csv"');
                $out = fopen('php://output', 'w');
                fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM for Excel
                fputcsv($out, $headers);
                foreach ($rows as $row) {
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
        }

        if ($action === 'sample_csv') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="leads_sample.csv"');
            $out = fopen('php://output', 'w');
            fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($out, $headers);
            fputcsv($out, ['', 'Jane Smith', 'jane@example.com', 'Acme Corp', 'CEO', '+1 555 0100', 'website', 'AI Automation', 'new', '', '', 'Interested in AI workflows', '']);
            fputcsv($out, ['', 'John Doe',  'john@example.com', 'TechCo',   'CTO', '+1 555 0101', 'referral', 'SEO Services', 'contacted', '2026-07-15', 'Follow up after demo', 'Needs pricing info', '']);
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
