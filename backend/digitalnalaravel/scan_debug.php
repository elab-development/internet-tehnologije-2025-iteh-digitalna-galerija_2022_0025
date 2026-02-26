<?php

require __DIR__ . '/vendor/autoload.php';

// Quick debug script: lists PHP files under app/Swagger and checks for @OA\\ annotations
$dirs = [__DIR__ . '/app/Swagger', __DIR__ . '/app/Http/Controllers'];

foreach ($dirs as $d) {
    echo "Directory: $d\n";
    if (!is_dir($d)) {
        echo "  (not found)\n";
        continue;
    }
    $files = glob($d . '/*.php');
    if (!$files) {
        echo "  (no php files)\n";
        continue;
    }
    foreach ($files as $f) {
        echo "  - $f\n";
        $c = file_get_contents($f);
        if ($c === false) {
            echo "      (cannot read)\n";
            continue;
        }
        $has = strpos($c, '@OA\\') !== false || strpos($c, '@OA/') !== false;
        echo $has ? "      contains @OA annotations\n" : "      no @OA annotations found\n";
    }
}

// run real swagger-php scan
$paths = [__DIR__ . '/app/Swagger'];
$analysis = \OpenApi\scan($paths);
echo "\n*** swagger-php analysis summary ***\n";
echo "Scanned paths: " . implode(',', $paths) . "\n";
echo "Found path keys: "; print_r(array_keys($analysis->paths));
echo "Total annotations: " . count($analysis->annotations) . "\n";

// dump config settings
echo "Config annotations paths: "; print_r(config('l5-swagger.paths.annotations'));
echo "Config scanOptions.exclude: "; print_r(config('l5-swagger.defaults.scanOptions.exclude'));

