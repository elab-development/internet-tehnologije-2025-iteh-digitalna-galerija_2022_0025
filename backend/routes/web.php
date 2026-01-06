<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;


Route::get('/', function () {
    return view('welcome');
});

// Nova ruta za JSON odgovor
Route::get('/pozdrav', function () {
    return response()->json([
        'poruka' => 'Zdravo iz Laravel backenda!'
    ]);
});


Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);

