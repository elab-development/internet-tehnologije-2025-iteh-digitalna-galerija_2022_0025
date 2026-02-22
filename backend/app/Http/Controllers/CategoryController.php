<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        // Validacija podataka radi zaštite od SQL Injection i XSS
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // Dodaj ostala polja po potrebi
        ]);
        return Category::create($validated);
    }
}
