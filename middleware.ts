import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the lightweight edge-safe config — no Prisma, stays well under 1MB limit.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor/:path*",
    "/editor",
    "/reports/:path*",
    "/reports",
    "/settings/:path*",
    "/settings",
    "/login",
  ],
};
