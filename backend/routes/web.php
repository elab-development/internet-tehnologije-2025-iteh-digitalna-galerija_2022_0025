<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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

// Zaštićena ruta — pristup samo autentifikovanom korisniku

Route::middleware('auth')
    ->get('/profile', function () {
        return response()->json([
            'message' => 'Ovo vidi samo ulogovan korisnik'
        ]);
    })
    ->name('profile');





// Fallback login/register stubs to avoid redirect errors when auth UI is not installed
// Remove these stubs if you have a real auth setup (Breeze / Jetstream / Fortify)
if (!Route::has('login')) {
    Route::get('/login', function () {
        return 'Login page (stub) — implement auth or install Breeze/Jetstream.';
    })->name('login');

    Route::get('/register', function () {
        return 'Register page (stub)';
    })->name('register');
}

