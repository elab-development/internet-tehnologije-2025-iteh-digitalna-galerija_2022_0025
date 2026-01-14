<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesTable extends Migration
{
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('file_path');

            // 🔗 VEZA SA ARTWORKOM (OVDE IDE)
            $table->foreignId('artwork_id')
                ->constrained('artworks')
                ->cascadeOnDelete();

            // kategorija (ako slika ima svoju kategoriju)
            $table->foreignId('category_id')
                ->constrained('categories')
                ->cascadeOnDelete();

            // korisnik (autor slike)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('images');
    }
}
