export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/goals",
    "/quote/:path*",
    "/contacts/:path*",
    "/settings/:path*",
  ],
};
