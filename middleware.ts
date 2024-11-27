// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { isWorker } from './lib/utils';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    if (!req.auth) {
        const url = req.url.replace(req.nextUrl.pathname, '/');
        return Response.redirect(url);
    }

    if (req.nextUrl.pathname === '/dashboard') {
        if (isWorker(req.auth.user.role as string)) {
            const url = req.url.replace(
                req.nextUrl.pathname,
                '/dashboard/pemesanan'
            );
            return Response.redirect(url);
        }
    }
});

export const config = { matcher: ['/dashboard/:path*'] };
