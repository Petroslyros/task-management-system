import type { UserLoginDTO } from "@/schemas/login";
import type { UserRegisterDTO } from "@/schemas/register";
import { handleResponse, API_URL } from "./api.common";

export type JwtTokenResponse = {
    token: string;
    username: string;
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    expiresAt: string;
};

export type AuthResponse = {
    success?: boolean;
    data: JwtTokenResponse;
};

export type RegisterResponse = {
    success?: boolean;
    data: {
        id: number;
        username: string;
    };
};

export async function login({ username, password }: UserLoginDTO): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/api/auth/login/access-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const result = await handleResponse<JwtTokenResponse>(res);
    return {
        success: true,
        data: result,
    };
}

export async function register({ email, username, password, firstname, lastname }: UserRegisterDTO): Promise<RegisterResponse> {
    // Only send the fields the backend expects, exclude confirmPassword
    const registerData = {
        email,
        username,
        password,
        firstname,
        lastname,
    };

    const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
    });

    const result = await handleResponse<{ id: number; username: string }>(res);
    return {
        success: true,
        data: result,
    };
}