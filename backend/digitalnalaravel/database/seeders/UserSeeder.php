<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Prvo proveri da li već postoje korisnici
        $existingUsers = DB::table('users')->pluck('email')->toArray();
        
        // Lista korisnika koje želimo da kreiramo
        $users = [
            [
                'name' => 'Admin',
                'email' => 'tina@gmail.com', // OVO JE BITNO - TVOJ LOGIN
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'User',
                'email' => 'user@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
            ],
            [
                'name' => 'Guest',
                'email' => 'guest@example.com',
                'password' => Hash::make('password'),
                'role' => 'guest',
            ],
            [
                'name' => 'Emilija',
                'email' => 'ema@example.com',
                'password' => Hash::make('sifra456'),
                'role' => 'guest',
            ],
            [
                'name' => 'Marko',
                'email' => 'marko@example.com',
                'password' => Hash::make('marko123'),
                'role' => 'guest',
            ],
            [
                'name' => 'Nikola',
                'email' => 'nikola@example.com',
                'password' => Hash::make('nikola456'),
                'role' => 'guest',
            ],
            [
                'name' => 'Stefan',
                'email' => 'stefan@example.com',
                'password' => Hash::make('stefan789'),
                'role' => 'guest',
            ],
            [
                'name' => 'Luka',
                'email' => 'luka@example.com',
                'password' => Hash::make('luka321'),
                'role' => 'guest',
            ],
            [
                'name' => 'Ivan',
                'email' => 'ivan@example.com',
                'password' => Hash::make('ivan987'),
                'role' => 'guest',
            ],
            [
                'name' => 'Ana',
                'email' => 'ana@example.com',
                'password' => Hash::make('lozinka123'),
                'role' => 'guest',
            ],
            [
                'name' => 'Milica',
                'email' => 'milica@example.com',
                'password' => Hash::make('tajna789'),
                'role' => 'guest',
            ],
            [
                'name' => 'Jelena',
                'email' => 'jelena@example.com',
                'password' => Hash::make('password456'),
                'role' => 'guest',
            ],
            [
                'name' => 'Ivana',
                'email' => 'ivana@example.com',
                'password' => Hash::make('ivana321'),
                'role' => 'guest',
            ],
            [
                'name' => 'Sara',
                'email' => 'sara@example.com',
                'password' => Hash::make('sara987'),
                'role' => 'guest',
            ],
            [
                'name' => 'Jana',
                'email' => 'jana@gmail.com',
                'password' => Hash::make('jana123'),
                'role' => 'admin',
            ],
        ];

        // Kreiraj samo korisnike koji već ne postoje
        foreach ($users as $user) {
            if (!in_array($user['email'], $existingUsers)) {
                DB::table('users')->insert($user);
            }
        }
    }
}