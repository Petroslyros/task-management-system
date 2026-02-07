import { getCookie } from "@/utils/cookies";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:5001";

export function getAuthHeaders(): HeadersInit {
    const token = getCookie("jwt_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();

    if (!res.ok) {
        const errorMessage = data?.message || `HTTP Error: ${res.status}`;
        throw new Error(errorMessage);
    }

    return data.data || data;
}

export { API_URL };