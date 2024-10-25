<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

/**
 * Class UserUpdateRequest
 *
 * @package App\Http\Requests
 */
class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'string|max:50',
            'email' => 'string|email|max:255|unique:users,email,' . $this->route('user'),
            'password' => [
                'nullable',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'password_confirmation' => 'same:password'
        ];
    }

    public function messages()
    {
        return [
            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser uma string.',
            'max' => 'O campo :attribute deve ter no máximo :max caracteres.',
            'email' => 'O campo :attribute não é válido.',
            'unique' => 'O campo :attribute deve ser único.',
            'confirmed' => 'O campo :attribute não confere.',
            'same' => 'Os campos confirmação da senha e senha devem corresponder.',
            'min' => 'O campo :attribute deve ter no mínimo :min caracteres.',
            'password.letters' => 'O campo :attribute deve conter ao menos uma letra.',
            'password.mixed' => 'O campo :attribute deve conter ao menos uma letra maiúscula e uma letra minúscula.',
            'password.symbols' => 'O campo :attribute deve conter ao menos um símbolo.',
            'password.numbers' => 'O campo :attribute deve conter ao menos um número.'
        ];
    }
}
