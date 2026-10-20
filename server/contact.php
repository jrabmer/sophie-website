<?php
// Contact form endpoint for sophiemariarabmer.com.
// The website itself is hosted on GitHub Pages; only this script runs on the own server.
// Setup: see "Contact form" in README.md.

declare(strict_types=1);

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    exit('config.php missing – copy config.example.php to config.php');
}
$config = require $configFile;

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

// CORS: only the website itself may send to this script
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Accept, Content-Type');
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond(bool $ok, int $status, string $error = ''): never
{
    global $wantsJson, $config;
    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    } else {
        // Without JavaScript: send the visitor back to the website
        header('Location: ' . ($ok ? $config['redirect_ok'] : $config['redirect_error']), true, 303);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 405, 'method');
}
if ($origin !== '' && !in_array($origin, $config['allowed_origins'], true)) {
    respond(false, 403, 'origin');
}

// Honeypot: the hidden field is only filled in by bots. Pretend it worked.
if (trim((string)($_POST['_gotcha'] ?? '')) !== '') {
    respond(true, 200);
}

// Strips line breaks so nobody can inject extra mail headers
$oneLine = fn(string $s): string => trim(preg_replace('/[\r\n\t]+/', ' ', $s));

$name = $oneLine((string)($_POST['name'] ?? ''));
$email = $oneLine((string)($_POST['email'] ?? ''));
$subject = $oneLine((string)($_POST['anliegen'] ?? 'Sonstiges'));
$message = trim(str_replace("\r\n", "\n", (string)($_POST['message'] ?? '')));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($name) > 300 || strlen($subject) > 200 || strlen($message) > 20000) {
    respond(false, 422, 'invalid');
}

// Rate limit per IP address (counter files in the system temp folder)
$dir = sys_get_temp_dir() . '/smr-contact';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
foreach (glob($dir . '/*.json') ?: [] as $old) {
    if (filemtime($old) < time() - 3600) {
        @unlink($old);
    }
}
$file = $dir . '/' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '') . '.json';
$now = time();
$hits = is_file($file) ? (json_decode((string)file_get_contents($file), true) ?: []) : [];
$hits = array_values(array_filter($hits, fn($t) => is_int($t) && $t > $now - 3600));
if (count($hits) >= $config['rate_limit_per_hour']) {
    respond(false, 429, 'rate_limit');
}
$hits[] = $now;
file_put_contents($file, json_encode($hits), LOCK_EX);

// Send the email
$encode = fn(string $s): string => '=?UTF-8?B?' . base64_encode($s) . '?=';
$body = "Neue Nachricht über sophiemariarabmer.com\n\n"
    . "Name:     $name\n"
    . "E-Mail:   $email\n"
    . "Anliegen: $subject\n\n"
    . "$message\n";
$headers = [
    'From' => $encode('Website Kontaktformular') . ' <' . $config['from'] . '>',
    'Reply-To' => $encode($name) . ' <' . $email . '>',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'MIME-Version' => '1.0',
];

$sent = mail(
    $config['recipient'],
    $encode("Kontaktformular: $subject – $name"),
    $body,
    $headers,
    '-f' . $config['from']
);

$sent ? respond(true, 200) : respond(false, 500, 'mail');
