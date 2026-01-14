<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    // GET /api/images
    public function index(Request $request)
    {
        $images = Image::where('user_id', $request->user()->id)
            ->with(['category', 'artwork'])
            ->get();

        return response()->json($images);
    }

    // POST /api/images/upload
    public function upload(Request $request)
    {
        $request->validate([
            'title'       => 'nullable|string|max:255',
            'file'        => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'category_id' => 'required|exists:categories,id',
            'artwork_id'  => 'nullable|exists:artworks,id',
        ]);

        $file = $request->file('file');
        $path = $file->store('images', 'public');

        $image = Image::create([
            'title'       => $request->title ?? $file->getClientOriginalName(),
            'file_path'   => $path,
            'category_id' => $request->category_id,
            'artwork_id'  => $request->artwork_id,
            'user_id'     => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Slika uspešno uploadovana',
            'image' => $image->load(['category', 'artwork'])
        ], 201);
    }

    // DELETE /api/images/{id}
    public function destroy(Request $request, $id)
    {
        $image = Image::findOrFail($id);

        if ($image->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        if ($image->file_path && Storage::disk('public')->exists($image->file_path)) {
            Storage::disk('public')->delete($image->file_path);
        }

        $image->delete();

        return response()->json(['message' => 'Slika obrisana']);
    }
}
