import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "../config";

const PUBLIC_PATHS = ['/login', '/register', ];

export async function middleware(request: NextRequest) {
  try {
    // console.log(`🚀 Middleware running for path: ${request.nextUrl.pathname}`);

    return authMiddleware(request, {
      loginPath: "/api/login",
      logoutPath: "/api/logout",
      apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      cookieSerializeOptions: serverConfig.cookieSerializeOptions,
      serviceAccount: serverConfig.serviceAccount,

      handleValidToken: async (data, headers) => {
        const { token, decodedToken } = data;
        const requestedPath = request.nextUrl.pathname;

        // console.log(`✅ Token: ${token}`);
        // console.log(`✅ Decoded Token:`, decodedToken);

        if (PUBLIC_PATHS.includes(requestedPath)) {
          console.log(`🔄 Redirecting authenticated user from ${requestedPath} to home`);
          return redirectToHome(request);
        }

        console.log(`➡️ Allowing access to: ${requestedPath}`);
        return NextResponse.next({
          request: {
            headers
          }
        });
      },

      handleInvalidToken: async (reason) => {
        const requestedPath = request.nextUrl.pathname;

        // console.warn(`⚠️ Invalid or missing token for path: ${requestedPath}`, { reason });

        if (PUBLIC_PATHS.includes(requestedPath)) {
          // console.log(`➡️ Allowing unauthenticated access to: ${requestedPath}`);
          return NextResponse.next();
        }

        console.log(`🔄 Redirecting unauthenticated user from ${requestedPath} to login`);
        return redirectToLogin(request, {
          path: '/login',
          publicPaths: PUBLIC_PATHS
        });
      },

      handleError: async (error) => {
        // console.error('🔥 Unhandled authentication error:', error);

        return redirectToLogin(request, {
          path: '/login',
          publicPaths: PUBLIC_PATHS
        });
      }
    });

  } catch (error) {
    console.error(' Middleware encountered an unexpected error:', error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: [
    '/',
    '/profile',
    "/api/login",
    "/api/logout",
    "/((?!_next|static|public|.*\\..*|/login|/register|).*)", // Apply middleware to all pages except specified paths
  ],
};
