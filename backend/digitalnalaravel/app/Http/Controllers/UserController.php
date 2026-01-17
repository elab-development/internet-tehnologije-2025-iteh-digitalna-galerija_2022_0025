<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        // vraća ceo ulogovani User model kao JSON
        return response()->json($request->user());
    }
}
