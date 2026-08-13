import "server-only"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function apiFetch(path: string, request: RequestInit) {
    const fullpath =  `${API_URL}/${path}`
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")

    const headers = new Headers(request.headers)

    if (access_token) {
        headers.set("Authorization", `Bearer ${access_token.value}`)
    }
    
    const response = await fetch(fullpath, { ...request, headers, cache: "no-store"})

    if (response.status === 401) {
        console.log("Hit UNAUTHORIZED. Start to refresh the token...")
        const tokens = await refreshAccessToken()

        console.log("Refreshing response: ", tokens)
        if (tokens) {
            headers.set("Authorization", `Bearer ${tokens.access_token}`)
            console.log("Token refreshed successfully. Retry the request...")
            return await fetch(fullpath, { ...request, headers, cache: "no-store"})
        }
        
        console.log("Failed to refresh tokens")
    }

    return response
}

async function refreshAccessToken() : Promise<{
    access_token: string;
    refresh_token: string;
} | null> {
    const cookieStore = await cookies();
    const currentRefreshToken = cookieStore.get("refresh_token")?.value;
    
    if (currentRefreshToken) {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh_token: currentRefreshToken
            })
        })
        
        
        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json().then((res: any) => res.content);
            cookieStore.set("access_token", refreshData.access_token);
            cookieStore.set("refresh_token", refreshData.refresh_token);
            return refreshData
        }
    }
    return null
}