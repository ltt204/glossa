import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
    const hasSession = request.cookies.has("access_token")
    const isLoginpage = request.nextUrl.pathname === "/login"

    if (!isLoginpage && !hasSession) {
        const url = request.nextUrl.clone()
        url.pathname="/login"
        return NextResponse.redirect(url)
    } 

    if (isLoginpage && hasSession) {
        const url = request.nextUrl.clone()
        url.pathname="/"
        return NextResponse.redirect(url)
    } 

    return NextResponse.next()
}

export const config= {
    matcher: ["/", "/words/:path", "/login"]
}