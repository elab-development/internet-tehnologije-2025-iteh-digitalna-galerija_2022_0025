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
        ])->header('Access-Control-Allow-Origin', 'http://localhost:5173')->header('Access-Control-Allow-Credentials', 'true');
    })
    ->name('profile');





use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

// Simple API endpoints (dev/demo) to register/login/logout and support CORS with credentials
Route::options('{any}', function () {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// Register (creates a user and logs them in)
Route::post('/register', function (Request $request) {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
    ]);

    Auth::login($user);

    return response()->json(['message' => 'Registered and logged in'])->header('Access-Control-Allow-Origin', 'http://localhost:5173')->header('Access-Control-Allow-Credentials', 'true');
});

// Login (email + password)
Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return response()->json(['message' => 'Logged in'])->header('Access-Control-Allow-Origin', 'http://localhost:5173')->header('Access-Control-Allow-Credentials', 'true');
    }

    return response()->json(['message' => 'Invalid credentials'], 401)->header('Access-Control-Allow-Origin', 'http://localhost:5173')->header('Access-Control-Allow-Credentials', 'true');
});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['message' => 'Logged out'])->header('Access-Control-Allow-Origin', 'http://localhost:5173')->header('Access-Control-Allow-Credentials', 'true');
});

// Keep simple GET stubs for missing auth UI to avoid redirects
if (!Route::has('login')) {
    Route::get('/login', function () {
        return 'Login page (stub) — implement auth or install Breeze/Jetstream.';
    })->name('login');

    Route::get('/register', function () {
        return 'Register page (stub)';
    })->name('register');
}

