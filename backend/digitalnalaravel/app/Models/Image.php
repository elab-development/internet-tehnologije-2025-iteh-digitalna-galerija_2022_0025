<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = [
        'title',
        'file_path',
        'category_id',
        'artwork_id',
        'user_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function artwork()
    {
        return $this->belongsTo(Artwork::class);
    }
}
