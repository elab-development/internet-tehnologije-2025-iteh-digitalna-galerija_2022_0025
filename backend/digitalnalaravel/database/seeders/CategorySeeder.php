<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Painting', 'Drawing', 'Sculpture', 'Photography', 'Digital Art'];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
