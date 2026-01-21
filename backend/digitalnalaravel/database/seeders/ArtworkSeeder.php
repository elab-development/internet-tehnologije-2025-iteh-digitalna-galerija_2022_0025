<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Artwork;
use App\Models\Image;
use App\Models\User;
use App\Models\Category;

class ArtworkSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();

        // starter slike koje držiš u repou
        $files = File::files(public_path('images'));

        if ($users->isEmpty() || $categories->isEmpty() || empty($files)) {
            $this->command->error('Users, categories ili images folder nisu dostupni.');
            return;
        }

        shuffle($files);

        while (!empty($files)) {

            $user = $users->random();
            $category = $categories->random();
            $imageCount = rand(1, 3);

            $selectedImages = array_splice($files, 0, $imageCount);
            if (empty($selectedImages)) break;

            $artwork = Artwork::create([
                'naziv' => Str::title(str_replace('-', ' ', pathinfo($selectedImages[0], PATHINFO_FILENAME))),
                'opis' => $this->randomDescription(),
                'category_id' => $category->id,
                'user_id' => $user->id,
            ]);

            foreach ($selectedImages as $filePath) {
                $fileName = basename($filePath);

                // ⬇ KOPIRAMO u storage (isto kao upload)
                Storage::disk('public')->put(
                    'images/' . $fileName,
                    File::get($filePath)
                );

                Image::create([
                    'title' => $fileName,
                    'file_path' => 'images/' . $fileName, // ISTO kao controller
                    'artwork_id' => $artwork->id,
                    'category_id' => $category->id,
                    'user_id' => $user->id,
                ]);
            }
        }

        $this->command->info('Artworks seeded using storage images.');
    }

    private function randomDescription(): string
    {
        return collect([
            'Eksperiment sa bojama i teksturama koji istražuje emociju trenutka.',
            'Vizuelna interpretacija ličnog doživljaja prostora i forme.',
            'Rad inspirisan urbanim pejzažima i svakodnevnim životom.',
            'Apstraktna kompozicija koja balansira između haosa i reda.',
            'Intiman prikaz unutrašnjeg sveta autora kroz simboliku boja.',
            'Delo koje spaja tradiciju i savremeni umetnički izraz.',
            'Istraživanje svetla, senke i pokreta u statičnoj formi.',
        ])->random();
    }
}
