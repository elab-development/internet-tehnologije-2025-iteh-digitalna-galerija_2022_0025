<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Artwork;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Dobij statistike za admin dashboard
     */
    public function getStatistics(Request $request)
    {
        // Provjera da li je korisnik admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Broj korisnika
        $totalUsers = User::count();
        $adminUsers = User::where('role', 'admin')->count();
        $guestUsers = User::where('role', 'guest')->count();

        // Broj artwork-a
        $totalArtworks = Artwork::count();
        $userArtworks = Artwork::count(); // ili možeš da prebrojiš po korisniku

        // Artworks po kategorijama
        $artworksByCategory = Category::withCount('artworks')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'count' => $category->artworks_count,
                ];
            });

        // Najčešće kategorije (top 5)
        $topCategories = Category::withCount('artworks')
            ->orderBy('artworks_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->artworks_count,
                ];
            });

        // Broj slika
        $totalImages = DB::table('images')->count();

        // Korisnici sa najviše artwork-a
        $topArtists = User::withCount('artworks')
            ->where('role', 'guest')
            ->orderBy('artworks_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => $user->name,
                    'artworks_count' => $user->artworks_count,
                ];
            });

        return response()->json([
            'totalUsers' => $totalUsers,
            'adminUsers' => $adminUsers,
            'guestUsers' => $guestUsers,
            'totalArtworks' => $totalArtworks,
            'totalImages' => $totalImages,
            'artworksByCategory' => $artworksByCategory,
            'topCategories' => $topCategories,
            'topArtists' => $topArtists,
            'timestamp' => now(),
        ]);
    }
}
