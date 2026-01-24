<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];  // Ovo ostaje 'name'

    public function artworks() {
        return $this->hasMany(Artwork::class);
    }
    
    public function images() {
        return $this->hasMany(Image::class);
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'naziv' => $this->name, 
        ];
    }
}