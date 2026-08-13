"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "../api-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
export type LoginState = {message: string}

export async function signin(
    _prevState: LoginState, 
    formData: FormData
) : Promise<LoginState> {
    
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        return { message: "All fields are required"}
    }

    const res = await fetch (`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({email, password}),
        cache: "no-store"
    }).catch(() => null)

    if (!res) {
        return {message: "Could not reach the server."}
    }

    const body = await res.json().catch(() => null)
    if (!res.ok || typeof body !== 'object' || body === null) {
        return { message: body?.message ?? "Sign in failed." }
    }

    const {access_token, refresh_token} = body?.content ?? {};
    if (!access_token || !refresh_token) {
        return { message: "Sign in Failed."}
    }

    await cookieSetter(access_token, refresh_token)

    redirect("/");
}

export async function refreshAccessToken(){
    const cookieStore = await cookies();
    const currentRefreshToken = cookieStore.get("refresh_token")?.value;

    const res = await apiFetch("api/auth/refresh", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({refresh_token: currentRefreshToken}),
        cache: "no-store"
    })

    const data = await res.json().catch(() => null)
    if (!res.ok || typeof data !== 'object' || data === null) {
        return { message: data?.message ?? "Refresh token failed." }
    }

    const {access_token, refresh_token} = data.content;

    await cookieSetter(access_token, refresh_token);
}

export type SignUpState = {message: string}

export async function signup (
    _previousState: SignUpState,
    formData: FormData
) : Promise<SignUpState> {
    // const name = String(formData.get("name") ?? "")
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
        return { message: "All fields are required"}
    }

    const res = await fetch (`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({email, password}),
        cache: "no-store"
    }).catch(() => null)

    if (!res) {
        return { message: "Could not reach the server."}
    }

    const body = await res.json().catch(() => null)
    if (!res.ok || typeof body !== 'object' || body === null) {
        return { message: body?.message ?? "Sign up failed." }
    }

    const {access_token, refresh_token} = body?.content ?? {};
    if (!access_token || !refresh_token) {
        return { message: "Sign up Failed."}
    }

    await cookieSetter(access_token, refresh_token)

    redirect("/");
}

export async function cookieSetter(
    access_token: string,
    refresh_token: string
) {
    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production"

    cookieStore.set("access_token", access_token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
    })

    cookieStore.set("refresh_token", refresh_token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
    })
} 

export async function logout() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization" : `Bearer ${accessToken}`,
            },
            cache: "no-store"
        }).catch(() => null)
    }

    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")

    redirect("/login")
}