<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('artwork_exhibition', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artwork_id')->constrained('artworks')->onDelete('cascade');
            $table->foreignId('exhibition_id')->constrained('exhibitions')->onDelete('cascade');
            $table->timestamps();
            
            // Unique constraint - jedan artwork samo jednom po izložbi
            $table->unique(['artwork_id', 'exhibition_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artwork_exhibition');
    }
};
