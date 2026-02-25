/**
 * Core Google API Client
 * This module centralizes all authentication and request logic for Google services.
 */

function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('google_access_token');
}

export async function googleFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAccessToken();
    if (!token) {
        throw new Error("UNAUTHORIZED: Google Access Token is missing. Please log in again.");
    }

    const baseUrl = 'https://www.googleapis.com';
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Google API Error [${response.status}]:`, errorBody);
        throw new Error(`Google API request failed with status ${response.status}`);
    }

    // Google APIs sometimes return 204 No Content for successful deletes/mutations
    if (response.status === 204) {
        return {} as T;
    }

    return await response.json();
}
