<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExhibitionController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('artworks', [ArtworkController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

// Javno dostupne izložbe
Route::get('exhibitions', [ExhibitionController::class, 'index']);
Route::get('exhibitions/{id}', [ExhibitionController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    // Artworks – sve osim index
    Route::get('artworks/user', [ArtworkController::class, 'userArtworks']);
    Route::get('artworks/{id}', [ArtworkController::class, 'show']);
    Route::post('artworks', [ArtworkController::class, 'store']);
    Route::put('artworks/{artwork}', [ArtworkController::class, 'update']);
    Route::delete('artworks/{artwork}', [ArtworkController::class, 'destroy']);

    Route::post('images/upload', [ImageController::class, 'upload'])
        ->middleware('throttle:10,1');

    Route::get('images', [ImageController::class, 'index']);
    Route::delete('images/{id}', [ImageController::class, 'destroy']);
    Route::get('images/external', [ImageController::class, 'fetchExternalImages']);

    // Zaštićene izložbe rute - PRVO specifičnije rute (user), PA onda opšta ({id})
    Route::get('exhibitions/user', [ExhibitionController::class, 'userExhibitions']);
    Route::post('exhibitions', [ExhibitionController::class, 'store']);
    Route::put('exhibitions/{exhibition}', [ExhibitionController::class, 'update']);
    Route::delete('exhibitions/{exhibition}', [ExhibitionController::class, 'destroy']);
    
    Route::get('/user', [UserController::class, 'getUser']);

    
});


