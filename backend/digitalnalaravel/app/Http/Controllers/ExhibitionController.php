<?php

namespace App\Http\Controllers;

use App\Models\Exhibition;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExhibitionController extends Controller
{
    /**
     * Sve javno dostupne izložbe
     */
    public function index()
    {
        return Exhibition::with(['user', 'artworks.images'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Pojedinačna izložba sa artwork-ima
     */
    public function show($id)
    {
        $exhibition = Exhibition::with(['user', 'artworks.images', 'artworks.category'])
            ->findOrFail($id);

        return $exhibition;
    }

    /**
     * Izložbe trenutno ulogovanog korisnika
     */
    public function userExhibitions()
    {
        $user = Auth::user();
        
        return Exhibition::where('user_id', $user->id)
            ->with(['artworks.images', 'artworks.category'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Kreiranje nove izložbe
     */
    public function store(Request $request)
    {
        // Validacija
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'artwork_ids' => 'required|array|min:1|max:3',
            'artwork_ids.*' => 'integer|exists:artworks,id',
        ]);

        $user = Auth::user();

        // Provera da svi artwork-i pripadaju trenutnom korisniku
        $artworks = Artwork::whereIn('id', $validated['artwork_ids'])
            ->where('user_id', $user->id)
            ->get();

        if ($artworks->count() !== count($validated['artwork_ids'])) {
            return response()->json([
                'message' => 'Jedan ili više artwork-a ne pripada vašoj kolekciji.',
            ], 403);
        }

        // Kreiraj izložbu
        $exhibition = Exhibition::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'user_id' => $user->id,
        ]);

        // Dodaj artwork-e u izložbu
        $exhibition->artworks()->attach($validated['artwork_ids']);

        return response()->json([
            'message' => 'Izložba je uspešno kreirana!',
            'exhibition' => Exhibition::with(['user', 'artworks.images', 'artworks.category'])->find($exhibition->id),
        ], 201);
    }

    /**
     * Ažuriranje izložbe
     */
    public function update(Request $request, Exhibition $exhibition)
    {
        // Provera da li korisnik poseduje ovu izložbu
        if ($exhibition->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Nemate dozvolu da uređujete ovu izložbu.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'artwork_ids' => 'sometimes|array|min:1|max:3',
            'artwork_ids.*' => 'integer|exists:artworks,id',
        ]);

        // Ažuriranje osnovnih informacija
        if (isset($validated['name'])) {
            $exhibition->name = $validated['name'];
        }
        if (isset($validated['description'])) {
            $exhibition->description = $validated['description'];
        }

        // Ažuriranje artwork-a ako je prosleđeno
        if (isset($validated['artwork_ids'])) {
            $user = Auth::user();
            $artworks = Artwork::whereIn('id', $validated['artwork_ids'])
                ->where('user_id', $user->id)
                ->get();

            if ($artworks->count() !== count($validated['artwork_ids'])) {
                return response()->json([
                    'message' => 'Jedan ili više artwork-a ne pripada vašoj kolekciji.',
                ], 403);
            }

            $exhibition->artworks()->sync($validated['artwork_ids']);
        }

        $exhibition->save();

        return response()->json([
            'message' => 'Izložba je uspešno ažurirana!',
            'exhibition' => Exhibition::with(['user', 'artworks.images', 'artworks.category'])->find($exhibition->id),
        ]);
    }

    /**
     * Brisanje izložbe
     */
    public function destroy(Exhibition $exhibition)
    {
        // Provera da li korisnik poseduje ovu izložbu
        if ($exhibition->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Nemate dozvolu da obrišete ovu izložbu.',
            ], 403);
        }

        $exhibition->delete();

        return response()->json([
            'message' => 'Izložba je uspešno obrisana!',
        ]);
    }
}
