import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/login", "/signup"];

export default function proxy(request: NextRequest) {
    const hasSession = request.cookies.has("refresh_token") && request.cookies.get("refresh_token")?.value !== ""
    const isPublicPage = PUBLIC.includes(request.nextUrl.pathname)

    if (!isPublicPage && !hasSession) {
        const url = request.nextUrl.clone()
        url.pathname="/login"
        return NextResponse.redirect(url)
    } 

    if (isPublicPage && hasSession) {
        const url = request.nextUrl.clone()
        url.pathname="/words"
        return NextResponse.redirect(url)
    } 

    return NextResponse.next()
}

export const config= {
    matcher: ["/","/translate", "/words", "/words/:path", "/login", "/signup"]
}