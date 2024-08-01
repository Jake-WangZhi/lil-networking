export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/onboarding",
    "/goals",
    "/quote/:path*",
    "/contacts/:path*",
    "/settings/:path*",
  ],
};
