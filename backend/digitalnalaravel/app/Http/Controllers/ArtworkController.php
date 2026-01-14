<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Auth;

class ArtworkController extends Controller
{
    // GET /api/artworks
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min(100, $perPage));

        $query = Artwork::where('user_id', $request->user()->id)
            ->with(['category', 'images']); // preload category i slike

        if ($request->filled('naziv')) {
            $query->where('naziv', 'like', '%' . $request->naziv . '%');
        }

        $artworks = $query->paginate($perPage);

        return response()->json($artworks);
    }

    // GET /api/artworks/{id}
    public function show(Request $request, Artwork $artwork)
    {
        // samo vlasnik vidi artwork
        if ($artwork->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json(
            $artwork->load(['category', 'images'])
        );
    }

    // POST /api/artworks
    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',

            // slika
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
        ]);

        $user = $request->user();

        // 1️⃣ KREIRAJ ARTWORK (bez slike)
        $artwork = Artwork::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'category_id' => $request->category_id,
            'user_id' => $user->id,
        ]);

        // 2️⃣ AKO POSTOJI SLIKA → UPLOAD + VEZA
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $file = $request->file('file');

            Image::create([
                'title' => $request->title ?? $file->getClientOriginalName(),
                'file_path' => $path,
                'artwork_id' => $artwork->id,
                'category_id' => $request->category_id,
                'user_id' => $user->id,
            ]);
        
        }

    // 3️⃣ VRATI ARTWORK SA SLIKAMA
    return response()->json([
        'message' => 'Artwork created with image',
        'artwork' => $artwork->load('images'),
    ], 201);
}

    // PUT/PATCH /api/artworks/{id}
    public function update(Request $request, Artwork $artwork)
    {
        // samo vlasnik može update
        if ($artwork->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $request->validate([
            'naziv' => 'sometimes|required|string|max:255',
            'opis' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120',
        ]);

        if ($request->filled('naziv')) $artwork->naziv = $request->naziv;
        if ($request->filled('opis')) $artwork->opis = $request->opis;
        if ($request->filled('category_id')) $artwork->category_id = $request->category_id;

        // upload nove cover slike
        if ($request->hasFile('file')) {
            // obriši prethodni fajl ako postoji
            if ($artwork->file_path && str_starts_with($artwork->file_path, 'artworks')) {
                Storage::disk('public')->delete($artwork->file_path);
            }
            $artwork->file_path = $request->file('file')->store('artworks', 'public');
        }

        $artwork->save();

        return response()->json([
            'message' => 'Artwork updated',
            'artwork' => $artwork
        ]);
    }

    // DELETE /api/artworks/{id}
    public function destroy(Request $request, Artwork $artwork)
    {
        // samo vlasnik može obrisati
        if ($artwork->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // obriši cover fajl ako postoji
        if ($artwork->file_path && str_starts_with($artwork->file_path, 'artworks')) {
            Storage::disk('public')->delete($artwork->file_path);
        }

        $artwork->delete();

        return response()->json(['message' => 'Artwork deleted']);
    }
}
