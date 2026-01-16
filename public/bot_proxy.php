<?php
// Config - Using Anon Key is safe for public product data
$supabaseUrl = 'https://cwlaqfjqgrtyhyscwpnq.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bGFxZmpxZ3J0eWh5c2N3cG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMDM3NTcsImV4cCI6MjA4MTY3OTc1N30.qt20ysweHhOMO81o6snFuBf3z5QDL-M1E0jN-ifQC4I';

// Default Metadata
$title = "SAVAGE STORE | Camisetas de Fútbol Premium & Streetwear en Paraguay";
$description = "Las mejores camisetas de fútbol en Paraguay: Retro, internacionales y ediciones especiales. Calidad premium en SAVAGE.";
$image = "https://www.savageeepy.com/crown.png";

$slug = $_GET['slug'] ?? '';
$found = false;

if ($slug) {
    // 1. Try fetching by Slug
    $url = "$supabaseUrl/rest/v1/products?slug=eq.$slug&select=name,description,images";
    
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "apikey: $supabaseKey\r\n" .
                        "Authorization: Bearer $supabaseKey\r\n"
        ]
    ];
    
    $context = stream_context_create($opts);
    // Suppress errors with @
    $response = @file_get_contents($url, false, $context);
    
    if ($response) {
        $data = json_decode($response, true);
        if (!empty($data) && isset($data[0])) {
            $product = $data[0];
            $found = true;
        }
    }

    // 2. Fallback: Try fetching by ID (if slug fetch failed or returned empty)
    if (!$found) {
        $url = "$supabaseUrl/rest/v1/products?id=eq.$slug&select=name,description,images";
        $response = @file_get_contents($url, false, $context);
        if ($response) {
            $data = json_decode($response, true);
            if (!empty($data) && isset($data[0])) {
                $product = $data[0];
                $found = true;
            }
        }
    }

    // 3. Update variables if product found
    if ($found) {
        $title = $product['name'] . " - Savage Store Paraguay";
        if (!empty($product['description'])) {
            // Remove markdown or newlines if any, keep it short
            $cleanDesc = trim(preg_replace('/\s+/', ' ', $product['description']));
            $description = substr($cleanDesc, 0, 160) . (strlen($cleanDesc) > 160 ? '...' : '');
        }
        if (!empty($product['images']) && is_array($product['images']) && count($product['images']) > 0) {
            $image = $product['images'][0];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($title); ?></title>
    
    <meta name="description" content="<?php echo htmlspecialchars($description); ?>">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($image); ?>">
    <meta property="og:site_name" content="Savage Store">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($image); ?>">
</head>
<body>
    <!-- Fallback content for bots that might render HTML -->
    <h1><?php echo htmlspecialchars($title); ?></h1>
    <img src="<?php echo htmlspecialchars($image); ?>" alt="<?php echo htmlspecialchars($title); ?>" style="max-width: 500px;">
    <p><?php echo htmlspecialchars($description); ?></p>
</body>
</html>
