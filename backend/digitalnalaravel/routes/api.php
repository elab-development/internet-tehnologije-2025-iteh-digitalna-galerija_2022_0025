<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('artworks', [ArtworkController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {

    // Artworks – sve osim index
    Route::get('artworks/{id}', [ArtworkController::class, 'show']);
    Route::post('artworks', [ArtworkController::class, 'store']);
    Route::put('artworks/{artwork}', [ArtworkController::class, 'update']);
    Route::delete('artworks/{artwork}', [ArtworkController::class, 'destroy']);

    Route::post('images/upload', [ImageController::class, 'upload'])
        ->middleware('throttle:10,1');

    Route::get('images', [ImageController::class, 'index']);
    Route::delete('images/{id}', [ImageController::class, 'destroy']);
    Route::get('images/external', [ImageController::class, 'fetchExternalImages']);

    
    Route::get('/user', [UserController::class, 'getUser']);
});


