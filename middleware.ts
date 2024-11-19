// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { getToken } from 'next-auth/jwt';
import { isWorker } from './lib/utils';

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET
});

export default auth(async (req) => {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET as string
  });

  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/');
    return Response.redirect(url);
  }

  // Check if the token exists
  if (!token) {
    const url = req.url.replace(req.nextUrl.pathname, '/');
    return Response.redirect(url);
  }

  if (req.nextUrl.pathname === '/dashboard') {
    if (isWorker(token.role as string)) {
      const url = req.url.replace(req.nextUrl.pathname, '/dashboard/pemesanan');
      return Response.redirect(url);
    }
  }
});

export const config = { matcher: ['/dashboard/:path*'] };
