<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    use HasFactory;

    protected $fillable = [
        'naziv',
        'opis',
        'category_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class)->orderBy('id', 'asc');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
