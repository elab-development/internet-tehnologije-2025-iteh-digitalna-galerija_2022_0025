<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];

    public function artworks() {
        return $this->hasMany(Artwork::class);
    }
    
    public function images() {
        return $this->hasMany(Image::class);
    }
    
    // Accessor za naziv (ako frontend treba 'naziv' property)
    public function getNazivAttribute()
    {
        return $this->name;
    }
}