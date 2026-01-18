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
    $perPage = (int) $request->query('per_page', 100);
    $perPage = max(1, min(100, $perPage));

    $query = Artwork::with(['category', 'images', 'user']);


    if ($request->filled('naziv')) {
        $query->where('naziv', 'like', '%' . $request->naziv . '%');
    }

    return response()->json(
        $query->paginate($perPage)
    );
}


   
    // GET /api/artworks/{id}  -> id korisnika
    public function show(Request $request, $id)
    {
        // samo vlasnik može videti svoje radove
        if ($request->user()->id != $id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // dohvat svih artwork-a za tog korisnika
        $artworks = Artwork::with(['category', 'images'])
            ->where('user_id', $id)
            ->get();

        return response()->json($artworks);
    }


    // POST /api/artworks
    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',

            // slike
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif,webp|max:10240',
        ]);

        $user = $request->user();

        // kreiramo artwork
        $artwork = Artwork::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'category_id' => $request->category_id,
            'user_id' => $user->id,
        ]);

        // više slika
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');

                Image::create([
                    'title' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'artwork_id' => $artwork->id,
                    'category_id' => $request->category_id,
                    'user_id' => $user->id,
                ]);
            }
        }

        
        return response()->json([
            'message' => 'Artwork created with image',
            'artwork' => $artwork->load('images'),
        ], 201);
    }

    // PUT/PATCH /api/artworks/{artwork}
    public function update(Request $request, Artwork $artwork)
    {
        if ($artwork->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // validacija
        $request->validate([
            'naziv' => 'sometimes|required|string|max:255',
            'opis' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif,webp|max:10240',
        ]);

        // 1. Ažuriraj tekstualne podatke
        $artwork->update($request->only(['naziv', 'opis', 'category_id']));

        // 2. Brisanje samo određenih slika (ako korisnik klikne na X)
        if ($request->has('delete_images')) {
            $idsToDelete = $request->input('delete_images'); // Niz ID-jeva slika
            $imagesToDelete = Image::whereIn('id', $idsToDelete)->where('artwork_id', $artwork->id)->get();
            
            foreach ($imagesToDelete as $oldImage) {
                Storage::disk('public')->delete($oldImage->file_path);
                $oldImage->delete();
            }
        }

        // 3. Dodavanje novih slika (bez brisanja preostalih starih)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');
                $artwork->images()->create([
                    'title' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'category_id' => $artwork->category_id,
                    'user_id' => $request->user()->id,
                ]);
            }
        }

        return response()->json(['artwork' => $artwork->load('images')]);
    }



    // DELETE /api/artworks/{artwork}
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

    public function destroyImage(Request $request, Image $image)
{
    // 1. Provera vlasnika
    if ($image->user_id !== $request->user()->id) {
        return response()->json(['error' => 'Forbidden'], 403);
    }

    // 2. Brisanje fajla sa storage-a
    if ($image->file_path && Storage::disk('public')->exists($image->file_path)) {
        Storage::disk('public')->delete($image->file_path);
    }

    // 3. Brisanje zapisa iz baze
    $image->delete();

    // 4. Povratna poruka
    return response()->json(['message' => 'Image deleted successfully']);
}

}
