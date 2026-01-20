<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Artwork;
use App\Models\Image;
use App\Models\User;
use App\Models\Category;

class ArtworkSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::inRandomOrder()->first();

        $category = Category::inRandomOrder()->first();

        if (!$user || !$category) {
            $this->command->error('Nema user-a ili category-ja u bazi.');
            return;
        }

        // Sve slike iz storage/app/public/images
        $files = Storage::disk('public')->files('images');

        if (count($files) === 0) {
            $this->command->warn('Nema slika u storage/app/public/images');
            return;
        }

        foreach ($files as $filePath) {

            // 1 artwork po slici (možeš lako menjati)
            $artwork = Artwork::create([
                'naziv' => pathinfo($filePath, PATHINFO_FILENAME),
                'opis' => 'Seeded artwork from storage images',
                'category_id' => $category->id,
                'user_id' => $user->id,
            ]);

            // poveži sliku
            Image::create([
                'title' => basename($filePath),
                'file_path' => $filePath,
                'artwork_id' => $artwork->id,
                'category_id' => $category->id,
                'user_id' => $user->id,
            ]);
        }

        $this->command->info('Artwork + images seeded successfully!');
    }
}
