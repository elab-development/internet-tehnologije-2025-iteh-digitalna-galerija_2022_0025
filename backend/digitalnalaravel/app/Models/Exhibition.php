<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exhibition extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
    ];

    /**
     * Exhibition pripada User-u
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Exhibition ima mnogo Artwork-a (many-to-many)
     */
    public function artworks()
    {
        return $this->belongsToMany(Artwork::class, 'artwork_exhibition')->withTimestamps();
    }
}
