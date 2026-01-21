<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        DB::table('users')->insert([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        DB::table('users')->insert([
            'name' => 'Guest',
            'email' => 'guest@example.com',
            'password' => Hash::make('password'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Emilija',
            'email' => 'ema@example.com',
            'password' => Hash::make('sifra456'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Marko',
            'email' => 'marko@example.com',
            'password' => Hash::make('marko123'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Nikola',
            'email' => 'nikola@example.com',
            'password' => Hash::make('nikola456'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Stefan',
            'email' => 'stefan@example.com',
            'password' => Hash::make('stefan789'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Luka',
            'email' => 'luka@example.com',
            'password' => Hash::make('luka321'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Ivan',
            'email' => 'ivan@example.com',
            'password' => Hash::make('ivan987'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Ana',
            'email' => 'ana@example.com',
            'password' => Hash::make('lozinka123'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Milica',
            'email' => 'milica@example.com',
            'password' => Hash::make('tajna789'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Jelena',
            'email' => 'jelena@example.com',
            'password' => Hash::make('password456'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Ivana',
            'email' => 'ivana@example.com',
            'password' => Hash::make('ivana321'),
            'role' => 'guest',
        ]);

        DB::table('users')->insert([
            'name' => 'Sara',
            'email' => 'sara@example.com',
            'password' => Hash::make('sara987'),
            'role' => 'guest',
        ]);


    }
}
