export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/onboarding",
    "/goals",
    "/quote",
    "/contacts/:path*",
    "/settings/:path*",
  ],
};
