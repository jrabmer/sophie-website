<?php
// Copy this file to config.php (next to contact.php) and fill in the values.
// config.php is in .gitignore, so it never ends up on GitHub.

return [
    // Where messages from the form are delivered
    'recipient' => 'hallo@sophiemariarabmer.com',

    // Sender address of the notification emails. Use an address on a domain your
    // server is allowed to send for (SPF), otherwise mails land in spam.
    // Replies go straight to the visitor (Reply-To), not to this address.
    'from' => 'kontaktformular@sophiemariarabmer.com',

    // Websites allowed to send to this script (CORS)
    'allowed_origins' => [
        'https://sophiemariarabmer.com',
        'https://www.sophiemariarabmer.com',
    ],

    // Where visitors without JavaScript are sent after submitting
    'redirect_ok' => 'https://sophiemariarabmer.com/?gesendet=1#kontakt',
    'redirect_error' => 'https://sophiemariarabmer.com/?fehler=1#kontakt',

    // Spam protection: at most this many messages per IP address per hour
    'rate_limit_per_hour' => 5,
];
