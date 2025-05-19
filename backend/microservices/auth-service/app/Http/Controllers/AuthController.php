<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|string|min:8',
            ], [
                'name.required' => 'The name field is required.',
                'email.required' => 'The email field is required.',
                'email.email' => 'The email format is invalid.',
                'email.unique' => 'The email is already registered.',
                'password.required' => 'The password field is required.',
                'password.min' => 'The password must be at least 8 characters.'
            ]);
    
            $validated['role'] = 'user';
    
            $user = $this->authService->register($validated);
    
            return response()->json([
                'status' => 'success',
                'message' => 'User registered',
                'data' => $user,
                'error' => null
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'data' => null,
                'error' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed',
                'data' => null,
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ], [
                'email.required' => 'The email field is required.',
                'email.email' => 'The email format is invalid.',
                'password.required' => 'The password field is required.'
            ]);

            $token = $this->authService->login($credentials);

            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials',
                    'data' => null,
                    'error' => 'Email or password is incorrect.'
                ], 401);
            }
    
    
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => ['token' => $token],
                'error' => null
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'data' => null,
                'error' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed',
                'data' => null,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}