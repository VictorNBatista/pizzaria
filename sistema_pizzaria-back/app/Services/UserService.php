<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function getAllUsers()
    {
        return User::select('id', 'name', 'email', 'created_at')->paginate(10);
    }

    public function createUser(array $data)
    {
        $data['password'] = bcrypt($data['password']);
        return User::create($data);
    }

    public function getUserById($id)
    {
        return User::find($id);
    }

    public function updateUser($id, array $data)
    {
        $user = User::find($id);
        if ($user) {
            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }
            $user->update($data);
        }
        return $user;
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return true;
        }
        return false;
    }
}
