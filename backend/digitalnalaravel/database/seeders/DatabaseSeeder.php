<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Kategorije
        $this->call(CategorySeeder::class);

        // 2️⃣ User-i (tvoji ručni inserti)
        $this->call(UserSeeder::class);

        // 3️⃣ Artwork + slike
        $this->call(ArtworkSeeder::class);
    }
}
