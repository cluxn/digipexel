<?php
// backend/api/users.php
require_once '../common.php';

send_json_headers();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT id, name, designation, login_id, created_at FROM users ORDER BY created_at DESC");
        json_resp('success', $stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($method === 'POST') {
        $input = get_input();
        $action = $input['action'] ?? '';

        if ($action === 'save_user') {
            $id = (int)($input['id'] ?? 0);
            $name = trim($input['name'] ?? '');
            $designation = trim($input['designation'] ?? '');
            $login_id = trim($input['login_id'] ?? '');
            $password = $input['password'] ?? '';

            if (!$name) {
                json_resp('error', null, 'name is required');
            }
            if (!$login_id) {
                json_resp('error', null, 'login_id is required');
            }

            try {
                if ($id) {
                    if ($password) {
                        $stmt = $pdo->prepare("UPDATE users SET name=?, designation=?, login_id=?, password_hash=? WHERE id=?");
                        $stmt->execute([$name, $designation, $login_id, password_hash($password, PASSWORD_DEFAULT), $id]);
                    } else {
                        $stmt = $pdo->prepare("UPDATE users SET name=?, designation=?, login_id=? WHERE id=?");
                        $stmt->execute([$name, $designation, $login_id, $id]);
                    }
                } else {
                    $hash = password_hash($password ?: 'changeme', PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("INSERT INTO users (name, designation, login_id, password_hash) VALUES (?,?,?,?)");
                    $stmt->execute([$name, $designation, $login_id, $hash]);
                }
                json_resp('success', null, 'User saved');
            } catch (PDOException $e) {
                if ($e->getCode() == 23000 || strpos($e->getMessage(), '1062') !== false) {
                    json_resp('error', null, 'Login ID already taken');
                }
                throw $e;
            }
        } elseif ($action === 'delete_user') {
            $id = (int)($input['id'] ?? 0);
            if (!$id) {
                json_resp('error', null, 'id is required');
            }
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            json_resp('success', null, 'User deleted');
        } else {
            json_resp('error', null, 'Unknown action');
        }
    } else {
        json_resp('error', null, 'Method not allowed');
    }
} catch (Exception $e) {
    json_resp('error', null, $e->getMessage());
}
