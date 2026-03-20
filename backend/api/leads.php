<?php
// backend/api/leads.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
        json_resp('success', $stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';
        
        if ($action === 'add_lead') {
            $stmt = $pdo->prepare("INSERT INTO leads (full_name, email, company, contact_number, service, message) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['full_name'],
                $input['email'],
                $input['company'] ?? '',
                $input['contact_number'] ?? '',
                $input['service'] ?? '',
                $input['message'] ?? ''
            ]);
            json_resp('success', null, 'Lead captured');
        }
        elseif ($action === 'update_status') {
            $stmt = $pdo->prepare("UPDATE leads SET status = ? WHERE id = ?");
            $stmt->execute([$input['status'], $input['id']]);
            json_resp('success', null, 'Status updated');
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
