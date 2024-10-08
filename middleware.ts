import { NextResponse } from "next/server";
import { auth, BASE_PATH } from "@/auth";


const PROTECTED_PATHS = ["/chats", "/calls", "/friends", "/settings"];

export default auth(req => {
    const isLogged = req.auth;
    const reqUrl = new URL(req.url);
  
    if (!isLogged && PROTECTED_PATHS.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(
            new URL(`${BASE_PATH}/signin?callbackUrl=${encodeURIComponent(reqUrl.pathname)}`, req.url)
        )
    }
    return NextResponse.next()
})


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon|fonts|icons|login).*)']
}