export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Authenticated app routes
    "/dashboard/:path*",
    "/editor/:path*",
    "/editor",
    "/reports/:path*",
    "/reports",
    "/settings/:path*",
    "/settings",
    // Login page (redirect to dashboard if already signed in)
    "/login",
  ],
};
