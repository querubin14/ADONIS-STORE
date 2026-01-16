<?php
// Config
$supabaseUrl = 'https://cwlaqfjqgrtyhyscwpnq.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bGFxZmpxZ3J0eWh5c2N3cG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMDM3NTcsImV4cCI6MjA4MTY3OTc1N30.qt20ysweHhOMO81o6snFuBf3z5QDL-M1E0jN-ifQC4I';

// Default Metadata
$title = "SAVAGE STORE | Camisetas de Fútbol Premium";
$description = "Las mejores camisetas de fútbol en Paraguay: Retro, internacionales y ediciones especiales.";
$image = "https://www.savageeepy.com/crown.png";

$slug = $_GET['slug'] ?? '';
$debug = '';

if ($slug) {
    // Helper function to fetch via cURL
    function fetchProduct($url, $apiKey)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "apikey: $apiKey",
            "Authorization: Bearer $apiKey"
        ]);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Fix for some hosting environments
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }

    // 1. Try fetching by Slug
    $url = "$supabaseUrl/rest/v1/products?slug=eq." . urlencode($slug) . "&select=name,description,images";
    $data = fetchProduct($url, $supabaseKey);

    $found = false;
    $product = null;

    if (!empty($data) && isset($data[0])) {
        $product = $data[0];
        $found = true;
    } else {
        // 2. Fallback: Try fetching by ID
        $url = "$supabaseUrl/rest/v1/products?id=eq." . urlencode($slug) . "&select=name,description,images";
        $data = fetchProduct($url, $supabaseKey);

        if (!empty($data) && isset($data[0])) {
            $product = $data[0];
            $found = true;
        }
    }

    // 3. Update variables if product found
    if ($found && $product) {
        $title = $product['name'] . " | Savage Store";
        if (!empty($product['description'])) {
            $cleanDesc = trim(preg_replace('/\s+/', ' ', strip_tags($product['description'])));
            $description = mb_substr($cleanDesc, 0, 150, 'UTF-8') . '...';
        }
        if (!empty($product['images'])) {
            // Handle both string array (Postgres text[]) or JSON array
            if (is_array($product['images'])) {
                $image = $product['images'][0];
            } elseif (is_string($product['images'])) {
                // If it comes as string representation of array
                $imgs = json_decode($product['images']);
                if ($imgs && count($imgs) > 0)
                    $image = $imgs[0];
                else
                    $image = str_replace(['{', '}', '"'], '', explode(',', $product['images'])[0]);
            }
        }
    } else {
        $debug = " <!-- Product not found for slug: " . htmlspecialchars($slug) . " -->";
    }
} else {
    $debug = " <!-- No slug provided -->";
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta property="og:type" content="product">
    <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($image); ?>">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="800">
    <meta property="og:site_name" content="Savage Store">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($image); ?>">
    <?php echo $debug; ?>
</head>

<body>
    <h1><?php echo htmlspecialchars($title); ?></h1>
    <img src="<?php echo htmlspecialchars($image); ?>" style="max-width:100%;">
    <p><?php echo htmlspecialchars($description); ?></p>
</body>

</html>