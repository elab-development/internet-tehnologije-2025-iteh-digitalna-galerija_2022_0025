<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Kreiraj novog korisnika
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        return response()->json([
            'message' => 'User registered!',
            'user' => $user->only(['id', 'name', 'email']),
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Ako korisnik ne postoji ili lozinka nije ispravna
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Wrong email or password.'
            ], 401);
        }

        // Kreiraj novi token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Vrati token i role
        return response()->json([
            'message' => 'Successfully logged in',
            'token' => $token,
            'role' => $user->role
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized.'
            ], 401);
        }

        // Obriši sve aktivne tokene korisnika
        $user->tokens()->delete();

        return response()->json([
            'message' => 'You have been logged out.'
        ]);
    }
}
