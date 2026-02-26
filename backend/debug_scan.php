<?php
require __DIR__ . '/vendor/autoload.php';
$paths = [__DIR__ . '/app/Swagger'];
$analysis = \OpenApi\scan($paths);
echo "Scanned paths: " . implode(',', $paths) . "\n";
echo "Found paths keys:\n";
print_r(array_keys($analysis->paths));
echo "Total annotations: " . count($analysis->annotations) . "\n";

// dump config values we care about
file_put_contents('php://stdout', "Config annotations paths: ");
print_r(config('l5-swagger.paths.annotations'));
file_put_contents('php://stdout', "Config scanOptions.exclude: ");
print_r(config('l5-swagger.defaults.scanOptions.exclude'));

