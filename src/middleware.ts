import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { KeyLike, jwtVerify } from 'jose'
import { verifyAuth } from './app/lib/auth'


export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'


    const token = request.cookies.get('token')?.value

    const verifiedToken = token && (await verifyAuth(token).catch((err)=>{
        console.log(err);
    }))

    if(isPublicPath && verifiedToken){
        return NextResponse.redirect(new URL('/dashboard',request.nextUrl));
    }

    if(!isPublicPath && !verifiedToken){
        return NextResponse.redirect(new URL('/login',request.nextUrl));
    }
    

}


export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail',
        '/dashboard',
        '/analysis'
    ],
}