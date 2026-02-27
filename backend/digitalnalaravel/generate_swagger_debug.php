<?php

require __DIR__ . '/vendor/autoload.php';

$dirs = [getcwd() . '/app/Swagger'];
echo "Scanning directories: \n" . implode("\n", $dirs) . "\n\n";

$openapi = \OpenApi\scan($dirs);

echo "Found path keys:\n";
print_r(array_keys($openapi->paths));

echo "\nWriting storage/api-docs/api-docs.json (if any paths)...\n";
if (!is_dir(__DIR__ . '/storage/api-docs')) {
    @mkdir(__DIR__ . '/storage/api-docs', 0755, true);
}

file_put_contents(__DIR__ . '/storage/api-docs/api-docs.json', $openapi->toJson());

echo "Wrote file (size): " . filesize(__DIR__ . '/storage/api-docs/api-docs.json') . " bytes\n";
